// Interview Slice for managing interview session state
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Async thunks
export const generateQuestion = createAsyncThunk(
  'interview/generateQuestion',
  async ({ index, difficulty }, { rejectWithValue }) => {
    try {
      // Simulate AI service call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock question generation - in real app, this would call AI service
      const questions = {
        easy: [
          "Explain the concept of React components and how they help in building user interfaces.",
          "What is the virtual DOM in React and how does it improve performance?",
          "Describe the difference between let, const, and var in JavaScript.",
          "How does JavaScript handle asynchronous operations? Explain callbacks and promises."
        ],
        medium: [
          "How would you manage state in a large React application? Discuss different approaches.",
          "Explain the concept of 'lifting state up' in React with a practical example.",
          "What are React hooks and how do they differ from class component lifecycle methods?",
          "How would you optimize the performance of a React application?"
        ],
        hard: [
          "Design a real-time collaborative editing feature. Discuss architecture and challenges.",
          "How would you implement server-side rendering with React? Discuss benefits and trade-offs.",
          "Explain microservices architecture vs monolithic architecture for a large application.",
          "Describe your approach to handling authentication and authorization securely."
        ]
      };
      
      const questionPool = questions[difficulty] || questions.easy;
      const questionText = questionPool[index % questionPool.length];
      
      return {
        id: uuidv4(),
        text: questionText,
        difficulty,
        index,
        category: 'react',
        type: 'technical',
        timeLimit: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 60 : 120
      };
    } catch (error) {
      return rejectWithValue('Failed to generate question');
    }
  }
);

export const evaluateAnswer = createAsyncThunk(
  'interview/evaluateAnswer',
  async ({ question, answer, difficulty }, { rejectWithValue }) => {
    try {
      // Simulate AI evaluation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock evaluation - in real app, this would call AI service
      const baseScore = difficulty === 'easy' ? 70 : difficulty === 'medium' ? 60 : 50;
      const lengthBonus = Math.min(answer.length / 20, 20);
      const contentBonus = answer.toLowerCase().includes('react') ? 10 : 0;
      const randomVariation = (Math.random() - 0.5) * 20;
      
      const score = Math.max(0, Math.min(100, baseScore + lengthBonus + contentBonus + randomVariation));
      
      let feedback = '';
      if (score >= 80) {
        feedback = "Excellent answer! You demonstrated strong understanding with clear examples and good structure.";
      } else if (score >= 60) {
        feedback = "Good answer. You covered the main points well but could provide more specific examples or details.";
      } else {
        feedback = "This area needs improvement. Consider providing more specific examples and explaining your thought process more clearly.";
      }
      
      return {
        score: Math.round(score),
        feedback,
        strengths: ['Technical understanding', 'Communication skills'],
        improvements: ['More specific examples', 'Consider edge cases']
      };
    } catch (error) {
      return rejectWithValue('Failed to evaluate answer');
    }
  }
);

// Initial state
const initialState = {
  // Session info
  sessionId: null,
  status: 'idle', // 'idle' | 'ready' | 'in-progress' | 'paused' | 'completed'
  startTime: null,
  endTime: null,
  
  // Current question state
  currentQuestionIndex: -1,
  currentQuestion: null,
  questions: [],
  
  // Answers and progress
  answers: [],
  messages: [],
  
  // Timer state
  timer: {
    remaining: 0,
    isRunning: false,
    startTime: null,
    totalTime: 0
  },
  
  // UI state
  isProcessing: false,
  autoSubmitted: false,
  
  // Results
  finalScore: null,
  summary: null,
  
  // Error state
  error: null
};

