// Error Messages and User-Friendly Error Handling
export const ERROR_TYPES = {
  // File upload errors
  FILE_UPLOAD: {
    INVALID_TYPE: 'FILE_UPLOAD_INVALID_TYPE',
    SIZE_EXCEEDED: 'FILE_UPLOAD_SIZE_EXCEEDED',
    CORRUPTED: 'FILE_UPLOAD_CORRUPTED',
    PERMISSION_DENIED: 'FILE_UPLOAD_PERMISSION_DENIED',
    NETWORK_ERROR: 'FILE_UPLOAD_NETWORK_ERROR'
  },

  // Resume parsing errors
  RESUME_PARSING: {
    EXTRACTION_FAILED: 'RESUME_PARSING_EXTRACTION_FAILED',
    INVALID_FORMAT: 'RESUME_PARSING_INVALID_FORMAT',
    MISSING_FIELDS: 'RESUME_PARSING_MISSING_FIELDS',
    PARSING_TIMEOUT: 'RESUME_PARSING_TIMEOUT'
  },

  // AI Service errors
  AI_SERVICE: {
    API_ERROR: 'AI_SERVICE_API_ERROR',
    RATE_LIMITED: 'AI_SERVICE_RATE_LIMITED',
    QUOTA_EXCEEDED: 'AI_SERVICE_QUOTA_EXCEEDED',
    TIMEOUT: 'AI_SERVICE_TIMEOUT',
    INVALID_RESPONSE: 'AI_SERVICE_INVALID_RESPONSE'
  },

  // Interview flow errors
  INTERVIEW_FLOW: {
    SESSION_EXPIRED: 'INTERVIEW_FLOW_SESSION_EXPIRED',
    INVALID_STATE: 'INTERVIEW_FLOW_INVALID_STATE',
    QUESTION_GENERATION_FAILED: 'INTERVIEW_FLOW_QUESTION_GENERATION_FAILED',
    ANSWER_SUBMISSION_FAILED: 'INTERVIEW_FLOW_ANSWER_SUBMISSION_FAILED'
  },

  // Storage errors
  STORAGE: {
    QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',
    WRITE_ERROR: 'STORAGE_WRITE_ERROR',
    READ_ERROR: 'STORAGE_READ_ERROR',
    CORRUPTED_DATA: 'STORAGE_CORRUPTED_DATA'
  },

  // Validation errors
  VALIDATION: {
    INVALID_EMAIL: 'VALIDATION_INVALID_EMAIL',
    INVALID_PHONE: 'VALIDATION_INVALID_PHONE',
    INVALID_NAME: 'VALIDATION_INVALID_NAME',
    MISSING_REQUIRED_FIELD: 'VALIDATION_MISSING_REQUIRED_FIELD',
    INVALID_ANSWER: 'VALIDATION_INVALID_ANSWER'
  },

  // Network errors
  NETWORK: {
    OFFLINE: 'NETWORK_OFFLINE',
    TIMEOUT: 'NETWORK_TIMEOUT',
    SERVER_ERROR: 'NETWORK_SERVER_ERROR',
    CORS_ERROR: 'NETWORK_CORS_ERROR'
  },

  // Authentication errors
  AUTH: {
    UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
    FORBIDDEN: 'AUTH_FORBIDDEN',
    TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED'
  }
};

