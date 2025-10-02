// Time Utilities for interview timing and duration management
class TimeUtils {
  constructor() {
    this.interviewConfig = {
      questionTimeLimits: {
        easy: 20,    // 20 seconds
        medium: 60,  // 1 minute
        hard: 120    // 2 minutes
      },
      totalInterviewTime: 6 * 60, // 6 minutes total for 6 questions
      warningThresholds: {
        low: 0.25,   // 25% time remaining
        critical: 0.1 // 10% time remaining
      }
    };
  }

  // Format seconds to MM:SS display
  formatTime(seconds) {
    if (typeof seconds !== 'number' || seconds < 0) {
      return '0:00';
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Format time with milliseconds for precise timing
  formatTimeWithMs(milliseconds) {
    if (typeof milliseconds !== 'number' || milliseconds < 0) {
      return '0:00.000';
    }

    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const ms = Math.floor(milliseconds % 1000);

    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }

  // Calculate time remaining based on start time and duration
  calculateTimeRemaining(startTime, duration) {
    if (!startTime || !duration) {
      return 0;
    }

    const start = new Date(startTime).getTime();
    const now = Date.now();
    const elapsed = now - start;
    const remaining = Math.max(0, duration - elapsed);

    return Math.floor(remaining / 1000); // Return in seconds
  }

  // Calculate progress percentage
  calculateProgress(elapsed, total) {
    if (total <= 0) return 0;
    const progress = (elapsed / total) * 100;
    return Math.min(100, Math.max(0, progress));
  }

  // Get time limit for question difficulty
  getTimeLimit(difficulty) {
    return this.interviewConfig.questionTimeLimits[difficulty] || 60;
  }

  // Get time limit in milliseconds
  getTimeLimitMs(difficulty) {
    return this.getTimeLimit(difficulty) * 1000;
  }

  // Calculate total interview duration
  calculateTotalInterviewTime() {
    const { questionTimeLimits } = this.interviewConfig;
    return (questionTimeLimits.easy * 2) + (questionTimeLimits.medium * 2) + (questionTimeLimits.hard * 2);
  }

  // Estimate completion time based on current progress
  estimateCompletionTime(startTime, totalQuestions, completedQuestions) {
    if (!startTime || totalQuestions <= 0) {
      return null;
    }

    const start = new Date(startTime).getTime();
    const now = Date.now();
    const elapsed = now - start;

    if (completedQuestions <= 0) {
      return null;
    }

    const avgTimePerQuestion = elapsed / completedQuestions;
    const remainingQuestions = totalQuestions - completedQuestions;
    const estimatedRemainingTime = avgTimePerQuestion * remainingQuestions;

    return new Date(now + estimatedRemainingTime);
  }

  // Check if time is running low
  isTimeLow(remainingTime, totalTime) {
    if (totalTime <= 0) return false;
    const ratio = remainingTime / totalTime;
    return ratio <= this.interviewConfig.warningThresholds.low;
  }

  // Check if time is critical
  isTimeCritical(remainingTime, totalTime) {
    if (totalTime <= 0) return false;
    const ratio = remainingTime / totalTime;
    return ratio <= this.interviewConfig.warningThresholds.critical;
  }

  // Get time status for UI display
  getTimeStatus(remainingTime, totalTime) {
    if (this.isTimeCritical(remainingTime, totalTime)) {
      return {
        status: 'critical',
        color: 'red',
        message: 'Time almost expired!',
        shouldBlink: true
      };
    }

    if (this.isTimeLow(remainingTime, totalTime)) {
      return {
        status: 'warning',
        color: 'orange',
        message: 'Time running low',
        shouldBlink: false
      };
    }

    return {
      status: 'normal',
      color: 'green',
      message: 'Time remaining',
      shouldBlink: false
    };
  }

  // Format duration for display (e.g., "2 minutes 30 seconds")
  formatDuration(seconds) {
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  }

  // Format date for display
  formatDate(date, format = 'standard') {
    if (!date) return '';

    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const formats = {
      standard: dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      detailed: dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      datetime: dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      relative: this.getRelativeTime(dateObj)
    };

    return formats[format] || formats.standard;
  }

  // Get relative time (e.g., "2 hours ago", "in 5 minutes")
  getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return this.formatDate(date, 'standard');
    }
  }