// Interview slice
const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    // Session management
    initializeSession: (state, action) => {
      const { candidateId, resumeData } = action.payload;
      state.sessionId = uuidv4();
      state.status = 'ready';
      state.startTime = new Date().toISOString();
      state.candidateId = candidateId;
      state.resumeData = resumeData;
      state.error = null;
    },
    
    startInterview: (state) => {
      if (state.status === 'ready') {
        state.status = 'in-progress';
        state.startTime = new Date().toISOString();
        state.currentQuestionIndex = -1;
      }
    },
    
    setInterviewStatus: (state, action) => {
      state.status = action.payload;
    },
    
    pauseInterview: (state) => {
      if (state.status === 'in-progress') {
        state.status = 'paused';
        state.timer.isRunning = false;
      }
    },
    
    resumeInterview: (state) => {
      if (state.status === 'paused') {
        state.status = 'in-progress';
        state.timer.isRunning = true;
        // Adjust timer for pause duration
        if (state.timer.startTime) {
          const pauseDuration = Date.now() - new Date(state.timer.startTime).getTime();
          state.timer.startTime = new Date(Date.now() - (state.timer.totalTime - state.timer.remaining));
        }
      }
    },
    
    completeInterview: (state) => {
      state.status = 'completed';
      state.endTime = new Date().toISOString();
      state.timer.isRunning = false;
      
      // Calculate final score
      if (state.answers.length > 0) {
        const totalScore = state.answers.reduce((sum, answer) => sum + answer.score, 0);
        state.finalScore = Math.round(totalScore / state.answers.length);
        
        // Generate summary based on performance
        const strengths = state.answers.filter(a => a.score >= 70).length;
        state.summary = `Candidate scored ${state.finalScore}/100 overall, demonstrating ${strengths} strong areas out of ${state.answers.length} questions. ${
          state.finalScore >= 80 ? 'Excellent technical skills suitable for senior roles.' :
          state.finalScore >= 60 ? 'Good foundational knowledge with room for growth.' :
          'Needs significant improvement in core technical concepts.'
        }`;
      }
    },
    
    resetInterview: () => initialState,
    
    // Persistence actions
    loadInterviewState: (state) => {
      try {
        const interviewState = localStorage.getItem('crisp_interview_state');
        if (interviewState) {
          const parsedState = JSON.parse(interviewState);
          
          // Only load if the session was not completed
          if (parsedState.status !== 'completed') {
            Object.keys(parsedState).forEach(key => {
              if (key in state) {
                state[key] = parsedState[key];
              }
            });
          }
        }
      } catch (error) {
        console.error('Failed to load interview state:', error);
        state.error = 'Failed to load interview session';
      }
    },
    
    saveInterviewState: (state) => {
      try {
        localStorage.setItem('crisp_interview_state', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save interview state:', error);
      }
    },
    
    clearInterviewState: () => {
      try {
        localStorage.removeItem('crisp_interview_state');
      } catch (error) {
        console.error('Failed to clear interview state:', error);
      }
    },
    
    // Question management
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
      state.currentQuestionIndex = action.payload.index;
      
      // Set up timer for new question
      if (action.payload.timeLimit) {
        state.timer = {
          remaining: action.payload.timeLimit,
          isRunning: true,
          startTime: new Date().toISOString(),
          totalTime: action.payload.timeLimit
        };
      }
      
      // Add question to messages
      state.messages.push({
        id: uuidv4(),
        type: 'question',
        content: action.payload.text,
        timestamp: new Date().toISOString(),
        difficulty: action.payload.difficulty
      });
    },
    
    moveToNextQuestion: (state) => {
      state.currentQuestionIndex += 1;
      state.currentQuestion = null;
      state.timer.isRunning = false;
      state.autoSubmitted = false;
    },
    
    // Answer management
    submitAnswer: (state, action) => {
      const { answer, questionId, questionIndex, autoSubmitted = false } = action.payload;
      
      // Add user message
      state.messages.push({
        id: uuidv4(),
        type: 'answer',
        content: answer,
        timestamp: new Date().toISOString()
      });
      
      // Store answer temporarily (will be updated with evaluation)
      const answerData = {
        id: uuidv4(),
        questionId,
        questionIndex,
        answer,
        submittedAt: new Date().toISOString(),
        autoSubmitted
      };
      
      state.answers.push(answerData);
      state.isProcessing = true;
      state.timer.isRunning = false;
    },
    
    updateAnswerEvaluation: (state, action) => {
      const { questionId, evaluation } = action.payload;
      const answerIndex = state.answers.findIndex(a => a.questionId === questionId);
      
      if (answerIndex >= 0) {
        state.answers[answerIndex] = {
          ...state.answers[answerIndex],
          ...evaluation
        };
        
        // Add evaluation message
        state.messages.push({
          id: uuidv4(),
          type: 'evaluation',
          content: evaluation.feedback,
          score: evaluation.score,
          timestamp: new Date().toISOString()
        });
      }
      
      state.isProcessing = false;
    },
    
    // Timer management
    updateTimer: (state, action) => {
      state.timer.remaining = action.payload;
    },
    
    setTimer: (state, action) => {
      state.timer.remaining = action.payload;
    },
    
    stopTimer: (state) => {
      state.timer.isRunning = false;
    },
    
    // Message management
    addMessage: (state, action) => {
      state.messages.push({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        ...action.payload
      });
    },
    
    clearMessages: (state) => {
      state.messages = [];
    },
    
    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Auto-submission
    setAutoSubmitted: (state, action) => {
      state.autoSubmitted = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Generate question
      .addCase(generateQuestion.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(generateQuestion.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.questions.push(action.payload);
        state.currentQuestion = action.payload;
        state.currentQuestionIndex = action.payload.index;
        
        // Set up timer
        if (action.payload.timeLimit) {
          state.timer = {
            remaining: action.payload.timeLimit,
            isRunning: true,
            startTime: new Date().toISOString(),
            totalTime: action.payload.timeLimit
          };
        }
        
        // Add question message
        state.messages.push({
          id: uuidv4(),
          type: 'question',
          content: action.payload.text,
          timestamp: new Date().toISOString(),
          difficulty: action.payload.difficulty
        });
      })
      .addCase(generateQuestion.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
      })
      
      // Evaluate answer
      .addCase(evaluateAnswer.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(evaluateAnswer.fulfilled, (state, action) => {
        state.isProcessing = false;
        
        // Update the most recent answer with evaluation
        if (state.answers.length > 0) {
          const latestAnswer = state.answers[state.answers.length - 1];
          latestAnswer.score = action.payload.score;
          latestAnswer.feedback = action.payload.feedback;
          latestAnswer.evaluatedAt = new Date().toISOString();
          
          // Add evaluation message
          state.messages.push({
            id: uuidv4(),
            type: 'evaluation',
            content: action.payload.feedback,
            score: action.payload.score,
            timestamp: new Date().toISOString()
          });
        }
      })
      .addCase(evaluateAnswer.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
        
        // Add error message
        state.messages.push({
          id: uuidv4(),
          type: 'error',
          content: 'Failed to evaluate answer. Please continue with the next question.',
          timestamp: new Date().toISOString()
        });
      });
  }
});

