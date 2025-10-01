import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, Star, Download, Share2, Clock, Award, BarChart3 } from 'lucide-react';

const InterviewComplete = () => {
  const { answers } = useSelector(state => state.interview);
  const { resumeData } = useSelector(state => state.resume);
  
  // Calculate scores
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
  const averageScore = Math.round(totalScore / answers.length);
  const maxScore = 100;
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDownloadResults = () => {
    // Implement download functionality
    console.log('Download results');
  };

  const handleShareResults = () => {
    // Implement share functionality
    console.log('Share results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Interview Complete!</h1>
          <p className="text-blue-100 text-lg">
            Great job completing the technical interview
          </p>
        </div>

        <div className="p-8">
          {/* Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Overall Score */}
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(averageScore)} mb-1`}>
                {averageScore}
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full mt-2 ${getScoreBadgeColor(averageScore)}`}>
                {getScoreBadge(averageScore)}
              </div>
            </div>

            {/* Questions Answered */}
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {answers.length}/6
              </div>
              <div className="text-sm text-gray-600">Questions Completed</div>
            </div>

            {/* Performance */}
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {Math.round((answers.filter(a => a.score >= 60).length / answers.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Passing Rate</div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Performance Breakdown
            </h2>
            <div className="space-y-3">
              {answers.map((answer, index) => (
                <div key={answer.questionId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getDifficultyColor(answer.difficulty)}`}>
                      <span className="text-sm font-medium">Q{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {answer.difficulty.charAt(0).toUpperCase() + answer.difficulty.slice(1)} Question
                      </div>
                      <div className="text-sm text-gray-500">
                        Score: <span className={getScoreColor(answer.score)}>{answer.score}/100</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadgeColor(answer.score)}`}>
                    {getScoreBadge(answer.score)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Your results have been saved and are available to recruiters</p>
              <p>• You'll be contacted if your profile matches our requirements</p>
              <p>• Keep practicing - technical interviews get easier with experience</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleDownloadResults}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Download Results
            </button>
            <button
              onClick={handleShareResults}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Share2 className="w-5 h-5" />
              Share Results
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-600">
            Thank you for interviewing with us, {resumeData?.name || 'Candidate'}!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewComplete;