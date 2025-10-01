import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Clock, MessageSquare } from 'lucide-react';

const QuestionAnswerView = ({ answers }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-700 bg-green-100';
    if (score >= 60) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return '⭐';
    if (score >= 60) return '✅';
    return '⚠️';
  };

  const formatAnswer = (answer) => {
    if (answer === '[Time expired - No answer provided]') {
      return (
        <div className="italic text-gray-500 bg-gray-50 p-3 rounded-lg border">
          Candidate did not provide an answer within the time limit.
        </div>
      );
    }
    return answer;
  };

  if (!answers || answers.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Interview Data</h3>
        <p className="text-gray-600">Question and answer data will appear here once the interview is completed.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Interview Questions & Answers</h2>
        <p className="text-sm text-gray-600 mt-1">
          Detailed breakdown of candidate responses and AI evaluations
        </p>
      </div>

      {/* Questions List */}
      <div className="divide-y divide-gray-200">
        {answers.map((answer, index) => (
          <div key={answer.questionId} className="px-6 py-4">
            {/* Question Header */}
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              onClick={() => toggleQuestion(index)}
            >
              <div className="flex items-center gap-4">
                {/* Question Number */}
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Difficulty Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(answer.difficulty)}`}>
                    {answer.difficulty.charAt(0).toUpperCase() + answer.difficulty.slice(1)}
                  </span>
                  
                  {/* Score */}
                  <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getScoreColor(answer.score)}`}>
                    <span className="flex items-center gap-1">
                      {getScoreIcon(answer.score)} {answer.score}/100
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Auto-submit indicator */}
                {answer.autoSubmitted && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                    <Clock className="w-3 h-3" />
                    Time Expired
                  </span>
                )}
                
                {/* Expand/Collapse Icon */}
                {expandedQuestion === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Question Content */}
            <div className="mt-3 ml-12">
              <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border text-sm leading-relaxed">
                {answer.questionText}
              </p>
            </div>

            {/* Expanded Content */}
            {expandedQuestion === index && (
              <div className="mt-4 ml-12 space-y-4">
                {/* Candidate's Answer */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Candidate's Answer:
                  </h4>
                  <div className="text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {formatAnswer(answer.answer)}
                  </div>
                </div>

                {/* AI Evaluation */}
                {answer.feedback && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      AI Evaluation:
                    </h4>
                    <div className="text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200 text-sm leading-relaxed">
                      {answer.feedback}
                    </div>
                  </div>
                )}

                {/* Evaluation Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded-lg border">
                    <div className="text-gray-500">Difficulty</div>
                    <div className="font-semibold text-gray-900 capitalize">{answer.difficulty}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg border">
                    <div className="text-gray-500">Score</div>
                    <div className={`font-semibold ${getScoreColor(answer.score).split(' ')[0]}`}>
                      {answer.score}/100
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg border">
                    <div className="text-gray-500">Status</div>
                    <div className="font-semibold text-gray-900">
                      {answer.score >= 60 ? 'Passed' : 'Needs Work'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-600">
            Showing {answers.length} questions •{' '}
            Average score: {Math.round(answers.reduce((sum, a) => sum + a.score, 0) / answers.length)}/100
          </div>
          <div className="text-gray-500">
            {answers.filter(a => a.score >= 60).length} of {answers.length} questions passed
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionAnswerView;