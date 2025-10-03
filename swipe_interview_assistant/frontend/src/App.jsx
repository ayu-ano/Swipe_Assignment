import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Common Components
import Tabs from './components/common/Tabs';
import WelcomeBackModal from './components/common/WelcomeBackModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

// Interviewee Components
import ResumeUpload from './components/Interviewee/ResumeUpload';
import ChatInterface from './components/Interviewee/ChatInterface';
import MissingFieldsForm from './components/Interviewee/MissingFieldsForm';
import InterviewComplete from './components/Interviewee/InterviewComplete';
import StartInterviewButton from './components/Interviewee/StartInterviewButton';

// Interviewer Components
import Dashboard from './components/Interviewer/Dashboard';

// Store actions
import { initializeApp, checkUnfinishedSession, setActiveTab } from './store/slices/uiSlice.js';
import { loadCandidates } from './store/slices/candidateSlice';
import { loadInterviewState } from './store/slices/interviewSlice';
import { loadResumeState } from './store/slices/resumeSlice';

function App() {
  const dispatch = useDispatch();
  const { 
    isInitialized, 
    showWelcomeBackModal, 
    activeTab 
  } = useSelector(state => state.ui);
  
  const { interviewStatus } = useSelector(state => state.interview);
  const { missingFields } = useSelector(state => state.resume);

  // Initialize app and load persisted data
  useEffect(() => {
    const initializeApplication = async () => {
      try {
        await Promise.all([
          dispatch(loadCandidates()),
          dispatch(loadInterviewState()),
          dispatch(loadResumeState())
        ]);

        dispatch(checkUnfinishedSession());
        dispatch(initializeApp());
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApplication();
  }, [dispatch]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey || event.metaKey) return;
      
      if (event.key === 'i' && event.altKey) {
        event.preventDefault();
        dispatch(setActiveTab('interviewee'));
      } else if (event.key === 'd' && event.altKey) {
        event.preventDefault();
        dispatch(setActiveTab('interviewer'));
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [dispatch]);

  // Handle tab changes
  const handleTabChange = (tabId) => {
    dispatch(setActiveTab(tabId));
  };

  // Show loading spinner while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <LoadingSpinner size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Interview Assistant</h2>
          <p className="text-gray-600 max-w-md">
            Preparing your interview environment...
          </p>
        </div>
      </div>
    );
  }

  // Interviewee content based on state
  const getIntervieweeContent = () => {
    if (interviewStatus === 'completed') {
      return <InterviewComplete />;
    }

    if (missingFields && missingFields.length > 0) {
      return <MissingFieldsForm />;
    }

    if (interviewStatus === 'in-progress') {
      return <ChatInterface />;
    }

    return (
      <div className="space-y-8">
        <ResumeUpload />
        {interviewStatus === 'ready' && (
          <div className="flex justify-center">
            <StartInterviewButton />
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    {
      id: 'interviewee',
      label: 'Candidate Portal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      badge: interviewStatus === 'in-progress' ? 'Live' : null,
      status: interviewStatus === 'in-progress' ? 'active' : 'inactive'
    },
    {
      id: 'interviewer', 
      label: 'Interviewer Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
          {/* Clean Navigation Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
                {/* Logo and Title */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      AI Interview Assistant
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                      Powered by Swipe Internship Program
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                {interviewStatus === 'in-progress' && (
                  <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 sm:self-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-orange-700 font-medium text-sm">
                      Interview in Progress
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Tabs */}
              <div className="pb-2">
                <Tabs 
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  variant="pills"
                  fullWidth={true}
                  className="justify-center sm:justify-start"
                />
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/interviewee" replace />} />
              
              {/* Interviewee Routes */}
              <Route 
                path="/interviewee/*" 
                element={getIntervieweeContent()}
              />
              
              {/* Interviewer Routes */}
              <Route path="/interviewer/*" element={<Dashboard />} />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/interviewee" replace />} />
            </Routes>
          </main>

          {/* Modals */}
          <WelcomeBackModal />

          {/* Keyboard Shortcuts Helper */}
          <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
            <div className="bg-gray-900 text-white text-sm p-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 opacity-90 hover:opacity-100">
              <div className="font-semibold mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Keyboard Shortcuts
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Alt</kbd>
                  <span>+</span>
                  <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">I</kbd>
                  <span>Candidate Portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Alt</kbd>
                  <span>+</span>
                  <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">D</kbd>
                  <span>Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;