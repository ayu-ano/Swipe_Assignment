// UI Slice for managing modal states, loading states, and UI preferences
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Modal states
  modals: {
    welcomeBack: {
      isOpen: false,
      data: null
    },
    missingFields: {
      isOpen: false,
      data: null
    },
    interviewSummary: {
      isOpen: false,
      data: null
    },
    confirmation: {
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null
    },
    settings: {
      isOpen: false
    }
  },
  
  // Loading states
  loading: {
    global: false,
    resumeUpload: false,
    aiProcessing: false,
    questionGeneration: false,
    evaluation: false,
    candidateSearch: false
  },
  
  // Notification system
  notifications: {
    items: [],
    position: 'top-right',
    autoHideDuration: 5000
  },
  
  // UI preferences and theme
  preferences: {
    theme: 'light', // 'light' | 'dark' | 'system'
    sidebarCollapsed: false,
    compactMode: false,
    animationsEnabled: true,
    fontSize: 'medium', // 'small' | 'medium' | 'large'
    highContrast: false
  },
  
  // Navigation state
  navigation: {
    currentRoute: '/',
    previousRoute: null,
    breadcrumbs: []
  },
  
  // Responsive state
  responsive: {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenSize: 'desktop' // 'mobile' | 'tablet' | 'desktop'
  },
  
  // Error boundaries
  errors: {
    globalError: null,
    componentErrors: {}
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal actions
    openModal: (state, action) => {
      const { modalName, data } = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName].isOpen = true;
        state.modals[modalName].data = data || null;
      }
    },
    
    closeModal: (state, action) => {
      const { modalName } = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName].isOpen = false;
        state.modals[modalName].data = null;
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modalName => {
        state.modals[modalName].isOpen = false;
        state.modals[modalName].data = null;
      });
    },
    
    updateModalData: (state, action) => {
      const { modalName, data } = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName].data = {
          ...state.modals[modalName].data,
          ...data
        };
      }
    },
    
    // Loading actions
    setLoading: (state, action) => {
      const { key, isLoading } = action.payload;
      if (state.loading[key] !== undefined) {
        state.loading[key] = isLoading;
      }
    },
    
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload
      };
      state.notifications.items.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.items.length > 50) {
        state.notifications.items = state.notifications.items.slice(0, 50);
      }
    },
    
    removeNotification: (state, action) => {
      const { id } = action.payload;
      state.notifications.items = state.notifications.items.filter(
        notification => notification.id !== id
      );
    },
    
    markNotificationAsRead: (state, action) => {
      const { id } = action.payload;
      const notification = state.notifications.items.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
    },
    
    clearAllNotifications: (state) => {
      state.notifications.items = [];
    },
    
    // Preference actions
    setTheme: (state, action) => {
      state.preferences.theme = action.payload;
    },
    
    toggleSidebar: (state) => {
      state.preferences.sidebarCollapsed = !state.preferences.sidebarCollapsed;
    },
    
    setPreference: (state, action) => {
      const { key, value } = action.payload;
      if (state.preferences[key] !== undefined) {
        state.preferences[key] = value;
      }
    },
    
    // Navigation actions
    setCurrentRoute: (state, action) => {
      state.navigation.previousRoute = state.navigation.currentRoute;
      state.navigation.currentRoute = action.payload;
    },
    
    setBreadcrumbs: (state, action) => {
      state.navigation.breadcrumbs = action.payload;
    },
    
    // Responsive actions
    setScreenSize: (state, action) => {
      const { isMobile, isTablet, isDesktop, screenSize } = action.payload;
      state.responsive = {
        isMobile,
        isTablet,
        isDesktop,
        screenSize
      };
    },
    
    // Error handling
    setGlobalError: (state, action) => {
      state.errors.globalError = action.payload;
    },
    
    clearGlobalError: (state) => {
      state.errors.globalError = null;
    },
    
    setComponentError: (state, action) => {
      const { componentId, error } = action.payload;
      state.errors.componentErrors[componentId] = error;
    },
    
    clearComponentError: (state, action) => {
      const { componentId } = action.payload;
      delete state.errors.componentErrors[componentId];
    },
    
    // Reset UI state
    resetUIState: (state) => {
      return {
        ...initialState,
        preferences: state.preferences, // Keep user preferences
        responsive: state.responsive // Keep responsive state
      };
    }
  }
});

// Selectors
export const selectModals = (state) => state.ui.modals;
export const selectModal = (modalName) => (state) => state.ui.modals[modalName];
export const selectIsModalOpen = (modalName) => (state) => 
  state.ui.modals[modalName]?.isOpen || false;

export const selectLoading = (state) => state.ui.loading;
export const selectIsLoading = (key) => (state) => state.ui.loading[key];
export const selectGlobalLoading = (state) => state.ui.loading.global;

export const selectNotifications = (state) => state.ui.notifications;
export const selectUnreadNotifications = (state) => 
  state.ui.notifications.items.filter(notification => !notification.read);

export const selectPreferences = (state) => state.ui.preferences;
export const selectTheme = (state) => state.ui.preferences.theme;

export const selectNavigation = (state) => state.ui.navigation;
export const selectCurrentRoute = (state) => state.ui.navigation.currentRoute;

export const selectResponsive = (state) => state.ui.responsive;
export const selectIsMobile = (state) => state.ui.responsive.isMobile;

export const selectErrors = (state) => state.ui.errors;
export const selectGlobalError = (state) => state.ui.errors.globalError;

// Action creators
export const {
  openModal,
  closeModal,
  closeAllModals,
  updateModalData,
  setLoading,
  setGlobalLoading,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  clearAllNotifications,
  setTheme,
  toggleSidebar,
  setPreference,
  setCurrentRoute,
  setBreadcrumbs,
  setScreenSize,
  setGlobalError,
  clearGlobalError,
  setComponentError,
  clearComponentError,
  resetUIState
} = uiSlice.actions;

export default uiSlice.reducer;