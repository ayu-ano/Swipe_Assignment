import React from 'react';
import { Clock, AlertCircle, Star } from 'lucide-react';

const QuestionCard = ({ question }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'hard':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'hard':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getTimeLimit = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return '20 seconds';
      case 'medium':
        return '60 seconds';
      case 'hard':
        return '120 seconds';
      default:
        return 'N/A';
    }
  };

  const getCategoryBadge = (category) => {
    const categoryColors = {
      'react': 'bg-blue-100 text-blue-800 border-blue-200',
      'node': 'bg-green-100 text-green-800 border-green-200',
      'javascript': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'html': 'bg-orange-100 text-orange-800 border-orange-200',
      'css': 'bg-purple-100 text-purple-800 border-purple-200',
      'database': 'bg-red-100 text-red-800 border-red-200'
    };

    return categoryColors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-semibold text-gray-900">
              Question {question.index + 1} of 6
            </span>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(question.difficulty)}`}>
            {getDifficultyIcon(question.difficulty)} {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{getTimeLimit(question.difficulty)}</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3 leading-relaxed">
          {question.text}
        </h3>
        
        {question.category && (
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getCategoryBadge(question.category)}`}>
              {question.category.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Tips & Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Answer Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific and provide examples from your experience</li>
              <li>• Structure your answer clearly</li>
              <li>• Mention relevant technologies and best practices</li>
              <li>• If you don't know, explain how you would approach it</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(((question.index + 1) / 6) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((question.index + 1) / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Type Hint */}
      {question.type === 'technical' && (
        <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
          <span>💡</span>
          <span>This is a technical question. Focus on code examples and architecture.</span>
        </div>
      )}
      
      {question.type === 'behavioral' && (
        <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
          <span>💡</span>
          <span>This is a behavioral question. Use the STAR method (Situation, Task, Action, Result).</span>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;