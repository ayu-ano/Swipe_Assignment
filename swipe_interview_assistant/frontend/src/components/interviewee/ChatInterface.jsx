import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Clock, User, Bot, AlertCircle, CheckCircle2 } from 'lucide-react';
import { generateQuestion, evaluateAnswer } from '../../services/aiService';
import { 
  setCurrentQuestion, 
  addMessage, 
  setInterviewStatus, 
  setTimer,
  submitAnswer 
} from '../../store/slices/interviewSlice';
import { addCandidate } from '../../store/slices/candidateSlice';
import QuestionCard from './QuestionCard';
import Timer from './Timer';
import ProgressIndicator from './ProgressIndicator';
import MissingFieldsForm from './MissingFieldsForm';
import InterviewComplete from './InterviewComplete';
import useAutoSubmit from '../../hooks/useAutoSubmit';

const ChatInterface = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [inputMessage, setInputMessage] = useState('');
  
  const { 
    currentQuestion, 
    messages, 
    interviewStatus, 
    timer,
    currentQuestionIndex,
    answers 
  } = useSelector(state => state.interview);
  
  const { resumeData, missingFields } = useSelector(state => state.resume);

  // Auto-submit hook for timer expiration
  useAutoSubmit();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start interview if all fields are complete
  useEffect(() => {
    if (interviewStatus === 'ready' && missingFields.length === 0) {
      startInterview();
    }
  }, [interviewStatus, missingFields]);

  const startInterview = async () => {
    dispatch(setInterviewStatus('in-progress'));
    
    // Generate first question
    try {
      const firstQuestion = await generateQuestion(0, 'easy'); // First easy question
      dispatch(setCurrentQuestion(firstQuestion));
      dispatch(addMessage({
        type: 'question',
        content: firstQuestion.text,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error starting interview:', error);
      dispatch(addMessage({
        type: 'error',
        content: 'Failed to start interview. Please try again.',
        timestamp: new Date().toISOString()
      }));
    }
  };

  const handleSubmitAnswer = async () => {
    if (!inputMessage.trim() || !currentQuestion) return;

    const userAnswer = inputMessage.trim();
    
    // Add user message to chat
    dispatch(addMessage({
      type: 'answer',
      content: userAnswer,
      timestamp: new Date().toISOString()
    }));

    setInputMessage('');

    // Submit answer for evaluation
    dispatch(submitAnswer({
      questionId: currentQuestion.id,
      answer: userAnswer,
      questionIndex: currentQuestionIndex
    }));

    // Evaluate answer and get next question
    try {
      const evaluation = await evaluateAnswer(currentQuestion.text, userAnswer, currentQuestion.difficulty);
      
      // Add AI evaluation message
      dispatch(addMessage({
        type: 'evaluation',
        content: evaluation.feedback,
        score: evaluation.score,
        timestamp: new Date().toISOString()
      }));

      // Check if interview is complete
      if (currentQuestionIndex >= 5) { // 0-5 = 6 questions
        completeInterview();
        return;
      }

      // Generate next question based on progression
      const nextIndex = currentQuestionIndex + 1;
      let nextDifficulty = 'easy';
      if (nextIndex >= 2 && nextIndex < 4) nextDifficulty = 'medium';
      if (nextIndex >= 4) nextDifficulty = 'hard';

      const nextQuestion = await generateQuestion(nextIndex, nextDifficulty);
      dispatch(setCurrentQuestion(nextQuestion));
      
      // Add next question to chat
      dispatch(addMessage({
        type: 'question',
        content: nextQuestion.text,
        timestamp: new Date().toISOString()
      }));

    } catch (error) {
      console.error('Error evaluating answer:', error);
      dispatch(addMessage({
        type: 'error',
        content: 'Error evaluating your answer. Moving to next question.',
        timestamp: new Date().toISOString()
      }));
    }
  };

  const completeInterview = () => {
    dispatch(setInterviewStatus('completed'));
    
    // Calculate final score and create summary
    const finalScore = answers.reduce((total, answer) => total + answer.score, 0) / answers.length;
    const summary = `Candidate showed ${finalScore >= 80 ? 'excellent' : finalScore >= 60 ? 'good' : 'basic'} understanding of full-stack concepts.`;
    
    // Add candidate to list
    dispatch(addCandidate({
      id: Date.now().toString(),
      name: resumeData.name,
      email: resumeData.email,
      phone: resumeData.phone,
      score: Math.round(finalScore),
      summary,
      interviewDate: new Date().toISOString(),
      answers: [...answers]
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'answer':
        return <User className="w-4 h-4" />;
      case 'evaluation':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getMessageStyles = (type) => {
    const baseStyles = "rounded-2xl p-4 max-w-3xl shadow-sm";
    
    switch (type) {
      case 'answer':
        return `${baseStyles} bg-gradient-to-br from-blue-600 to-blue-700 text-white ml-auto`;
      case 'evaluation':
        return `${baseStyles} bg-green-50 border border-green-200 text-green-900`;
      case 'error':
        return `${baseStyles} bg-red-50 border border-red-200 text-red-900`;
      default:
        return `${baseStyles} bg-white border border-gray-200 text-gray-900`;
    }
  };

  // Show missing fields form if required fields are missing
  if (missingFields.length > 0 && interviewStatus !== 'completed') {
    return <MissingFieldsForm />;
  }

  // Show interview complete screen
  if (interviewStatus === 'completed') {
    return <InterviewComplete />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Technical Interview
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Full-Stack Developer (React/Node.js)
              </p>
            </div>
            
            {interviewStatus === 'in-progress' && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                  <ProgressIndicator />
                </div>
                <div className="bg-orange-50 rounded-xl p-3 border border-orange-200 shadow-sm">
                  <Timer />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Current Question Card */}
        {currentQuestion && interviewStatus === 'in-progress' && (
          <div className="mb-6">
            <QuestionCard question={currentQuestion} />
          </div>
        )}

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to Your Interview
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  The AI interviewer will ask you questions about full-stack development. 
                  Answer thoughtfully within the time limit for each question.
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === 'answer' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className="flex items-start gap-3 max-w-full">
                    {message.type !== 'answer' && (
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        message.type === 'evaluation' 
                          ? 'bg-green-100 text-green-600 border border-green-200'
                          : message.type === 'error'
                          ? 'bg-red-100 text-red-600 border border-red-200'
                          : 'bg-blue-100 text-blue-600 border border-blue-200'
                      }`}>
                        {getMessageIcon(message.type)}
                      </div>
                    )}
                    
                    <div className={getMessageStyles(message.type)}>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <p className="text-base leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {message.score && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              message.score >= 80 
                                ? 'bg-green-100 text-green-700'
                                : message.score >= 60
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              Score: {message.score}/100
                            </span>
                          )}
                        </div>
                        <span className="opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>

                    {message.type === 'answer' && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white border border-blue-700">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {interviewStatus === 'in-progress' && currentQuestion && (
            <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-sm p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your answer here... (Press Enter to send, Shift+Enter for new line)"
                      className="w-full border border-gray-300 rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 text-lg min-h-[120px]"
                      rows="3"
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:w-auto">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!inputMessage.trim()}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg font-medium text-lg min-w-[140px]"
                    >
                      <Send size={20} />
                      Send
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-orange-50 rounded-xl p-2 border border-orange-200">
                      <Clock size={16} />
                      <span>Time left: <strong>{timer}s</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;