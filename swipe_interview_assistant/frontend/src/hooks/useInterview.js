import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setCurrentQuestion, 
  addMessage, 
  setInterviewStatus, 
  submitAnswer,
  moveToNextQuestion,
  completeInterview 
} from '../store/slices/interviewSlice';
import { addCandidate } from '../store/slices/candidateSlice';
import { generateQuestion, evaluateAnswer } from '../services/aiService';

const useInterview = () => {
  const dispatch = useDispatch();
  const { 
    currentQuestion, 
    messages, 
    interviewStatus, 
    currentQuestionIndex,
    answers 
  } = useSelector(state => state.interview);
  const { resumeData } = useSelector(state => state.resume);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Start the interview
  const startInterview = useCallback(async () => {
    if (interviewStatus === 'in-progress') return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      dispatch(setInterviewStatus('in-progress'));
      
      // Generate first question
      const firstQuestion = await generateQuestion(0, 'easy');
      dispatch(setCurrentQuestion(firstQuestion));
      
      // Add welcome message and first question
      dispatch(addMessage({
        type: 'system',
        content: 'Welcome to your technical interview! The interview will consist of 6 questions (2 Easy, 2 Medium, 2 Hard). Good luck!',
        timestamp: new Date().toISOString()
      }));
      
      dispatch(addMessage({
        type: 'question',
        content: firstQuestion.text,
        difficulty: firstQuestion.difficulty,
        timestamp: new Date().toISOString()
      }));
      
    } catch (err) {
      setError('Failed to start interview. Please try again.');
      console.error('Error starting interview:', err);
      dispatch(setInterviewStatus('ready'));
    } finally {
      setIsLoading(false);
    }
  }, [interviewStatus, dispatch]);

  // Submit an answer and get next question
  const submitAnswerAndContinue = useCallback(async (answerText) => {
    if (!currentQuestion || !answerText.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Add user answer to chat
      dispatch(addMessage({
        type: 'answer',
        content: answerText,
        timestamp: new Date().toISOString()
      }));

      // Submit answer for evaluation
      dispatch(submitAnswer({
        questionId: currentQuestion.id,
        answer: answerText,
        questionIndex: currentQuestionIndex
      }));

      // Evaluate answer using AI
      const evaluation = await evaluateAnswer(
        currentQuestion.text, 
        answerText, 
        currentQuestion.difficulty
      );
      
      // Add AI evaluation to chat
      dispatch(addMessage({
        type: 'evaluation',
        content: evaluation.feedback,
        score: evaluation.score,
        timestamp: new Date().toISOString()
      }));

      // Check if interview is complete
      if (currentQuestionIndex >= 5) {
        completeInterviewProcess();
        return;
      }

      // Generate next question
      const nextIndex = currentQuestionIndex + 1;
      const nextDifficulty = getDifficultyForIndex(nextIndex);
      
      const nextQuestion = await generateQuestion(nextIndex, nextDifficulty);
      dispatch(setCurrentQuestion(nextQuestion));
      
      // Add next question to chat
      dispatch(addMessage({
        type: 'question',
        content: nextQuestion.text,
        difficulty: nextQuestion.difficulty,
        timestamp: new Date().toISOString()
      }));

      // Move to next question in state
      dispatch(moveToNextQuestion());

    } catch (err) {
      setError('Error processing your answer. Please try again.');
      console.error('Error submitting answer:', err);
      
      // Add error message to chat
      dispatch(addMessage({
        type: 'error',
        content: 'Sorry, there was an error processing your answer. Please continue with the next question.',
        timestamp: new Date().toISOString()
      }));

      // Move to next question even on error to continue interview
      if (currentQuestionIndex < 5) {
        const nextIndex = currentQuestionIndex + 1;
        const nextDifficulty = getDifficultyForIndex(nextIndex);
        
        const nextQuestion = await generateQuestion(nextIndex, nextDifficulty);
        dispatch(setCurrentQuestion(nextQuestion));
        dispatch(moveToNextQuestion());
        
        dispatch(addMessage({
          type: 'question',
          content: nextQuestion.text,
          difficulty: nextDifficulty,
          timestamp: new Date().toISOString()
        }));
      } else {
        completeInterviewProcess();
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestion, currentQuestionIndex, dispatch]);

  // Complete the interview process
  const completeInterviewProcess = useCallback(() => {
    // Calculate final score
    const finalScore = answers.length > 0 
      ? Math.round(answers.reduce((total, answer) => total + answer.score, 0) / answers.length)
      : 0;
    
    // Generate summary based on performance
    const summary = generateSummary(answers, finalScore);
    
    // Add completion message
    dispatch(addMessage({
      type: 'system',
      content: `Interview completed! Your final score is ${finalScore}/100. ${getPerformanceMessage(finalScore)}`,
      timestamp: new Date().toISOString()
    }));

    // Add candidate to database
    dispatch(addCandidate({
      id: `candidate_${Date.now()}`,
      name: resumeData?.name || 'Anonymous Candidate',
      email: resumeData?.email || '',
      phone: resumeData?.phone || '',
      score: finalScore,
      summary,
      interviewDate: new Date().toISOString(),
      answers: [...answers]
    }));

    // Mark interview as completed
    dispatch(completeInterview());
  }, [answers, resumeData, dispatch]);

  // Get difficulty level based on question index
  const getDifficultyForIndex = useCallback((index) => {
    if (index < 2) return 'easy';
    if (index < 4) return 'medium';
    return 'hard';
  }, []);

  // Generate performance summary
  const generateSummary = useCallback((answers, finalScore) => {
    const strengths = answers.filter(a => a.score >= 70).length;
    const weaknesses = answers.filter(a => a.score < 60).length;
    
    let summary = `Candidate scored ${finalScore}/100 overall. `;
    
    if (finalScore >= 80) {
      summary += `Demonstrated excellent understanding of full-stack concepts with strong performance across ${strengths} out of 6 questions. `;
    } else if (finalScore >= 60) {
      summary += `Showed good competency with solid performance in ${strengths} areas while needing improvement in ${weaknesses} areas. `;
    } else {
      summary += `Displayed basic understanding but requires significant improvement, particularly in ${weaknesses} key areas. `;
    }
    
    summary += `Strongest in ${getStrongestArea(answers)}.`;
    return summary;
  }, []);

  // Get strongest area based on answers
  const getStrongestArea = useCallback((answers) => {
    const areas = {};
    answers.forEach(answer => {
      if (answer.score >= 70) {
        const area = answer.difficulty || 'technical concepts';
        areas[area] = (areas[area] || 0) + 1;
      }
    });
    
    const strongest = Object.entries(areas).sort((a, b) => b[1] - a[1])[0];
    return strongest ? `${strongest[0]} questions` : 'various technical concepts';
  }, []);

  // Get performance message for final score
  const getPerformanceMessage = useCallback((score) => {
    if (score >= 80) return 'Outstanding performance!';
    if (score >= 60) return 'Good job!';
    return 'Keep practicing to improve your skills.';
  }, []);

  // Reset interview
  const resetInterview = useCallback(() => {
    dispatch(setInterviewStatus('ready'));
    setError(null);
    setIsLoading(false);
  }, [dispatch]);

  return {
    // State
    currentQuestion,
    messages,
    interviewStatus,
    currentQuestionIndex,
    answers,
    isLoading,
    error,
    
    // Actions
    startInterview,
    submitAnswer: submitAnswerAndContinue,
    resetInterview,
    
    // Utilities
    isInterviewComplete: interviewStatus === 'completed',
    isInterviewInProgress: interviewStatus === 'in-progress',
    totalQuestions: 6,
    progress: ((currentQuestionIndex + 1) / 6) * 100,
    
    // Error handling
    clearError: () => setError(null)
  };
};

export default useInterview;