import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../store/slices/uiSlice';

const useTabSync = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector(state => state.ui);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  // Broadcast tab changes to other tabs
  const broadcastTabChange = useCallback((newTab) => {
    try {
      // Broadcast to other tabs
      if (typeof window !== 'undefined' && window.localStorage) {
        const syncData = {
          type: 'TAB_CHANGE',
          tab: newTab,
          timestamp: Date.now(),
          source: 'useTabSync'
        };
        
        window.localStorage.setItem('tab-sync', JSON.stringify(syncData));
        
        // Also use BroadcastChannel if available
        if (window.BroadcastChannel) {
          const channel = new BroadcastChannel('tab_sync');
          channel.postMessage(syncData);
          setTimeout(() => channel.close(), 100);
        }
      }
    } catch (error) {
      console.warn('Tab sync broadcast failed:', error);
    }
  }, []);

  // Change tab and sync across instances
  const changeTab = useCallback((newTab) => {
    if (newTab === activeTab || !['interviewee', 'interviewer'].includes(newTab)) {
      return;
    }

    setIsSyncing(true);
    
    // Update local state
    dispatch(setActiveTab(newTab));
    
    // Broadcast change to other tabs
    broadcastTabChange(newTab);
    
    setLastAction({
      type: 'TAB_CHANGE',
      tab: newTab,
      timestamp: Date.now()
    });
    
    // Reset syncing state after a delay
    setTimeout(() => setIsSyncing(false), 500);
    
  }, [activeTab, dispatch, broadcastTabChange]);

  // Handle incoming sync messages
  const handleStorageChange = useCallback((event) => {
    if (event.key === 'tab-sync' && event.newValue) {
      try {
        const syncData = JSON.parse(event.newValue);
        
        // Ignore our own messages
        if (syncData.source === 'useTabSync') return;
        
        // Prevent infinite loops
        if (Date.now() - syncData.timestamp < 100) return;
        
        if (syncData.type === 'TAB_CHANGE' && syncData.tab !== activeTab) {
          setIsSyncing(true);
          dispatch(setActiveTab(syncData.tab));
          
          setLastAction({
            type: 'SYNC_RECEIVED',
            tab: syncData.tab,
            timestamp: syncData.timestamp
          });
          
          setTimeout(() => setIsSyncing(false), 500);
        }
      } catch (error) {
        console.warn('Failed to process tab sync message:', error);
      }
    }
  }, [activeTab, dispatch]);

  // Handle BroadcastChannel messages
  const handleBroadcastMessage = useCallback((event) => {
    if (event.data && event.data.type === 'TAB_CHANGE') {
      const syncData = event.data;
      
      // Ignore our own messages
      if (syncData.source === 'useTabSync') return;
      
      // Prevent infinite loops
      if (Date.now() - syncData.timestamp < 100) return;
      
      if (syncData.tab !== activeTab) {
        setIsSyncing(true);
        dispatch(setActiveTab(syncData.tab));
        
        setLastAction({
          type: 'BROADCAST_RECEIVED',
          tab: syncData.tab,
          timestamp: syncData.timestamp
        });
        
        setTimeout(() => setIsSyncing(false), 500);
      }
    }
  }, [activeTab, dispatch]);

  // Set up event listeners
  useEffect(() => {
    // Listen for localStorage changes (cross-tab sync)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    // Set up BroadcastChannel for real-time sync
    let broadcastChannel;
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      broadcastChannel = new BroadcastChannel('tab_sync');
      broadcastChannel.addEventListener('message', handleBroadcastMessage);
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcastMessage);
        broadcastChannel.close();
      }
    };
  }, [handleStorageChange, handleBroadcastMessage]);

  // Keyboard shortcuts for tab navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only trigger if not in input field
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl/Cmd + 1 for Interviewee tab
      if ((event.ctrlKey || event.metaKey) && event.key === '1') {
        event.preventDefault();
        changeTab('interviewee');
      }
      
      // Ctrl/Cmd + 2 for Interviewer tab
      if ((event.ctrlKey || event.metaKey) && event.key === '2') {
        event.preventDefault();
        changeTab('interviewer');
      }
      
      // Alt + I for Interviewee tab
      if (event.altKey && event.key.toLowerCase() === 'i') {
        event.preventDefault();
        changeTab('interviewee');
      }
      
      // Alt + D for Interviewer Dashboard
      if (event.altKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        changeTab('interviewer');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [changeTab]);

  // Get tab information
  const getTabInfo = useCallback((tab) => {
    const tabs = {
      interviewee: {
        label: 'Interviewee',
        description: 'Candidate interview interface',
        shortcut: 'Alt + I',
        icon: '🎤'
      },
      interviewer: {
        label: 'Interviewer Dashboard',
        description: 'Review candidate results and analytics',
        shortcut: 'Alt + D',
        icon: '📊'
      }
    };
    
    return tabs[tab] || tabs.interviewee;
  }, []);

  // Check if tab is currently active
  const isTabActive = useCallback((tab) => {
    return activeTab === tab;
  }, [activeTab]);

  // Get all available tabs
  const getAllTabs = useCallback(() => {
    return ['interviewee', 'interviewer'].map(tab => ({
      id: tab,
      ...getTabInfo(tab),
      isActive: isTabActive(tab)
    }));
  }, [getTabInfo, isTabActive]);

  return {
    // State
    activeTab,
    isSyncing,
    lastAction,
    
    // Actions
    changeTab,
    
    // Information
    currentTabInfo: getTabInfo(activeTab),
    allTabs: getAllTabs(),
    isIntervieweeTab: activeTab === 'interviewee',
    isInterviewerTab: activeTab === 'interviewer',
    
    // Utilities
    getTabInfo,
    isTabActive
  };
};

export default useTabSync;