// User-friendly error messages
export const ERROR_MESSAGES = {
  // File upload errors
  [ERROR_TYPES.FILE_UPLOAD.INVALID_TYPE]: {
    title: 'Unsupported File Type',
    message: 'Please upload a PDF or DOCX file. The file type you selected is not supported.',
    action: 'Try again with a different file',
    severity: 'warning'
  },
  [ERROR_TYPES.FILE_UPLOAD.SIZE_EXCEEDED]: {
    title: 'File Too Large',
    message: 'The file you uploaded exceeds the 10MB size limit. Please choose a smaller file.',
    action: 'Choose a smaller file or compress the current one',
    severity: 'warning'
  },
  [ERROR_TYPES.FILE_UPLOAD.CORRUPTED]: {
    title: 'File Corrupted',
    message: 'The file appears to be corrupted or damaged. Please check the file and try again.',
    action: 'Try again with a valid file',
    severity: 'error'
  },
  [ERROR_TYPES.FILE_UPLOAD.PERMISSION_DENIED]: {
    title: 'Permission Denied',
    message: 'Unable to access the file. Please check your browser permissions and try again.',
    action: 'Check browser settings and try again',
    severity: 'error'
  },

  // Resume parsing errors
  [ERROR_TYPES.RESUME_PARSING.EXTRACTION_FAILED]: {
    title: 'Resume Processing Failed',
    message: 'We couldn\'t extract information from your resume. This might be due to formatting issues or image-based resumes.',
    action: 'Try uploading a different file or enter details manually',
    severity: 'warning'
  },
  [ERROR_TYPES.RESUME_PARSING.MISSING_FIELDS]: {
    title: 'Missing Information',
    message: 'We found your resume but couldn\'t extract all required information. Please fill in the missing details below.',
    action: 'Complete the required fields',
    severity: 'info'
  },
  [ERROR_TYPES.RESUME_PARSING.PARSING_TIMEOUT]: {
    title: 'Processing Taking Too Long',
    message: 'Resume processing is taking longer than expected. Please wait or try again with a simpler file.',
    action: 'Wait or try a different file',
    severity: 'warning'
  },

  // AI Service errors
  [ERROR_TYPES.AI_SERVICE.API_ERROR]: {
    title: 'Service Temporarily Unavailable',
    message: 'Our AI service is experiencing issues. We\'ll use mock data for now so you can continue your interview.',
    action: 'Continue with demo mode',
    severity: 'warning'
  },
  [ERROR_TYPES.AI_SERVICE.RATE_LIMITED]: {
    title: 'Service Busy',
    message: 'Our service is currently handling high traffic. Please wait a moment and try again.',
    action: 'Wait and retry',
    severity: 'warning'
  },
  [ERROR_TYPES.AI_SERVICE.TIMEOUT]: {
    title: 'Request Timeout',
    message: 'The AI service took too long to respond. We\'ll use fallback questions for now.',
    action: 'Continue with fallback questions',
    severity: 'warning'
  },

  // Interview flow errors
  [ERROR_TYPES.INTERVIEW_FLOW.SESSION_EXPIRED]: {
    title: 'Session Expired',
    message: 'Your interview session has expired. Please start a new interview.',
    action: 'Start new interview',
    severity: 'error'
  },
  [ERROR_TYPES.INTERVIEW_FLOW.QUESTION_GENERATION_FAILED]: {
    title: 'Question Generation Failed',
    message: 'We encountered an issue generating the next question. Please continue with the next question.',
    action: 'Continue to next question',
    severity: 'warning'
  },

  // Storage errors
  [ERROR_TYPES.STORAGE.QUOTA_EXCEEDED]: {
    title: 'Storage Limit Reached',
    message: 'Your browser storage is full. Some features may not work properly.',
    action: 'Clear browser storage or use incognito mode',
    severity: 'error'
  },
  [ERROR_TYPES.STORAGE.CORRUPTED_DATA]: {
    title: 'Data Corrupted',
    message: 'We detected corrupted interview data. Starting a fresh session is recommended.',
    action: 'Start new session',
    severity: 'error'
  },

  // Validation errors
  [ERROR_TYPES.VALIDATION.INVALID_EMAIL]: {
    title: 'Invalid Email',
    message: 'Please enter a valid email address (e.g., your.name@example.com).',
    action: 'Enter a valid email',
    severity: 'warning'
  },
  [ERROR_TYPES.VALIDATION.INVALID_PHONE]: {
    title: 'Invalid Phone Number',
    message: 'Please enter a valid phone number (e.g., +1 555 123 4567).',
    action: 'Enter a valid phone number',
    severity: 'warning'
  },
  [ERROR_TYPES.VALIDATION.MISSING_REQUIRED_FIELD]: {
    title: 'Missing Information',
    message: 'Please fill in all required fields to continue.',
    action: 'Complete required fields',
    severity: 'warning'
  },

  // Network errors
  [ERROR_TYPES.NETWORK.OFFLINE]: {
    title: 'You\'re Offline',
    message: 'Please check your internet connection. Some features require an active connection.',
    action: 'Check connection and retry',
    severity: 'error'
  },
  [ERROR_TYPES.NETWORK.TIMEOUT]: {
    title: 'Connection Timeout',
    message: 'The request took too long. Please check your connection and try again.',
    action: 'Retry',
    severity: 'warning'
  },

  // Generic fallback errors
  GENERIC: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again or refresh the page.',
    action: 'Refresh page',
    severity: 'error'
  },
  RETRY: {
    title: 'Temporary Issue',
    message: 'We encountered a temporary issue. Please try again in a moment.',
    action: 'Try again',
    severity: 'warning'
  }
};

// Error recovery actions
export const ERROR_ACTIONS = {
  RETRY: 'retry',
  REFRESH: 'refresh',
  CONTINUE: 'continue',
  START_OVER: 'start_over',
  CONTACT_SUPPORT: 'contact_support',
  MANUAL_ENTRY: 'manual_entry'
};

