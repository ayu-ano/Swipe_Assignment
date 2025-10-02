// Timer Configuration and Constants
export const TIMER_CONFIG = {
  // Base time limits in seconds
  TIME_LIMITS: {
    EASY: 20,
    MEDIUM: 60,
    HARD: 120,
    EXTENSION: 30 // Additional time for extensions
  },

  // Warning thresholds (percentage of time remaining)
  WARNING_THRESHOLDS: {
    LOW: 0.25,     // 25% time remaining - Yellow warning
    CRITICAL: 0.1, // 10% time remaining - Red warning
    BLINK: 0.05    // 5% time remaining - Blinking red
  },

  // Visual configuration
  DISPLAY: {
    UPDATE_INTERVAL: 100, // Update every 100ms for smooth animation
    BLINK_INTERVAL: 500,  // Blink every 500ms for critical time
    PROGRESS_ANIMATION_DURATION: 1000 // Progress bar animation duration
  },

  // Audio/Visual alerts configuration
  ALERTS: {
    ENABLED: true,
    VOLUME: 0.3,
    SOUNDS: {
      WARNING: '/sounds/warning.mp3',
      CRITICAL: '/sounds/critical.mp3',
      TIME_UP: '/sounds/time-up.mp3'
    },
    VISUAL: {
      WARNING_COLOR: '#F59E0B', // Amber
      CRITICAL_COLOR: '#EF4444', // Red
      NORMAL_COLOR: '#10B981'   // Green
    }
  },

  // Auto-submission configuration
  AUTO_SUBMIT: {
    ENABLED: true,
    GRACE_PERIOD: 2000, // 2 seconds grace period after time up
    MESSAGE: '[Time expired - No answer provided]'
  },

  // Pause and resume configuration
  PAUSE: {
    MAX_PAUSES: 3,
    MAX_PAUSE_DURATION: 5 * 60 * 1000, // 5 minutes maximum pause
    AUTO_RESUME: true
  },

  // Persistence configuration
  PERSISTENCE: {
    SAVE_INTERVAL: 5000, // Save timer state every 5 seconds
    DEBOUNCE_DELAY: 1000 // Debounce save operations
  }
};

// Timer states
export const TIMER_STATES = {
  RUNNING: 'running',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  COMPLETED: 'completed',
  EXPIRED: 'expired'
};

// Timer events
export const TIMER_EVENTS = {
  START: 'timer:start',
  PAUSE: 'timer:pause',
  RESUME: 'timer:resume',
  STOP: 'timer:stop',
  TICK: 'timer:tick',
  WARNING: 'timer:warning',
  CRITICAL: 'timer:critical',
  EXPIRED: 'timer:expired',
  COMPLETED: 'timer:completed'
};

// Helper functions
export const getTimeLimitForDifficulty = (difficulty) => {
  const upperCaseDifficulty = difficulty?.toUpperCase();
  return TIMER_CONFIG.TIME_LIMITS[upperCaseDifficulty] || TIMER_CONFIG.TIME_LIMITS.EASY;
};

export const getTimeLimitInMs = (difficulty) => {
  return getTimeLimitForDifficulty(difficulty) * 1000;
};

export const calculateWarningTime = (totalTime, threshold = 'LOW') => {
  const percentage = TIMER_CONFIG.WARNING_THRESHOLDS[threshold] || TIMER_CONFIG.WARNING_THRESHOLDS.LOW;
  return Math.floor(totalTime * percentage);
};

