import React from 'react';
import { Mail, Phone, Calendar, ChevronRight } from 'lucide-react';
import ScoreBadge from './ScoreBadge';

const CandidateListItem = ({ candidate, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (score) => {
    if (score >= 80) return 'text-green-800 bg-green-100';
    if (score >= 60) return 'text-yellow-800 bg-yellow-100';
    return 'text-red-800 bg-red-100';
  };

  const getStatusText = (score) => {
    if (score >= 80) return 'Top Candidate';
    if (score >= 60) return 'Good Fit';
    return 'Needs Review';
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
      onClick={onClick}
    >
      {/* Candidate Info - Mobile First */}
      <div className="md:col-span-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {candidate.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <Mail className="w-3 h-3" />
                  <span>{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Phone className="w-3 h-3" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors md:hidden" />
        </div>
      </div>

      {/* Score - Mobile & Desktop */}
      <div className="md:col-span-3">
        <div className="flex items-center gap-3">
          <ScoreBadge score={candidate.score} />
          <div className="text-sm text-gray-500">
            {candidate.score}/100
          </div>
        </div>
      </div>

      {/* Interview Date - Hidden on mobile, visible on desktop */}
      <div className="hidden md:flex md:col-span-3 items-center gap-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <div>
          <div>{formatDate(candidate.interviewDate)}</div>
          <div className="text-xs text-gray-500">{formatTime(candidate.interviewDate)}</div>
        </div>
      </div>

      {/* Status - Hidden on mobile, visible on desktop */}
      <div className="hidden md:flex md:col-span-2 justify-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.score)}`}>
          {getStatusText(candidate.score)}
        </span>
      </div>

      {/* Chevron - Hidden on mobile, visible on desktop */}
      <div className="hidden md:flex md:col-span-1 justify-end">
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </div>

      {/* Mobile Additional Info */}
      <div className="md:hidden col-span-full border-t border-gray-200 pt-3">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(candidate.interviewDate)}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.score)}`}>
              {getStatusText(candidate.score)}
            </span>
          </div>
        </div>
        
        {/* Summary Preview */}
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {candidate.summary}
        </p>
      </div>
    </div>
  );
};

export default CandidateListItem;