// Error severity levels
export const ERROR_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};

// Helper functions
export const getErrorMessage = (errorCode, fallbackMessage = null) => {
  const messageConfig = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.GENERIC;
  
  return {
    code: errorCode,
    title: messageConfig.title,
    message: fallbackMessage || messageConfig.message,
    action: messageConfig.action,
    severity: messageConfig.severity,
    timestamp: new Date().toISOString()
  };
};

export const isRecoverableError = (errorCode) => {
  const nonRecoverableErrors = [
    ERROR_TYPES.STORAGE.QUOTA_EXCEEDED,
    ERROR_TYPES.FILE_UPLOAD.CORRUPTED,
    ERROR_TYPES.INTERVIEW_FLOW.SESSION_EXPIRED
  ];

  return !nonRecoverableErrors.includes(errorCode);
};

export const shouldShowRetryButton = (errorCode) => {
  const retryableErrors = [
    ERROR_TYPES.NETWORK.TIMEOUT,
    ERROR_TYPES.NETWORK.OFFLINE,
    ERROR_TYPES.AI_SERVICE.TIMEOUT,
    ERROR_TYPES.AI_SERVICE.RATE_LIMITED
  ];

  return retryableErrors.includes(errorCode);
};

export const getErrorSeverity = (errorCode) => {
  const messageConfig = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.GENERIC;
  return messageConfig.severity;
};

export const formatTechnicalError = (error, context = {}) => {
  const technicalInfo = {
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    name: error?.name,
    code: error?.code,
    context: context,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    url: window.location.href
  };

  // Remove stack trace in production for security
  if (process.env.NODE_ENV === 'production') {
    delete technicalInfo.stack;
  }

  return technicalInfo;
};

export const shouldLogError = (errorCode) => {
  const dontLogErrors = [
    ERROR_TYPES.VALIDATION.INVALID_EMAIL,
    ERROR_TYPES.VALIDATION.INVALID_PHONE,
    ERROR_TYPES.VALIDATION.MISSING_REQUIRED_FIELD
  ];

  return !dontLogErrors.includes(errorCode);
};

export const getErrorAction = (errorCode) => {
  const messageConfig = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.GENERIC;
  return messageConfig.action;
};

// Error boundaries and fallbacks
export const ERROR_FALLBACKS = {
  AI_SERVICE: {
    enabled: true,
    useMockData: true,
    fallbackQuestions: true,
    localEvaluation: true
  },
  STORAGE: {
    enabled: true,
    useSessionStorage: true,
    useMemoryFallback: true
  },
  NETWORK: {
    enabled: true,
    offlineMode: true,
    queueRequests: true
  }
};

// Error reporting configuration
export const ERROR_REPORTING = {
  ENABLED: process.env.NODE_ENV === 'production',
  ENDPOINT: '/api/error-reporting',
  SAMPLE_RATE: 0.1, // Report 10% of errors
  IGNORED_ERRORS: [
    'ResizeObserver loop limit exceeded',
    'Loading chunk',
    'NetworkError'
  ]
};

// Error context providers
export const ERROR_CONTEXTS = {
  RESUME_UPLOAD: 'resume_upload',
  INTERVIEW_START: 'interview_start',
  QUESTION_LOADING: 'question_loading',
  ANSWER_SUBMISSION: 'answer_submission',
  SESSION_RESUME: 'session_resume',
  RESULTS_VIEW: 'results_view'
};

export const getContextualErrorMessage = (errorCode, context) => {
  const baseMessage = getErrorMessage(errorCode);
  
  const contextualMessages = {
    [ERROR_CONTEXTS.RESUME_UPLOAD]: {
      [ERROR_TYPES.FILE_UPLOAD.INVALID_TYPE]: {
        ...baseMessage,
        message: 'Your resume must be in PDF or Word format. Please convert your file and try again.'
      }
    },
    [ERROR_CONTEXTS.INTERVIEW_START]: {
      [ERROR_TYPES.AI_SERVICE.API_ERROR]: {
        ...baseMessage,
        message: 'We\'re having trouble starting your interview. You can continue with sample questions while we fix this.'
      }
    },
    [ERROR_CONTEXTS.ANSWER_SUBMISSION]: {
      [ERROR_TYPES.NETWORK.OFFLINE]: {
        ...baseMessage,
        message: 'Your answer couldn\'t be submitted due to connection issues. It has been saved locally and will submit when you\'re back online.'
      }
    }
  };

  const contextualConfig = contextualMessages[context]?.[errorCode];
  return contextualConfig || baseMessage;
};

export default ERROR_MESSAGES;