  // Calculate time spent on a question
  calculateTimeSpent(startTime, endTime = new Date()) {
    if (!startTime) return 0;

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    
    if (isNaN(start) || isNaN(end)) {
      return 0;
    }

    return Math.max(0, end - start);
  }

  // Format time spent for display
  formatTimeSpent(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    
    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }

    return `${minutes}m ${remainingSeconds}s`;
  }

  // Create a countdown timer
  createCountdownTimer(duration, onTick, onComplete) {
    let remaining = duration;
    let timerId = null;

    const tick = () => {
      if (remaining <= 0) {
        stop();
        onComplete?.();
        return;
      }

      onTick?.(remaining);
      remaining--;
    };

    const start = () => {
      if (timerId) return;
      timerId = setInterval(tick, 1000);
      tick(); // Initial tick
    };

    const stop = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    const pause = () => {
      stop();
    };

    const resume = () => {
      start();
    };

    const getRemaining = () => remaining;

    return {
      start,
      stop,
      pause,
      resume,
      getRemaining
    };
  }

  // Debounce function for performance
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  // Throttle function for performance
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Calculate average time per question
  calculateAverageTime(answers) {
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return 0;
    }

    const totalTime = answers.reduce((sum, answer) => {
      return sum + (answer.timeSpent || 0);
    }, 0);

    return Math.round(totalTime / answers.length);
  }

  // Get time distribution across difficulties
  getTimeDistribution(answers) {
    const distribution = {
      easy: { total: 0, count: 0, average: 0 },
      medium: { total: 0, count: 0, average: 0 },
      hard: { total: 0, count: 0, average: 0 }
    };

    answers.forEach(answer => {
      if (distribution[answer.difficulty]) {
        distribution[answer.difficulty].total += answer.timeSpent || 0;
        distribution[answer.difficulty].count++;
      }
    });

    // Calculate averages
    Object.keys(distribution).forEach(difficulty => {
      const data = distribution[difficulty];
      data.average = data.count > 0 ? Math.round(data.total / data.count) : 0;
    });

    return distribution;
  }

  // Validate time string (HH:MM:SS)
  validateTimeString(timeString) {
    if (typeof timeString !== 'string') return false;
    
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    return timeRegex.test(timeString);
  }

  // Convert time string to seconds
  timeStringToSeconds(timeString) {
    if (!this.validateTimeString(timeString)) {
      return 0;
    }

    const parts = timeString.split(':');
    let seconds = 0;
    let multiplier = 1;

    // Start from seconds and go up to hours
    for (let i = parts.length - 1; i >= 0; i--) {
      seconds += parseInt(parts[i], 10) * multiplier;
      multiplier *= 60;
    }

    return seconds;
  }

  // Convert seconds to time string
  secondsToTimeString(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Get current timestamp in ISO format
  getCurrentTimestamp() {
    return new Date().toISOString();
  }

  // Get timezone information
  getTimezoneInfo() {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      offset: new Date().getTimezoneOffset(),
      locale: navigator.language
    };
  }

  // Check if date is today
  isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    
    return today.toDateString() === checkDate.toDateString();
  }

  // Check if date is in the past
  isPast(date) {
    return new Date(date) < new Date();
  }

  // Check if date is in the future
  isFuture(date) {
    return new Date(date) > new Date();
  }
}

// Create and export singleton instance
const timeUtils = new TimeUtils();
export default timeUtils;

// Export individual functions
export const formatTime = (seconds) => timeUtils.formatTime(seconds);
export const formatDuration = (seconds) => timeUtils.formatDuration(seconds);
export const formatDate = (date, format) => timeUtils.formatDate(date, format);
export const getRelativeTime = (date) => timeUtils.getRelativeTime(date);
export const getTimeLimit = (difficulty) => timeUtils.getTimeLimit(difficulty);
export const calculateTimeRemaining = (startTime, duration) => 
  timeUtils.calculateTimeRemaining(startTime, duration);
export const calculateProgress = (elapsed, total) => 
  timeUtils.calculateProgress(elapsed, total);
export const createCountdownTimer = (duration, onTick, onComplete) => 
  timeUtils.createCountdownTimer(duration, onTick, onComplete);
export const getTimeStatus = (remainingTime, totalTime) => 
  timeUtils.getTimeStatus(remainingTime, totalTime);