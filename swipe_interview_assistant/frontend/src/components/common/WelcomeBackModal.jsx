import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Play, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import { closeModal } from '../../store/slices/uiSlice';

const WelcomeBackModal = () => {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector(state => state.ui.modals.welcomeBack);
  
  if (!isOpen) return null;

  const handleContinue = () => {
    dispatch(closeModal({ modalName: 'welcomeBack' }));
    // Additional logic for continuing the interview
  };

  const handleRestart = () => {
    dispatch(closeModal({ modalName: 'welcomeBack' }));
    // Logic for restarting the interview
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const lastActivity = new Date(timestamp);
    const diffInHours = Math.floor((now - lastActivity) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-auto border border-gray-200/50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-60"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center px-8 pt-10 pb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome Back!
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              We found your incomplete interview session. Pick up where you left off or start fresh.
            </p>
          </div>

          {/* Progress Info */}
          {data?.progress && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl mx-6 mb-6 p-6 border border-gray-200/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">Interview Progress</span>
                <span className="text-sm font-medium text-blue-600">
                  {data.progress.completed}/{data.progress.total} completed
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${(data.progress.completed / data.progress.total) * 100}%` }}
                />
              </div>
              
              {/* Progress Details */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>{Math.round((data.progress.completed / data.progress.total) * 100)}% complete</span>
                </div>
                <span>Last activity: {formatTimeAgo(data.lastActivity)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="px-8 pb-8">
            <div className="flex flex-col gap-3">
              <button
                onClick={handleContinue}
                className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                Continue Interview
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
              
              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-3 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <RotateCcw className="w-5 h-5" />
                Start New Interview
              </button>
            </div>
            
            {/* Note */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Your progress is automatically saved
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => dispatch(closeModal({ modalName: 'welcomeBack' }))}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WelcomeBackModal;