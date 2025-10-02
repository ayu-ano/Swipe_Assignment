import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitAnswer, moveToNextQuestion } from '../store/slices/interviewSlice';

const useAutoSubmit = () => {
  const dispatch = useDispatch();
  const { timer, currentQuestion, currentQuestionIndex, interviewStatus } = useSelector(state => state.interview);
  const timeoutRef = useRef(null);
  const submittedRef = useRef(false);

  // Handle auto-submission when timer reaches zero
  const handleAutoSubmit = useCallback(() => {
    if (!currentQuestion || submittedRef.current || interviewStatus !== 'in-progress') {
      return;
    }

    submittedRef.current = true;

    // Submit empty answer due to time expiration
    dispatch(submitAnswer({
      questionId: currentQuestion.id,
      answer: "[Time expired - No answer provided]",
      questionIndex: currentQuestionIndex,
      score: 0,
      autoSubmitted: true
    }));

    // Move to next question after a brief delay to show the submission
    timeoutRef.current = setTimeout(() => {
      if (currentQuestionIndex < 5) {
        dispatch(moveToNextQuestion());
      }
      submittedRef.current = false;
    }, 2000);

  }, [currentQuestion, currentQuestionIndex, interviewStatus, dispatch]);

  // Reset submission state when question changes
  useEffect(() => {
    submittedRef.current = false;
    
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [currentQuestionIndex]);

  // Monitor timer for auto-submission
  useEffect(() => {
    if (timer <= 0 && currentQuestion && interviewStatus === 'in-progress' && !submittedRef.current) {
      handleAutoSubmit();
    }
  }, [timer, currentQuestion, interviewStatus, handleAutoSubmit]);

  // Get time warnings
  const getTimeWarnings = useCallback(() => {
    if (!currentQuestion) return { showWarning: false, message: '' };

    const timeLimits = {
      easy: 20,
      medium: 60,
      hard: 120
    };

    const timeLimit = timeLimits[currentQuestion.difficulty] || 60;
    const warningThresholds = [
      { threshold: 10, message: 'Hurry up! Time running low!', type: 'warning' },
      { threshold: 5, message: 'Time almost expired!', type: 'critical' }
    ];

    const activeWarning = warningThresholds.find(warning => timer <= warning.threshold);
    
    return {
      showWarning: !!activeWarning,
      message: activeWarning?.message || '',
      type: activeWarning?.type || 'normal',
      secondsLeft: timer
    };
  }, [timer, currentQuestion]);

  // Get recommended answer time
  const getRecommendedTime = useCallback(() => {
    if (!currentQuestion) return 0;

    const recommendedTimes = {
      easy: { min: 30, max: 60 }, // seconds
      medium: { min: 60, max: 120 },
      hard: { min: 120, max: 180 }
    };

    const times = recommendedTimes[currentQuestion.difficulty] || recommendedTimes.medium;
    return times;
  }, [currentQuestion]);

  // Check if answer was submitted quickly (potential guessing)
  const checkQuickSubmission = useCallback((answer, submissionTime) => {
    if (!currentQuestion) return false;

    const quickSubmissionThresholds = {
      easy: 5, // seconds
      medium: 10,
      hard: 15
    };

    const threshold = quickSubmissionThresholds[currentQuestion.difficulty] || 10;
    const isQuick = submissionTime < threshold;
    const isShortAnswer = answer.length < 20;
    
    return isQuick && isShortAnswer;
  }, [currentQuestion]);

  // Estimate time needed for current answer
  const estimateTimeNeeded = useCallback((answerLength) => {
    if (!currentQuestion) return 0;

    const wordsPerMinute = 40; // Average typing speed for technical content
    const words = answerLength / 5; // Rough word count estimation
    const typingTime = (words / wordsPerMinute) * 60; // Convert to seconds
    
    // Add thinking time based on question difficulty
    const thinkingTime = {
      easy: 10,
      medium: 20,
      hard: 30
    }[currentQuestion.difficulty] || 15;

    return Math.ceil(typingTime + thinkingTime);
  }, [currentQuestion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    // Time information
    timeWarnings: getTimeWarnings(),
    recommendedTime: getRecommendedTime(),
    
    // Analysis functions
    checkQuickSubmission,
    estimateTimeNeeded,
    
    // State
    isAutoSubmitted: submittedRef.current,
    secondsRemaining: timer
  };
};

export default useAutoSubmit;