import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTimer, submitAnswer, moveToNextQuestion } from '../store/slices/interviewSlice';

const useTimer = (question, questionIndex) => {
  const dispatch = useDispatch();
  const { timer: globalTimer } = useSelector(state => state.interview);
  const [localTimer, setLocalTimer] = useState(globalTimer);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Get time limit based on question difficulty
  const getTimeLimit = useCallback((difficulty) => {
    switch (difficulty) {
      case 'easy': return 20;
      case 'medium': return 60;
      case 'hard': return 120;
      default: return 60;
    }
  }, []);

  // Start the timer
  const startTimer = useCallback(() => {
    if (!question || isRunning) return;
    
    setIsRunning(true);
    const timeLimit = getTimeLimit(question.difficulty);
    setLocalTimer(timeLimit);
    dispatch(setTimer(timeLimit));

    intervalRef.current = setInterval(() => {
      setLocalTimer(prev => {
        const newTime = prev - 1;
        
        // Update global timer every second for persistence
        if (newTime % 5 === 0) {
          dispatch(setTimer(newTime));
        }
        
        return newTime;
      });
    }, 1000);
  }, [question, isRunning, getTimeLimit, dispatch]);

  // Stop the timer
  const stopTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Reset the timer
  const resetTimer = useCallback(() => {
    stopTimer();
    if (question) {
      const timeLimit = getTimeLimit(question.difficulty);
      setLocalTimer(timeLimit);
      dispatch(setTimer(timeLimit));
    }
  }, [question, stopTimer, getTimeLimit, dispatch]);

  // Handle time expiration
  const handleTimeUp = useCallback(() => {
    stopTimer();
    
    if (question) {
      // Auto-submit empty answer when time expires
      dispatch(submitAnswer({
        questionId: question.id,
        answer: "[Time expired - No answer provided]",
        questionIndex: questionIndex,
        score: 0,
        autoSubmitted: true
      }));

      // Move to next question after a brief delay
      setTimeout(() => {
        dispatch(moveToNextQuestion());
      }, 2000);
    }
  }, [question, questionIndex, stopTimer, dispatch]);

  // Format time for display
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Get timer progress percentage
  const getProgressPercentage = useCallback(() => {
    if (!question) return 0;
    const totalTime = getTimeLimit(question.difficulty);
    return ((totalTime - localTimer) / totalTime) * 100;
  }, [question, localTimer, getTimeLimit]);

  // Get timer color based on remaining time
  const getTimerColor = useCallback(() => {
    if (!question) return 'text-gray-600';
    
    const percentage = (localTimer / getTimeLimit(question.difficulty)) * 100;
    
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    if (percentage > 10) return 'text-orange-600';
    return 'text-red-600';
  }, [question, localTimer, getTimeLimit]);

  // Get timer background color
  const getTimerBgColor = useCallback(() => {
    if (!question) return 'bg-gray-100';
    
    const percentage = (localTimer / getTimeLimit(question.difficulty)) * 100;
    
    if (percentage > 50) return 'bg-green-100';
    if (percentage > 25) return 'bg-yellow-100';
    if (percentage > 10) return 'bg-orange-100';
    return 'bg-red-100';
  }, [question, localTimer, getTimeLimit]);

  // Get timer border color
  const getTimerBorderColor = useCallback(() => {
    if (!question) return 'border-gray-300';
    
    const percentage = (localTimer / getTimeLimit(question.difficulty)) * 100;
    
    if (percentage > 50) return 'border-green-300';
    if (percentage > 25) return 'border-yellow-300';
    if (percentage > 10) return 'border-orange-300';
    return 'border-red-300';
  }, [question, localTimer, getTimeLimit]);

  // Sync with global timer state
  useEffect(() => {
    if (!isRunning) {
      setLocalTimer(globalTimer);
    }
  }, [globalTimer, isRunning]);

  // Handle timer expiration
  useEffect(() => {
    if (localTimer <= 0 && isRunning) {
      handleTimeUp();
    }
  }, [localTimer, isRunning, handleTimeUp]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    time: localTimer,
    formattedTime: formatTime(localTimer),
    isRunning,
    progress: getProgressPercentage(),
    colors: {
      text: getTimerColor(),
      background: getTimerBgColor(),
      border: getTimerBorderColor()
    },
    actions: {
      start: startTimer,
      stop: stopTimer,
      reset: resetTimer
    },
    isTimeLow: localTimer <= 10,
    isTimeCritical: localTimer <= 5
  };
};

export default useTimer;