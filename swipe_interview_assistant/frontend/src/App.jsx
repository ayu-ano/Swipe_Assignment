import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/Common/Tabs';
import Layout from './components/Common/Layout';
import WelcomeBackModal from './components/Common/WelcomeBackModal';
import ErrorBoundary from './components/Common/ErrorBoundary';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Interviewee Components
import ResumeUpload from './components/interviewee/ResumeUpload.jsx';
import ChatInterface from './components/interviewee/ChatInterface.jsx';
import MissingFieldsForm from './components/interviewee/MissingFieldsForm';
import InterviewComplete from './components/interviewee/InterviewComplete';
import StartInterviewButton from './components/interviewee/StartInterviewButton';



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
        // Load all persisted data from storage
        await Promise.all([
          dispatch(loadCandidates()),
          dispatch(loadInterviewState()),
          dispatch(loadResumeState())
        ]);

        // Check for unfinished interview sessions
        dispatch(checkUnfinishedSession());
        
        // Mark app as initialized
        dispatch(initializeApp());
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApplication();
  }, [dispatch]);

  // Show loading spinner while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-gray-600">Loading Interview Assistant...</p>
        </div>
      </div>
    );
  }

  // Determine the default interviewee view based on state
  const getIntervieweeContent = () => {
    if (interviewStatus === 'completed') {
      return <InterviewComplete />;
    }

    if (missingFields.length > 0) {
      return <MissingFieldsForm />;
    }

    if (interviewStatus === 'in-progress' || interviewStatus === 'ready') {
      return <ChatInterface />;
    }

    // Default to resume upload
    return <ResumeUpload />;
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Layout>
            {/* Main Tabs Navigation */}
            <Tabs defaultValue="interviewee" value={activeTab} className="w-full">
              <div className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <TabsList className="flex space-x-8">
                    <TabsTrigger 
                      value="interviewee" 
                      className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                    >
                      <div className="flex items-center gap-2">
                        <span>🎤</span>
                        Interviewee
                        {interviewStatus === 'in-progress' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Live
                          </span>
                        )}
                      </div>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="interviewer" 
                      className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                    >
                      <div className="flex items-center gap-2">
                        <span>📊</span>
                        Interviewer Dashboard
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* Interviewee Tab Content */}
              <TabsContent value="interviewee" className="mt-0">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <div className="px-4 py-6 sm:px-0">
                    {getIntervieweeContent()}
                    
                    {/* Show start button when ready but not in progress */}
                    {(interviewStatus === 'ready' || interviewStatus === 'not-started') && 
                     missingFields.length === 0 && (
                      <StartInterviewButton />
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Interviewer Tab Content */}
              <TabsContent value="interviewer" className="mt-0">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <div className="px-4 py-6 sm:px-0">
                    <Routes>
                      <Route path="/" element={<Dashboard />}>
                        <Route index element={<CandidateList />} />
                        <Route path="candidate/:candidateId" element={<CandidateDetail />} />
                      </Route>
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Welcome Back Modal for unfinished sessions */}
            <WelcomeBackModal 
              isOpen={showWelcomeBackModal}
            />

            {/* Global keyboard shortcuts helper */}
            <div className="fixed bottom-4 left-4 opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-black text-white text-xs p-2 rounded-lg">
                <div>Tab + I: Interviewee</div>
                <div>Tab + D: Dashboard</div>
              </div>
            </div>
          </Layout>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;