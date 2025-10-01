import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Mail, Phone, Calendar, Download, Share2 } from 'lucide-react';
import ScoreBadge from './ScoreBadge';
import InterviewSummary from './InterviewSummary';
import QuestionAnswerView from './QuestionAnswerView';

const CandidateDetail = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { candidates } = useSelector(state => state.candidates);
  
  const candidate = candidates.find(c => c.id === candidateId);

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Candidate not found</h2>
        <p className="text-gray-600 mt-2">The requested candidate profile could not be found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadReport = () => {
    // Implement download functionality
    console.log('Download report for:', candidate.id);
  };

  const handleShareResults = () => {
    // Implement share functionality
    console.log('Share results for:', candidate.id);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
                <p className="text-gray-600">Technical Interview Results</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadReport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </button>
              <button
                onClick={handleShareResults}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column - Candidate Info & Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Candidate Profile Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900">{candidate.name}</h2>
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(candidate.interviewDate)}</span>
                </div>
              </div>
            </div>

            {/* Overall Score */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Overall Score</div>
                <ScoreBadge score={candidate.score} size="lg" />
                <div className="mt-2 text-sm text-gray-500">
                  {candidate.score >= 80 ? 'Excellent' : 
                   candidate.score >= 60 ? 'Good' : 
                   'Needs Improvement'}
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <InterviewSummary summary={candidate.summary} />
        </div>

        {/* Right Column - Questions & Answers */}
        <div className="lg:col-span-2">
          <QuestionAnswerView answers={candidate.answers} />
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;