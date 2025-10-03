// Redux Store Configuration
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer, 
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createCompressor from 'redux-persist-transform-compress';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// Import slices
import candidateSlice from './slices/candidateSlice';
import interviewSlice from './slices/interviewSlice';
import resumeSlice from './slices/resumeSlice';
import uiSlice from './slices/uiSlice';

// Environment detection
const isDevelopment = import.meta.env.MODE === 'development';

// Custom transform to handle specific state serialization
const interviewStateTransform = createTransform(
  (inboundState, key) => {
    if (key === 'interview') {
      const { currentTimer, isProcessing, audioContext, mediaRecorder, ...persistedState } = inboundState;
      return persistedState;
    }
    return inboundState;
  },
  (outboundState, key) => {
    if (key === 'interview') {
      return {
        currentTimer: null,
        isProcessing: false,
        audioContext: null,
        mediaRecorder: null,
        ...outboundState
      };
    }
    return outboundState;
  },
  { whitelist: ['interview'] }
);

// Persistence configuration
const persistConfig = {
  key: 'crisp-interview-assistant',
  storage,
  version: 1,
  stateReconciler: autoMergeLevel2,
  whitelist: ['candidate', 'interview', 'resume', 'ui'],
  blacklist: [], // Explicit blacklist for clarity
  transforms: [
    createCompressor({
      threshold: 1024
    }),
    interviewStateTransform
  ],
  migrate: (state) => {
    if (!state) {
      return Promise.resolve(undefined);
    }
    
    // Migration logic
    if (state._persist?.version !== 1) {
      console.log('Migrating store from version', state._persist?.version, 'to 1');
      
      // Ensure required fields exist
      if (state.interview && !state.interview.questions) {
        state.interview.questions = [];
      }
      if (state.candidate && !state.candidate.list) {
        state.candidate.list = [];
      }
      
      state._persist.version = 1;
    }
    
    return Promise.resolve(state);
  },
  timeout: 5000 // Add timeout for large states
};

// Combine reducers properly
const appReducer = combineReducers({
  candidate: candidateSlice,
  interview: interviewSlice,
  resume: resumeSlice,
  ui: uiSlice
});

// Root reducer with special actions
const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    // Clear entire state
    state = undefined;
  }
  
  if (action.type === 'CLEAR_INTERVIEW_DATA') {
    // Clear only interview-related data
    return {
      ...state,
      interview: interviewSlice.getInitialState(),
      resume: resumeSlice.getInitialState()
    };
  }
  
  return appReducer(state, action);
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ],
        ignoredPaths: [
          'register',
          'rehydrate',
          'interview.currentTimer',
          'interview.audioContext',
          'interview.mediaRecorder'
        ]
      },
      immutableCheck: isDevelopment ? { warnAfter: 1000 } : false
    });
    
    // REMOVED THE REDUX-FLIPPER CODE COMPLETELY
  },
  devTools: isDevelopment
});

// Enhanced persistor
export const persistor = persistStore(store, null, (error) => {
  if (error) {
    console.error('Persist rehydration error:', error);
    
    // Auto-recovery for common issues
    if (error.message?.includes('JSON') || error.message?.includes('migration')) {
      console.warn('Clearing corrupted persisted data...');
      persistor.purge();
    }
  } else {
    console.log('Store rehydration successful');
  }
});

// Store utilities
export const resetStore = () => {
  store.dispatch({ type: 'RESET_APP' });
  persistor.purge(); // Also clear storage
};

export const clearInterviewData = () => {
  store.dispatch({ type: 'CLEAR_INTERVIEW_DATA' });
};

export const getStoreState = () => store.getState();

export const subscribeToStore = (callback) => store.subscribe(callback);

// Store status monitoring
let storeStatus = 'initialized';

export const getStoreStatus = () => storeStatus;

// Subscribe to store changes
const unsubscribe = store.subscribe(() => {
  const state = store.getState();
  storeStatus = state?._persist?.rehydrated ? 'rehydrated' : 'hydrating';
});

export default store;
