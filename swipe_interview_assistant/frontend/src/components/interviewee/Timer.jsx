import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Clock, AlertTriangle } from 'lucide-react';
import { setTimer, submitAnswer } from '../../store/slices/interviewSlice';

const Timer = () => {
  const dispatch = useDispatch();
  const { timer, currentQuestion, currentQuestionIndex, interviewStatus } = useSelector(state => state.interview);
  const [localTimer, setLocalTimer] = useState(timer);

  useEffect(() => {
    setLocalTimer(timer);
  }, [timer]);

  useEffect(() => {
    if (interviewStatus !== 'in-progress' || !currentQuestion) return;

    let interval;
    
    if (localTimer > 0) {
      interval = setInterval(() => {
        setLocalTimer(prev => {
          const newTime = prev - 1;
          
          // Update global timer every second for persistence
          if (newTime % 5 === 0) { // Update store every 5 seconds to reduce overhead
            dispatch(setTimer(newTime));
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      // Time's up - auto submit
      handleTimeUp();
    }

    return () => clearInterval(interval);
  }, [localTimer, interviewStatus, currentQuestion, dispatch]);

  const handleTimeUp = () => {
    if (currentQuestion) {
      dispatch(submitAnswer({
        questionId: currentQuestion.id,
        answer: "[Time expired - No answer provided]",
        questionIndex: currentQuestionIndex,
        score: 0,
        autoSubmitted: true
      }));
      
      // Reset timer for next question
      dispatch(setTimer(getTimeLimit(currentQuestion.difficulty)));
    }
  };

  const getTimeLimit = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 20;
      case 'medium': return 60;
      case 'hard': return 120;
      default: return 60;
    }
  };

  const getTimerColor = () => {
    const percentage = (localTimer / getTimeLimit(currentQuestion?.difficulty)) * 100;
    
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    if (percentage > 10) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTimerBgColor = () => {
    const percentage = (localTimer / getTimeLimit(currentQuestion?.difficulty)) * 100;
    
    if (percentage > 50) return 'bg-green-100';
    if (percentage > 25) return 'bg-yellow-100';
    if (percentage > 10) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getBorderColor = () => {
    const percentage = (localTimer / getTimeLimit(currentQuestion?.difficulty)) * 100;
    
    if (percentage > 50) return 'border-green-300';
    if (percentage > 25) return 'border-yellow-300';
    if (percentage > 10) return 'border-orange-300';
    return 'border-red-300';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!currentQuestion) return 0;
    const totalTime = getTimeLimit(currentQuestion.difficulty);
    return ((totalTime - localTimer) / totalTime) * 100;
  };

  if (!currentQuestion || interviewStatus !== 'in-progress') {
    return null;
  }

  return (
    <div className={`border-2 rounded-lg p-3 min-w-[140px] transition-colors ${getBorderColor()} ${getTimerBgColor()}`}>
      {/* Timer Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${getTimerColor()}`} />
          <span className="text-sm font-medium text-gray-700">Time Remaining</span>
        </div>
        
        {localTimer <= 10 && (
          <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
        )}
      </div>

      {/* Timer Display */}
      <div className="text-center mb-2">
        <div className={`text-2xl font-bold ${getTimerColor()} font-mono`}>
          {formatTime(localTimer)}
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)} Question
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full transition-all duration-1000 ease-linear ${
            localTimer > 50 ? 'bg-green-500' :
            localTimer > 25 ? 'bg-yellow-500' :
            localTimer > 10 ? 'bg-orange-500' : 'bg-red-500'
          }`}
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Warning Message */}
      {localTimer <= 30 && (
        <div className="mt-2 text-xs text-center">
          <span className={`font-medium ${
            localTimer <= 10 ? 'text-red-600' : 'text-orange-600'
          }`}>
            {localTimer <= 10 
              ? 'Hurry up! Time almost expired!' 
              : 'Time running low!'}
          </span>
        </div>
      )}
    </div>
  );
};

export default Timer;