import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Play, CheckCircle, Clock } from 'lucide-react';
import { setInterviewStatus } from '../../store/slices/interviewSlice';

const StartInterviewButton = () => {
  const dispatch = useDispatch();
  const { resumeData, missingFields } = useSelector(state => state.resume);
  const { interviewStatus } = useSelector(state => state.interview);

  const handleStartInterview = () => {
    if (missingFields.length === 0) {
      dispatch(setInterviewStatus('in-progress'));
    }
  };

  const isReadyToStart = missingFields.length === 0;
  const hasResumeData = resumeData && (resumeData.name || resumeData.email || resumeData.phone);

  const getButtonState = () => {
    if (!hasResumeData) {
      return {
        label: 'Upload Resume to Start',
        description: 'Please upload your resume first',
        disabled: true,
        icon: <Clock className="w-5 h-5" />
      };
    }

    if (!isReadyToStart) {
      return {
        label: 'Complete Required Information',
        description: 'Fill in missing fields to start interview',
        disabled: true,
        icon: <Clock className="w-5 h-5" />
      };
    }

    if (interviewStatus === 'ready') {
      return {
        label: 'Start Interview',
        description: 'Begin your technical interview',
        disabled: false,
        icon: <Play className="w-5 h-5" />
      };
    }

    return {
      label: 'Interview in Progress',
      description: 'Continue with your current interview',
      disabled: false,
      icon: <CheckCircle className="w-5 h-5" />
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="fixed bottom-6 right-6 z-10">
      <button
        onClick={handleStartInterview}
        disabled={buttonState.disabled}
        className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg font-semibold transition-all transform hover:scale-105 ${
          buttonState.disabled
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800'
        }`}
      >
        {buttonState.icon}
        <span className="text-lg">{buttonState.label}</span>
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 right-0 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <div className="font-medium mb-1">{buttonState.label}</div>
        <div className="text-gray-300">{buttonState.description}</div>
        
        {/* Requirements Checklist */}
        {(hasResumeData || !isReadyToStart) && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="space-y-1 text-xs">
              <div className={`flex items-center gap-2 ${resumeData?.name ? 'text-green-400' : 'text-red-400'}`}>
                {resumeData?.name ? '✓' : '✗'} Name provided
              </div>
              <div className={`flex items-center gap-2 ${resumeData?.email ? 'text-green-400' : 'text-red-400'}`}>
                {resumeData?.email ? '✓' : '✗'} Email provided
              </div>
              <div className={`flex items-center gap-2 ${resumeData?.phone ? 'text-green-400' : 'text-red-400'}`}>
                {resumeData?.phone ? '✓' : '✗'} Phone provided
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartInterviewButton;