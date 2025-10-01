import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, Circle, Clock } from 'lucide-react';

const ProgressIndicator = () => {
  const { currentQuestionIndex, interviewStatus } = useSelector(state => state.interview);
  
  const totalQuestions = 6;
  const questions = [
    { level: 'Easy', count: 2 },
    { level: 'Medium', count: 2 },
    { level: 'Hard', count: 2 }
  ];

  const getQuestionStatus = (questionNumber) => {
    if (questionNumber < currentQuestionIndex) {
      return 'completed';
    } else if (questionNumber === currentQuestionIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  const getDifficultyForQuestion = (index) => {
    if (index < 2) return 'easy';
    if (index < 4) return 'medium';
    return 'hard';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status, difficulty) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'current':
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'upcoming':
        return (
          <div className={`w-3 h-3 rounded-full border-2 ${
            difficulty === 'easy' ? 'border-green-400' :
            difficulty === 'medium' ? 'border-yellow-400' :
            'border-red-400'
          }`} />
        );
      default:
        return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  if (interviewStatus !== 'in-progress') return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Interview Progress</h3>
        <span className="text-xs text-gray-500">
          {currentQuestionIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Dots */}
      <div className="flex justify-between items-center mb-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const status = getQuestionStatus(index);
          const difficulty = getDifficultyForQuestion(index);
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                status === 'completed' ? 'bg-green-100 border-green-400' :
                status === 'current' ? 'bg-blue-100 border-blue-400 animate-pulse' :
                'bg-gray-100 border-gray-300'
              }`}>
                {getStatusIcon(status, difficulty)}
              </div>
              <span className="text-xs mt-1 text-gray-600">Q{index + 1}</span>
            </div>
          );
        })}
      </div>

      {/* Difficulty Legend */}
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Easy (2)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span className="text-gray-600">Medium (2)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Hard (2)</span>
        </div>
      </div>

      {/* Current Stage */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Current Stage:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            currentQuestionIndex < 2 ? 'bg-green-100 text-green-800' :
            currentQuestionIndex < 4 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {currentQuestionIndex < 2 ? 'Easy Questions' :
             currentQuestionIndex < 4 ? 'Medium Questions' :
             'Hard Questions'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;