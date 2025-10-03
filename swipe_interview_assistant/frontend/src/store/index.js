// Redux Store Configuration
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import createCompressor from 'redux-persist-transform-compress';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// Import slices
import candidateSlice from './slices/candidateSlice';
import interviewSlice from './slices/interviewSlice';
import resumeSlice from './slices/resumeSlice';
import uiSlice from './slices/uiSlice';

// Custom transform to handle specific state serialization
const interviewStateTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState, key) => {
    if (key === 'interview') {
      // Remove temporary fields that shouldn't be persisted
      const { currentTimer, isProcessing, ...persistedState } = inboundState;
      return persistedState;
    }
    return inboundState;
  },
  // transform state being rehydrated
  (outboundState, key) => {
    if (key === 'interview') {
      // Add default values for temporary fields
      return {
        currentTimer: null,
        isProcessing: false,
        ...outboundState
      };
    }
    return outboundState;
  },
  // define which reducers this transform gets called for.
  { whitelist: ['interview'] }
);

// Persistence configuration
const persistConfig = {
  key: 'crisp-interview-assistant',
  storage,
  version: 1,
  stateReconciler: autoMergeLevel2,
  whitelist: ['candidates', 'interview', 'resume', 'ui'],
  transforms: [
    createCompressor({
      threshold: 1024 // Only compress if larger than 1KB
    }),
    interviewStateTransform
  ],
  migrate: (state) => {
    // Handle state migrations between versions
    if (!state) {
      return Promise.resolve(undefined);
    }
    
    // Migration from version 0 to 1
    if (state._persist?.version !== 1) {
      console.log('Migrating store from version', state._persist?.version, 'to 1');
      
      // Clear old state structure if needed
      if (state.interview && !state.interview.questions) {
        state.interview.questions = [];
      }
      
      state._persist.version = 1;
    }
    
    return Promise.resolve(state);
  }
};

// Combine reducers
const rootReducer = {
  candidates: candidateSlice,
  interview: interviewSlice,
  resume: resumeSlice,
  ui: uiSlice
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, (state, action) => {
  // Handle root-level actions
  if (action.type === 'RESET_APP') {
    state = undefined;
  }
  
  if (action.type === 'CLEAR_INTERVIEW_DATA') {
    return {
      ...state,
      interview: interviewSlice.getInitialState(),
      resume: resumeSlice.getInitialState()
    };
  }
  
  // Apply individual reducers
  const newState = { ...state };
  Object.keys(rootReducer).forEach(key => {
    newState[key] = rootReducer[key](state?.[key], action);
  });
  
  return newState;
});

// Configure store with middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER'
        ],
        ignoredPaths: [
          'register',
          'rehydrate',
          'interview.currentTimer'
        ]
      },
      immutableCheck: {
        warnAfter: 1000 // Increase warning threshold for larger state
      }
    }).concat([
      // Custom middleware for logging in development
      ...(process.env.NODE_ENV === 'development' 
        ? [require('redux-flipper').default()] 
        : []
      )
    ]),
  devTools: process.env.NODE_ENV === 'development' ? {
    name: 'Crisp Interview Assistant',
    trace: true,
    traceLimit: 25
  } : false
});

// Create persistor
export const persistor = persistStore(store, null, (error) => {
  if (error) {
    console.error('Error rehydrating store:', error);
  } else {
    console.log('Store rehydration complete');
  }
});

// Store utilities
export const resetStore = () => {
  store.dispatch({ type: 'RESET_APP' });
};

export const clearInterviewData = () => {
  store.dispatch({ type: 'CLEAR_INTERVIEW_DATA' });
};

export const getStoreState = () => {
  return store.getState();
};

export const subscribeToStore = (callback) => {
  return store.subscribe(callback);
};

// Type definitions for TypeScript (if using)
export const storeTypes = {
  RootState: typeof store.getState,
  AppDispatch: typeof store.dispatch
};

// Store status monitoring
let storeStatus = 'initialized';

export const getStoreStatus = () => storeStatus;

store.subscribe(() => {
  const state = store.getState();
  storeStatus = state?._persist?.rehydrated ? 'rehydrated' : 'hydrating';
});

// Export store instance
export default store;