// Export actions
export const {
  initializeSession,
  startInterview,
  setInterviewStatus,
  pauseInterview,
  resumeInterview,
  completeInterview,
  resetInterview,
  loadInterviewState,
  saveInterviewState,
  clearInterviewState,
  setCurrentQuestion,
  moveToNextQuestion,
  submitAnswer,
  updateAnswerEvaluation,
  updateTimer,
  setTimer,
  stopTimer,
  addMessage,
  clearMessages,
  setError,
  clearError,
  setAutoSubmitted
} = interviewSlice.actions;

// Selectors
export const selectInterview = (state) => state.interview;
export const selectSessionId = (state) => state.interview.sessionId;
export const selectInterviewStatus = (state) => state.interview.status;
export const selectCurrentQuestion = (state) => state.interview.currentQuestion;
export const selectCurrentQuestionIndex = (state) => state.interview.currentQuestionIndex;
export const selectQuestions = (state) => state.interview.questions;
export const selectAnswers = (state) => state.interview.answers;
export const selectMessages = (state) => state.interview.messages;
export const selectTimer = (state) => state.interview.timer;
export const selectIsProcessing = (state) => state.interview.isProcessing;
export const selectFinalScore = (state) => state.interview.finalScore;
export const selectSummary = (state) => state.interview.summary;
export const selectError = (state) => state.interview.error;

// Memoized selectors
export const selectProgress = createSelector(
  [selectCurrentQuestionIndex],
  (currentIndex) => {
    const totalQuestions = 6; // Fixed interview length
    return currentIndex >= 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  }
);

export const selectCurrentAnswer = createSelector(
  [selectAnswers, selectCurrentQuestion],
  (answers, currentQuestion) => {
    if (!currentQuestion) return null;
    return answers.find(answer => answer.questionId === currentQuestion.id);
  }
);

export const selectAnsweredQuestions = createSelector(
  [selectAnswers],
  (answers) => answers.length
);

export const selectAverageScore = createSelector(
  [selectAnswers],
  (answers) => {
    if (answers.length === 0) return 0;
    const total = answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
    return Math.round(total / answers.length);
  }
);

export const selectPerformanceByDifficulty = createSelector(
  [selectAnswers, selectQuestions],
  (answers, questions) => {
    const performance = {
      easy: { scores: [], average: 0, count: 0 },
      medium: { scores: [], average: 0, count: 0 },
      hard: { scores: [], average: 0, count: 0 }
    };
    
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question && answer.score !== undefined) {
        performance[question.difficulty].scores.push(answer.score);
        performance[question.difficulty].count++;
      }
    });
    
    // Calculate averages
    Object.keys(performance).forEach(difficulty => {
      const data = performance[difficulty];
      if (data.scores.length > 0) {
        data.average = Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length);
      }
    });
    
    return performance;
  }
);

export const selectIsInterviewComplete = createSelector(
  [selectInterviewStatus, selectAnsweredQuestions],
  (status, answeredCount) => {
    return status === 'completed' || answeredCount >= 6;
  }
);

export const selectCanProceed = createSelector(
  [selectInterviewStatus, selectIsProcessing],
  (status, isProcessing) => {
    return (status === 'in-progress' || status === 'ready') && !isProcessing;
  }
);

// Export the reducer
export default interviewSlice.reducer;