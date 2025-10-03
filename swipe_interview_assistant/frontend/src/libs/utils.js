// Comprehensive utility library for Crisp Interview Assistant
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ========== CLASSNAME UTILITIES ==========

/**
 * Combines class names with Tailwind CSS merge functionality
 * Handles conditional classes and conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Conditional class name helper with variants
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ========== DATE & TIME UTILITIES ==========

/**
 * Format date to readable string
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString(undefined, defaultOptions);
}

/**
 * Format time to readable string
 */
export function formatTime(date, options = {}) {
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return new Date(date).toLocaleTimeString(undefined, defaultOptions);
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const target = new Date(date);
  const diffInMs = target - now;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffInDays) > 0) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInHours) > 0) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInMinutes) > 0) {
    return rtf.format(diffInMinutes, 'minute');
  } else {
    return rtf.format(diffInSeconds, 'second');
  }
}

/**
 * Calculate duration between two dates in minutes
 */
export function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.round((end - start) / (1000 * 60));
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

// ========== STRING UTILITIES ==========

/**
 * Capitalize first letter of a string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert camelCase to Title Case
 */
export function camelToTitleCase(str) {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, char => char.toUpperCase())
    .trim();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 50, ellipsis = '...') {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Generate initials from name
 */
export function getInitials(name) {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Slugify string for URLs
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// ========== NUMBER & CURRENCY UTILITIES ==========

/**
 * Format number with commas
 */
export function formatNumber(num) {
  if (typeof num !== 'number') return '0';
  return new Intl.NumberFormat().format(num);
}

/**
 * Format currency
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Clamp number between min and max
 */
export function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

// ========== ARRAY UTILITIES ==========

/**
 * Remove duplicates from array
 */
export function unique(array, key = null) {
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }
  return [...new Set(array)];
}

/**
 * Group array by key
 */
export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
}

/**
 * Sort array by key
 */
export function sortBy(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];
    
    // Handle nested keys (e.g., 'user.name')
    if (key.includes('.')) {
      aVal = key.split('.').reduce((obj, k) => obj?.[k], a);
      bVal = key.split('.').reduce((obj, k) => obj?.[k], b);
    }
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Chunk array into smaller arrays
 */
export function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flatten nested array
 */
export function flatten(array) {
  return array.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

// ========== OBJECT UTILITIES ==========

/**
 * Deep clone object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Merge objects deeply
 */
export function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
}

/**
 * Check if value is an object
 */
export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Pick specific properties from object
 */
export function pick(obj, keys) {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

/**
 * Omit specific properties from object
 */
export function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

// ========== VALIDATION UTILITIES ==========

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if value exists and is not empty
 */
export function isNotEmpty(value) {
  return !isEmpty(value);
}

// ========== FILE & URL UTILITIES ==========

/**
 * Get file extension from filename
 */
export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if file type is supported
 */
export function isSupportedFileType(file, supportedTypes = ['pdf', 'doc', 'docx']) {
  const extension = getFileExtension(file.name).toLowerCase();
  return supportedTypes.includes(extension);
}

/**
 * Generate random ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}${timestamp}-${random}`;
}

/**
 * Debounce function calls
 */
export function debounce(func, wait, immediate = false) {
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

/**
 * Throttle function calls
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ========== INTERVIEW SPECIFIC UTILITIES ==========

/**
 * Calculate interview score based on evaluations
 */
export function calculateInterviewScore(evaluations) {
  if (!evaluations || evaluations.length === 0) return 0;
  
  const totalScore = evaluations.reduce((sum, evalItem) => {
    return sum + (evalItem.score || 0);
  }, 0);
  
  return Math.round(totalScore / evaluations.length);
}

/**
 * Get difficulty color
 */
export function getDifficultyColor(difficulty) {
  const colors = {
    easy: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400',
    medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400',
    hard: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400'
  };
  
  return colors[difficulty] || colors.medium;
}

/**
 * Get status color and variant
 */
export function getStatusConfig(status) {
  const configs = {
    new: {
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400',
      label: 'New'
    },
    screening: {
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-400',
      label: 'Screening'
    },
    interview: {
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400',
      label: 'Interview'
    },
    final: {
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-400',
      label: 'Final Round'
    },
    offer: {
      color: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400',
      label: 'Offer'
    },
    hired: {
      color: 'text-green-700 bg-green-200 dark:bg-green-800 dark:text-green-300',
      label: 'Hired'
    },
    rejected: {
      color: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400',
      label: 'Rejected'
    },
    withdrawn: {
      color: 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400',
      label: 'Withdrawn'
    }
  };
  
  return configs[status] || configs.new;
}

/**
 * Generate progress percentage for interview
 */
export function calculateInterviewProgress(interview) {
  if (!interview?.questions) return 0;
  
  const completed = interview.questions.filter(q => q.completedAt).length;
  const total = interview.questions.length;
  
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

/**
 * Format candidate name for display
 */
export function formatCandidateName(candidate) {
  if (!candidate) return 'Unknown Candidate';
  
  if (candidate.firstName && candidate.lastName) {
    return `${candidate.firstName} ${candidate.lastName}`;
  }
  
  return candidate.name || 'Unknown Candidate';
}

// ========== PERFORMANCE & OPTIMIZATION ==========

/**
 * Memoize expensive function calls
 */
export function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Measure function execution time
 */
export function measurePerformance(fn, label = 'Function') {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`${label} executed in: ${(end - start).toFixed(2)}ms`);
    return result;
  };
}

// ========== ERROR HANDLING ==========

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

/**
 * Safe function execution with error handling
 */
export function safeExecute(fn, defaultValue = null) {
  try {
    return fn();
  } catch (error) {
    console.error('Error executing function:', error);
    return defaultValue;
  }
}

// ========== EXPORT ALL UTILITIES ==========

export default {
  // Classname utilities
  cn,
  classNames,
  
  // Date & time
  formatDate,
  formatTime,
  formatRelativeTime,
  calculateDuration,
  formatDuration,
  
  // String utilities
  capitalize,
  camelToTitleCase,
  truncate,
  getInitials,
  slugify,
  
  // Number utilities
  formatNumber,
  formatCurrency,
  calculatePercentage,
  clamp,
  
  // Array utilities
  unique,
  groupBy,
  sortBy,
  chunk,
  flatten,
  
  // Object utilities
  deepClone,
  deepMerge,
  isObject,
  pick,
  omit,
  
  // Validation
  isValidEmail,
  isValidPhone,
  isEmpty,
  isNotEmpty,
  
  // File & URL
  getFileExtension,
  formatFileSize,
  isSupportedFileType,
  generateId,
  
  // Performance
  debounce,
  throttle,
  memoize,
  measurePerformance,
  
  // Interview specific
  calculateInterviewScore,
  getDifficultyColor,
  getStatusConfig,
  calculateInterviewProgress,
  formatCandidateName,
  
  // Error handling
  safeJsonParse,
  safeExecute
};