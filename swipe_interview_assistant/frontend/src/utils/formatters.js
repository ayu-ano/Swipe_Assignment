// Formatters Utility for data formatting and display
class Formatters {
  constructor() {
    this.numberFormats = this.initializeNumberFormats();
    this.dateFormats = this.initializeDateFormats();
    this.currencyFormats = this.initializeCurrencyFormats();
  }

  // Initialize number formatting options
  initializeNumberFormats() {
    return {
      score: {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      },
      percentage: {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      },
      decimal: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      integer: {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    };
  }

  // Initialize date formatting options
  initializeDateFormats() {
    return {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      },
      time: {
        hour: '2-digit',
        minute: '2-digit'
      },
      datetime: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      },
      relative: {
        // Relative time formatting
      }
    };
  }

  // Initialize currency formatting options
  initializeCurrencyFormats() {
    return {
      USD: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      },
      EUR: {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      },
      GBP: {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    };
  }

  // Format score (0-100)
  formatScore(score, options = {}) {
    if (typeof score !== 'number' || isNaN(score)) {
      return 'N/A';
    }

    const clampedScore = Math.max(0, Math.min(100, score));
    const formatOptions = { ...this.numberFormats.score, ...options };
    
    return new Intl.NumberFormat('en-US', formatOptions).format(clampedScore);
  }

  // Format score with color coding
  formatScoreWithColor(score) {
    const formattedScore = this.formatScore(score);
    
    let color = '#6B7280'; // gray - default
    let status = 'Unknown';

    if (score >= 80) {
      color = '#10B981'; // green
      status = 'Excellent';
    } else if (score >= 60) {
      color = '#F59E0B'; // amber
      status = 'Good';
    } else if (score >= 40) {
      color = '#F97316'; // orange
      status = 'Fair';
    } else if (score >= 0) {
      color = '#EF4444'; // red
      status = 'Needs Work';
    }

    return {
      score: formattedScore,
      color,
      status,
      display: `${formattedScore} (${status})`
    };
  }

  // Format percentage
  formatPercentage(value, total = 100, options = {}) {
    if (total === 0) return '0%';

    const percentage = (value / total) * 100;
    const formatOptions = { ...this.numberFormats.percentage, ...options };
    
    return new Intl.NumberFormat('en-US', formatOptions).format(percentage / 100);
  }

  // Format file size
  formatFileSize(bytes, options = {}) {
    if (typeof bytes !== 'number' || bytes < 0) {
      return '0 Bytes';
    }

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    
    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = bytes / Math.pow(k, i);
    
    const formatOptions = {
      minimumFractionDigits: i > 0 ? 1 : 0,
      maximumFractionDigits: i > 0 ? 1 : 0,
      ...options
    };

    const formattedSize = new Intl.NumberFormat('en-US', formatOptions).format(size);
    return `${formattedSize} ${units[i]}`;
  }

  // Format date
  formatDate(date, format = 'short', locale = 'en-US') {
    if (!date) return '';

    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    if (format === 'relative') {
      return this.formatRelativeTime(dateObj);
    }

    const formatOptions = this.dateFormats[format] || this.dateFormats.short;
    
    try {
      return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateObj.toLocaleDateString();
    }
  }

  // Format date and time
  formatDateTime(date, locale = 'en-US') {
    return this.formatDate(date, 'datetime', locale);
  }

  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffWeeks < 4) {
      return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
    } else if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
    }
  }

  // Format duration in seconds to human readable
  formatDuration(seconds, options = {}) {
    if (typeof seconds !== 'number' || seconds < 0) {
      return '0s';
    }

    const {
      showMilliseconds = false,
      compact = false
    } = options;

    if (showMilliseconds && seconds < 1) {
      const ms = Math.round(seconds * 1000);
      return `${ms}ms`;
    }

    if (seconds < 60) {
      return compact ? `${Math.round(seconds)}s` : `${Math.round(seconds)} seconds`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes < 60) {
      if (remainingSeconds === 0) {
        return compact ? `${minutes}m` : `${minutes} minute${minutes !== 1 ? 's' : ''}`;
      }
      return compact ? 
        `${minutes}m ${Math.round(remainingSeconds)}s` : 
        `${minutes} minute${minutes !== 1 ? 's' : ''} ${Math.round(remainingSeconds)} second${remainingSeconds !== 1 ? 's' : ''}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return compact ? `${hours}h` : `${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    return compact ?
      `${hours}h ${remainingMinutes}m` :
      `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }

  // Format number with thousands separators
  formatNumber(number, options = {}) {
    if (typeof number !== 'number' || isNaN(number)) {
      return '0';
    }

    const formatOptions = { ...this.numberFormats.integer, ...options };
    return new Intl.NumberFormat('en-US', formatOptions).format(number);
  }

  // Format currency
  formatCurrency(amount, currency = 'USD', options = {}) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      amount = 0;
    }

    const currencyConfig = this.currencyFormats[currency] || this.currencyFormats.USD;
    const formatOptions = { ...currencyConfig, ...options };
    
    return new Intl.NumberFormat('en-US', formatOptions).format(amount);
  }

  // Format phone number
  formatPhoneNumber(phoneNumber, country = 'US') {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return '';
    }

    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 0) {
      return '';
    }

    // US/Canada formatting
    if (country === 'US' || country === 'CA') {
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length === 11 && cleaned[0] === '1') {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
    }

    // International formatting
    if (cleaned.length > 6) {
      return `+${cleaned}`;
    }

    // Return cleaned number if no specific format applies
    return cleaned;
  }

  // Format email (adds mailto: link)
  formatEmail(email, displayName = null) {
    if (!email || typeof email !== 'string') {
      return '';
    }

    const display = displayName || email;
    return {
      display,
      email,
      href: `mailto:${email}`,
      isEmail: true
    };
  }

  // Format URL
  formatURL(url, displayText = null) {
    if (!url || typeof url !== 'string') {
      return '';
    }

    // Ensure URL has protocol
    let formattedURL = url;
    if (!formattedURL.startsWith('http://') && !formattedURL.startsWith('https://')) {
      formattedURL = 'https://' + formattedURL;
    }

    const display = displayText || this.getDomainFromURL(formattedURL);
    
    return {
      display,
      url: formattedURL,
      href: formattedURL,
      isExternal: true
    };
  }

  // Extract domain from URL
  getDomainFromURL(url) {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  // Format skills array
  formatSkills(skills, options = {}) {
    if (!Array.isArray(skills)) {
      return '';
    }

    const {
      maxItems = 10,
      separator = ', ',
      truncate = true
    } = options;

    const validSkills = skills.filter(skill => 
      skill && typeof skill === 'string' && skill.trim().length > 0
    );

    if (validSkills.length === 0) {
      return 'No skills listed';
    }

    const displaySkills = truncate ? validSkills.slice(0, maxItems) : validSkills;
    let formatted = displaySkills.join(separator);

    if (truncate && validSkills.length > maxItems) {
      formatted += ` and ${validSkills.length - maxItems} more`;
    }

    return formatted;
  }

  // Format candidate name with title case
  formatName(name, options = {}) {
    if (!name || typeof name !== 'string') {
      return '';
    }

    const {
      titleCase = true,
      maxLength = 50
    } = options;

    let formatted = name.trim();

    if (titleCase) {
      formatted = formatted
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    if (formatted.length > maxLength) {
      formatted = formatted.substring(0, maxLength) + '...';
    }

    return formatted;
  }

  // Format interview stage
  formatInterviewStage(stage, options = {}) {
    const stageFormats = {
      'not_started': { label: 'Not Started', color: '#6B7280', icon: '⏸️' },
      'in_progress': { label: 'In Progress', color: '#F59E0B', icon: '▶️' },
      'completed': { label: 'Completed', color: '#10B981', icon: '✅' },
      'paused': { label: 'Paused', color: '#EF4444', icon: '⏸️' }
    };

    const format = stageFormats[stage] || stageFormats.not_started;
    
    return {
      ...format,
      stage,
      display: options.showIcon ? `${format.icon} ${format.label}` : format.label
    };
  }

  // Format difficulty level
  formatDifficulty(difficulty, options = {}) {
    const difficultyFormats = {
      'easy': { label: 'Easy', color: '#10B981', icon: '🟢', level: 1 },
      'medium': { label: 'Medium', color: '#F59E0B', icon: '🟡', level: 2 },
      'hard': { label: 'Hard', color: '#EF4444', icon: '🔴', level: 3 }
    };

    const format = difficultyFormats[difficulty] || difficultyFormats.easy;
    
    return {
      ...format,
      difficulty,
      display: options.showIcon ? `${format.icon} ${format.label}` : format.label
    };
  }

  // Format text with ellipsis
  truncateText(text, maxLength = 100, options = {}) {
    if (!text || typeof text !== 'string') {
      return '';
    }

    const {
      ellipsis = '...',
      preserveWords = true
    } = options;

    if (text.length <= maxLength) {
      return text;
    }

    if (!preserveWords) {
      return text.substring(0, maxLength) + ellipsis;
    }

    // Try to preserve word boundaries
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > maxLength * 0.7) { // Only truncate at space if it's not too early
      return truncated.substring(0, lastSpace) + ellipsis;
    }

    return truncated + ellipsis;
  }

  // Format JSON for display
  formatJSON(data, options = {}) {
    if (!data) {
      return '';
    }

    const {
      indent = 2,
      maxLength = 1000
    } = options;

    try {
      const jsonString = JSON.stringify(data, null, indent);
      
      if (jsonString.length > maxLength) {
        return this.truncateText(jsonString, maxLength);
      }

      return jsonString;
    } catch (error) {
      return String(data);
    }
  }

  // Format file type for display
  formatFileType(mimeType) {
    const typeMap = {
      'application/pdf': 'PDF Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
      'application/msword': 'Word Document',
      'image/jpeg': 'JPEG Image',
      'image/png': 'PNG Image',
      'image/gif': 'GIF Image',
      'text/plain': 'Text File'
    };

    return typeMap[mimeType] || mimeType || 'Unknown File Type';
  }

  // Format confidence level
  formatConfidence(confidence, options = {}) {
    if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
      return {
        level: 'unknown',
        label: 'Unknown',
        color: '#6B7280',
        percentage: 'N/A'
      };
    }

    const percentage = Math.round(confidence * 100);
    let level, label, color;

    if (confidence >= 0.8) {
      level = 'high';
      label = 'High Confidence';
      color = '#10B981';
    } else if (confidence >= 0.6) {
      level = 'medium';
      label = 'Medium Confidence';
      color = '#F59E0B';
    } else {
      level = 'low';
      label = 'Low Confidence';
      color = '#EF4444';
    }

    return {
      level,
      label,
      color,
      percentage: `${percentage}%`,
      display: options.showPercentage ? `${label} (${percentage}%)` : label
    };
  }

  // Sanitize HTML for safe display
  sanitizeHTML(html) {
    if (typeof html !== 'string') {
      return '';
    }

    return html
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Capitalize first letter
  capitalizeFirst(str) {
    if (!str || typeof str !== 'string') {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Convert camelCase to Title Case
  camelCaseToTitleCase(str) {
    if (!str || typeof str !== 'string') {
      return '';
    }
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, char => char.toUpperCase())
      .trim();
  }
}

// Create and export singleton instance
const formatters = new Formatters();
export default formatters;

// Export individual functions
export const formatScore = (score, options) => formatters.formatScore(score, options);
export const formatScoreWithColor = (score) => formatters.formatScoreWithColor(score);
export const formatPercentage = (value, total, options) => formatters.formatPercentage(value, total, options);
export const formatFileSize = (bytes, options) => formatters.formatFileSize(bytes, options);
export const formatDate = (date, format, locale) => formatters.formatDate(date, format, locale);
export const formatDuration = (seconds, options) => formatters.formatDuration(seconds, options);
export const formatPhoneNumber = (phoneNumber, country) => formatters.formatPhoneNumber(phoneNumber, country);
export const formatSkills = (skills, options) => formatters.formatSkills(skills, options);
export const truncateText = (text, maxLength, options) => formatters.truncateText(text, maxLength, options);