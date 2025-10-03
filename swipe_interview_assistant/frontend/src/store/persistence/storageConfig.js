// Redux Persist Configuration with real-world optimizations
import { createTransform, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import sessionStorage from 'redux-persist/lib/storage/session'; // sessionStorage

// Custom transforms for handling special data types
const transformCircular = createTransform(
  // transform state coming from redux on its way to being serialized and stored
  (inboundState, key) => {
    // Handle circular references and non-serializable data
    if (key === 'interview' && inboundState?.currentSession) {
      return {
        ...inboundState,
        currentSession: {
          ...inboundState.currentSession,
          // Remove any non-serializable data
          audioContext: undefined,
          mediaRecorder: undefined,
          stream: undefined
        }
      };
    }
    return inboundState;
  },
  // transform state coming from storage on its way to be rehydrated
  (outboundState, key) => {
    // Restore any necessary data after rehydration
    if (key === 'ui' && outboundState?.responsive) {
      // Re-calculate responsive state on rehydration
      const width = window.innerWidth;
      return {
        ...outboundState,
        responsive: calculateResponsiveState(width)
      };
    }
    return outboundState;
  }
);

// Encryption transform (basic example - use proper encryption in production)
const encryptTransform = createTransform(
  (inboundState, key) => {
    // Simple base64 encoding for demo - use proper encryption in production
    if (['candidate', 'resume', 'interview'].includes(key)) {
      return btoa(JSON.stringify(inboundState));
    }
    return inboundState;
  },
  (outboundState, key) => {
    if (['candidate', 'resume', 'interview'].includes(key)) {
      try {
        return JSON.parse(atob(outboundState));
      } catch (error) {
        console.warn('Failed to decrypt stored state:', error);
        return null;
      }
    }
    return outboundState;
  }
);

// Migration configuration for state structure changes
const migrations = {
  1: (state) => {
    // Migration from version 0 to 1
    if (state.interview) {
      return {
        ...state,
        interview: {
          ...state.interview,
          // Add new fields or transform old ones
          sessions: state.interview.sessions || [],
          currentSession: state.interview.currentSession || null
        }
      };
    }
    return state;
  },
  2: (state) => {
    // Migration from version 1 to 2
    if (state.candidate) {
      return {
        ...state,
        candidate: {
          ...state.candidate,
          // Transform candidate data structure
          list: state.candidate.list || state.candidate.candidates || [],
          filters: state.candidate.filters || {}
        }
      };
    }
    return state;
  }
};

// Calculate responsive state based on window width
export const calculateResponsiveState = (width) => {
  if (width < 768) {
    return {
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      screenSize: 'mobile'
    };
  } else if (width < 1024) {
    return {
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      screenSize: 'tablet'
    };
  } else {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      screenSize: 'desktop'
    };
  }
};

// Main persist config
export const persistConfig = {
  key: 'crisp-interview-assistant',
  version: 2, // Increment when migrations are needed
  storage,
  whitelist: [
    'candidate',
    'interview', 
    'resume',
    'ui.preferences',
    'ui.navigation'
  ],
  blacklist: [
    'ui.loading',
    'ui.modals',
    'ui.notifications',
    'ui.errors',
    'interview.currentSession.audioContext',
    'interview.currentSession.mediaRecorder',
    'interview.currentSession.stream'
  ],
  transforms: [
    transformCircular,
    // encryptTransform // Enable in production with proper encryption
  ],
  migrate: (state) => {
    const version = state?._persist?.version || 0;
    
    // Apply migrations sequentially
    let migratedState = state;
    for (let i = version + 1; i <= Object.keys(migrations).length; i++) {
      if (migrations[i]) {
        migratedState = migrations[i](migratedState);
      }
    }
    
    return Promise.resolve(migratedState);
  },
  // Performance optimizations
  throttle: 1000, // Debounce storage writes
  writeFailHandler: (error) => {
    console.error('Redux persist write failed:', error);
    // Implement fallback storage or error reporting
  }
};

// Session-based persist config (for sensitive/temporary data)
export const sessionPersistConfig = {
  key: 'crisp-interview-session',
  storage: sessionStorage,
  whitelist: [
    'interview.currentSession',
    'ui.modals.welcomeBack'
  ],
  // Session storage doesn't need migrations
  migrate: null
};

// Candidate-specific persist config (for offline capability)
export const candidatePersistConfig = {
  key: 'crisp-candidate-data',
  storage,
  whitelist: ['candidate'],
  // Longer timeout for larger datasets
  timeout: 5000
};

// Utility functions for storage management
export const storageUtils = {
  // Clear all persisted data
  clearPersistedData: async () => {
    try {
      await storage.removeItem('persist:crisp-interview-assistant');
      await sessionStorage.removeItem('persist:crisp-interview-session');
      await storage.removeItem('persist:crisp-candidate-data');
      return true;
    } catch (error) {
      console.error('Failed to clear persisted data:', error);
      return false;
    }
  },
  
  // Export persisted data for backup
  exportPersistedData: async () => {
    try {
      const data = {
        main: await storage.getItem('persist:crisp-interview-assistant'),
        session: await sessionStorage.getItem('persist:crisp-interview-session'),
        candidate: await storage.getItem('persist:crisp-candidate-data')
      };
      return data;
    } catch (error) {
      console.error('Failed to export persisted data:', error);
      return null;
    }
  },
  
  // Import persisted data from backup
  importPersistedData: async (backupData) => {
    try {
      if (backupData.main) {
        await storage.setItem('persist:crisp-interview-assistant', backupData.main);
      }
      if (backupData.session) {
        await sessionStorage.setItem('persist:crisp-interview-session', backupData.session);
      }
      if (backupData.candidate) {
        await storage.setItem('persist:crisp-candidate-data', backupData.candidate);
      }
      return true;
    } catch (error) {
      console.error('Failed to import persisted data:', error);
      return false;
    }
  },
  
  // Get storage usage information
  getStorageInfo: async () => {
    try {
      const mainData = await storage.getItem('persist:crisp-interview-assistant');
      const sessionData = await sessionStorage.getItem('persist:crisp-interview-session');
      const candidateData = await storage.getItem('persist:crisp-candidate-data');
      
      return {
        main: mainData ? mainData.length : 0,
        session: sessionData ? sessionData.length : 0,
        candidate: candidateData ? candidateData.length : 0,
        total: [mainData, sessionData, candidateData]
          .filter(Boolean)
          .reduce((total, data) => total + data.length, 0)
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return null;
    }
  }
};

// Storage event listener for cross-tab synchronization
export const setupStorageSync = (store) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key?.startsWith('persist:')) {
        // Dispatch action to sync state across tabs
        store.dispatch({ type: 'STORAGE_SYNC', payload: event.key });
      }
    });
  }
};

export default persistConfig;