export const getTimeStatus = (remainingTime, totalTime) => {
  if (remainingTime <= 0) {
    return {
      status: 'expired',
      color: TIMER_CONFIG.ALERTS.VISUAL.CRITICAL_COLOR,
      message: 'Time expired!',
      shouldBlink: true,
      shouldPlaySound: true,
      sound: TIMER_CONFIG.ALERTS.SOUNDS.TIME_UP
    };
  }

  const percentage = remainingTime / totalTime;
  const { LOW, CRITICAL, BLINK } = TIMER_CONFIG.WARNING_THRESHOLDS;

  if (percentage <= BLINK) {
    return {
      status: 'critical-blink',
      color: TIMER_CONFIG.ALERTS.VISUAL.CRITICAL_COLOR,
      message: 'Hurry! Time almost up!',
      shouldBlink: true,
      shouldPlaySound: true,
      sound: TIMER_CONFIG.ALERTS.SOUNDS.CRITICAL
    };
  }

  if (percentage <= CRITICAL) {
    return {
      status: 'critical',
      color: TIMER_CONFIG.ALERTS.VISUAL.CRITICAL_COLOR,
      message: 'Time running out!',
      shouldBlink: false,
      shouldPlaySound: true,
      sound: TIMER_CONFIG.ALERTS.SOUNDS.CRITICAL
    };
  }

  if (percentage <= LOW) {
    return {
      status: 'warning',
      color: TIMER_CONFIG.ALERTS.VISUAL.WARNING_COLOR,
      message: 'Time running low',
      shouldBlink: false,
      shouldPlaySound: true,
      sound: TIMER_CONFIG.ALERTS.SOUNDS.WARNING
    };
  }

  return {
    status: 'normal',
    color: TIMER_CONFIG.ALERTS.VISUAL.NORMAL_COLOR,
    message: 'Time remaining',
    shouldBlink: false,
    shouldPlaySound: false
  };
};

export const formatTimeDisplay = (seconds, showMs = false) => {
  if (seconds < 0) seconds = 0;

  if (showMs) {
    const ms = Math.floor((seconds * 1000) % 1000);
    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const calculateProgress = (elapsed, total) => {
  if (total <= 0) return 0;
  const progress = (elapsed / total) * 100;
  return Math.min(100, Math.max(0, progress));
};

export const shouldShowWarning = (remainingTime, totalTime, threshold = 'LOW') => {
  const warningTime = calculateWarningTime(totalTime, threshold);
  return remainingTime <= warningTime;
};

export const getTimerUpdateInterval = () => {
  return TIMER_CONFIG.DISPLAY.UPDATE_INTERVAL;
};

export const getBlinkInterval = () => {
  return TIMER_CONFIG.DISPLAY.BLINK_INTERVAL;
};

export const isAutoSubmitEnabled = () => {
  return TIMER_CONFIG.AUTO_SUBMIT.ENABLED;
};

export const getAutoSubmitGracePeriod = () => {
  return TIMER_CONFIG.AUTO_SUBMIT.GRACE_PERIOD;
};

export const getAutoSubmitMessage = () => {
  return TIMER_CONFIG.AUTO_SUBMIT.MESSAGE;
};

export const canPauseTimer = (currentPauses, maxPauses = TIMER_CONFIG.PAUSE.MAX_PAUSES) => {
  return currentPauses < maxPauses;
};

export const calculateTotalInterviewTime = () => {
  const { EASY, MEDIUM, HARD } = TIMER_CONFIG.TIME_LIMITS;
  return (EASY * 2) + (MEDIUM * 2) + (HARD * 2);
};

export const estimateTimePerQuestion = (difficulty) => {
  const baseTime = getTimeLimitForDifficulty(difficulty);
  return {
    minimum: Math.floor(baseTime * 0.3), // 30% of allocated time
    recommended: Math.floor(baseTime * 0.7), // 70% of allocated time
    maximum: baseTime
  };
};

// Timer validation functions
export const validateTimerState = (state) => {
  return Object.values(TIMER_STATES).includes(state);
};

export const validateTimeValue = (time) => {
  return typeof time === 'number' && time >= 0 && !isNaN(time);
};

export const validateDifficulty = (difficulty) => {
  const difficulties = Object.keys(TIMER_CONFIG.TIME_LIMITS).map(d => d.toLowerCase());
  return difficulties.includes(difficulty?.toLowerCase());
};

// Export constants for direct access
export const TIME_LIMITS = TIMER_CONFIG.TIME_LIMITS;
export const WARNING_THRESHOLDS = TIMER_CONFIG.WARNING_THRESHOLDS;
export const ALERT_CONFIG = TIMER_CONFIG.ALERTS;
export const DISPLAY_CONFIG = TIMER_CONFIG.DISPLAY;

export default TIMER_CONFIG;