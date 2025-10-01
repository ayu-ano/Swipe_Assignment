import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Clock, User, Bot } from 'lucide-react';
import { generateQuestion, evaluateAnswer } from '../../services/aiService';
import { 
  setCurrentQuestion, 
  addMessage, 
  setInterviewStatus, 
  setTimer,
  submitAnswer 
} from '../../store/slices/interviewSlice';
import { addCandidate } from '../../store/slices/candidateSlice';
import QuestionCard from './QuestionCard';
import Timer from './Timer';
import ProgressIndicator from './ProgressIndicator';
import MissingFieldsForm from './MissingFieldsForm';
import InterviewComplete from './InterviewComplete';
import useAutoSubmit from '../../hooks/useAutoSubmit';

const ChatInterface = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [inputMessage, setInputMessage] = useState('');
  
  const { 
    currentQuestion, 
    messages, 
    interviewStatus, 
    timer,
    currentQuestionIndex,
    answers 
  } = useSelector(state => state.interview);
  
  const { resumeData, missingFields } = useSelector(state => state.resume);

  // Auto-submit hook for timer expiration
  useAutoSubmit();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start interview if all fields are complete
  useEffect(() => {
    if (interviewStatus === 'ready' && missingFields.length === 0) {
      startInterview();
    }
  }, [interviewStatus, missingFields]);

  const startInterview = async () => {
    dispatch(setInterviewStatus('in-progress'));
    
    // Generate first question
    try {
      const firstQuestion = await generateQuestion(0, 'easy'); // First easy question
      dispatch(setCurrentQuestion(firstQuestion));
      dispatch(addMessage({
        type: 'question',
        content: firstQuestion.text,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error starting interview:', error);
      dispatch(addMessage({
        type: 'error',
        content: 'Failed to start interview. Please try again.',
        timestamp: new Date().toISOString()
      }));
    }
  };

  const handleSubmitAnswer = async () => {
    if (!inputMessage.trim() || !currentQuestion) return;

    const userAnswer = inputMessage.trim();
    
    // Add user message to chat
    dispatch(addMessage({
      type: 'answer',
      content: userAnswer,
      timestamp: new Date().toISOString()
    }));

    setInputMessage('');

    // Submit answer for evaluation
    dispatch(submitAnswer({
      questionId: currentQuestion.id,
      answer: userAnswer,
      questionIndex: currentQuestionIndex
    }));

    // Evaluate answer and get next question
    try {
      const evaluation = await evaluateAnswer(currentQuestion.text, userAnswer, currentQuestion.difficulty);
      
      // Add AI evaluation message
      dispatch(addMessage({
        type: 'evaluation',
        content: evaluation.feedback,
        score: evaluation.score,
        timestamp: new Date().toISOString()
      }));

      // Check if interview is complete
      if (currentQuestionIndex >= 5) { // 0-5 = 6 questions
        completeInterview();
        return;
      }

      // Generate next question based on progression
      const nextIndex = currentQuestionIndex + 1;
      let nextDifficulty = 'easy';
      if (nextIndex >= 2 && nextIndex < 4) nextDifficulty = 'medium';
      if (nextIndex >= 4) nextDifficulty = 'hard';

      const nextQuestion = await generateQuestion(nextIndex, nextDifficulty);
      dispatch(setCurrentQuestion(nextQuestion));
      
      // Add next question to chat
      dispatch(addMessage({
        type: 'question',
        content: nextQuestion.text,
        timestamp: new Date().toISOString()
      }));

    } catch (error) {
      console.error('Error evaluating answer:', error);
      dispatch(addMessage({
        type: 'error',
        content: 'Error evaluating your answer. Moving to next question.',
        timestamp: new Date().toISOString()
      }));
    }
  };

  const completeInterview = () => {
    dispatch(setInterviewStatus('completed'));
    
    // Calculate final score and create summary
    const finalScore = answers.reduce((total, answer) => total + answer.score, 0) / answers.length;
    const summary = `Candidate showed ${finalScore >= 80 ? 'excellent' : finalScore >= 60 ? 'good' : 'basic'} understanding of full-stack concepts.`;
    
    // Add candidate to list
    dispatch(addCandidate({
      id: Date.now().toString(),
      name: resumeData.name,
      email: resumeData.email,
      phone: resumeData.phone,
      score: Math.round(finalScore),
      summary,
      interviewDate: new Date().toISOString(),
      answers: [...answers]
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  // Show missing fields form if required fields are missing
  if (missingFields.length > 0 && interviewStatus !== 'completed') {
    return <MissingFieldsForm />;
  }

  // Show interview complete screen
  if (interviewStatus === 'completed') {
    return <InterviewComplete />;
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header with Progress and Timer */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Technical Interview</h2>
          {interviewStatus === 'in-progress' && (
            <div className="flex items-center space-x-4">
              <ProgressIndicator />
              <Timer />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">
          Full-Stack (React/Node.js) Position
        </p>
      </div>

      {/* Current Question Card */}
      {currentQuestion && interviewStatus === 'in-progress' && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <QuestionCard question={currentQuestion} />
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === 'answer' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.type === 'answer' ? 'flex-row-reverse' : 'flex-row'
              } items-start space-x-2`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'answer' 
                    ? 'bg-blue-600 text-white' 
                    : message.type === 'evaluation'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-white'
                }`}
              >
                {message.type === 'answer' ? (
                  <User size={16} />
                ) : message.type === 'evaluation' ? (
                  <Bot size={16} />
                ) : (
                  <Bot size={16} />
                )}
              </div>
              
              <div
                className={`rounded-lg p-3 ${
                  message.type === 'answer'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'evaluation'
                    ? 'bg-green-100 text-green-900 border border-green-200'
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-900 border border-red-200'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.score && (
                  <p className="text-xs mt-1 opacity-75">
                    Score: {message.score}/100
                  </p>
                )}
                <p className="text-xs mt-1 opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {interviewStatus === 'in-progress' && currentQuestion && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer here... (Press Enter to send)"
              className="flex-1 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={!inputMessage.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Time remaining for this question: <strong>{timer}s</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;