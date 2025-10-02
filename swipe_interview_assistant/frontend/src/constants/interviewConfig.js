// Interview Configuration Constants
export const INTERVIEW_CONFIG = {
  // Basic interview structure
  STRUCTURE: {
    TOTAL_QUESTIONS: 6,
    QUESTIONS_PER_DIFFICULTY: 2,
    DIFFICULTY_SEQUENCE: ['easy', 'easy', 'medium', 'medium', 'hard', 'hard'],
    MAX_INTERVIEW_DURATION: 30 * 60 * 1000, // 30 minutes in milliseconds
    AUTO_SUBMIT_DELAY: 2000, // 2 seconds delay after auto-submit
  },

  // Question configuration
  QUESTIONS: {
    CATEGORIES: {
      REACT: 'react',
      JAVASCRIPT: 'javascript',
      NODEJS: 'nodejs',
      HTML_CSS: 'html-css',
      SYSTEM_DESIGN: 'system-design',
      BEHAVIORAL: 'behavioral'
    },
    
    TYPES: {
      TECHNICAL: 'technical',
      BEHAVIORAL: 'behavioral',
      SYSTEM_DESIGN: 'system-design',
      ALGORITHM: 'algorithm'
    },

    // Question content focus areas
    FOCUS_AREAS: {
      EASY: [
        'Basic syntax and concepts',
        'Fundamental principles',
        'Simple problem-solving',
        'Definition and explanation'
      ],
      MEDIUM: [
        'Implementation details',
        'Problem-solving approaches',
        'Best practices',
        'Code optimization'
      ],
      HARD: [
        'System architecture',
        'Scalability considerations',
        'Performance optimization',
        'Trade-off analysis'
      ]
    }
  },

  // Scoring configuration
  SCORING: {
    MAX_SCORE: 100,
    MIN_SCORE: 0,
    
    // Score thresholds for performance levels
    THRESHOLDS: {
      EXCELLENT: 80,
      GOOD: 60,
      FAIR: 40,
      POOR: 0
    },

    // Weight distribution for different criteria
    CRITERIA_WEIGHTS: {
      TECHNICAL_ACCURACY: 0.35,
      COMPLETENESS: 0.25,
      CLARITY: 0.15,
      EXAMPLES: 0.15,
      DEPTH: 0.10
    },

    // Difficulty multipliers
    DIFFICULTY_MULTIPLIERS: {
      EASY: 1.0,
      MEDIUM: 1.2,
      HARD: 1.5
    }
  },

  // Time configuration
  TIMING: {
    // Time limits in seconds
    QUESTION_TIME_LIMITS: {
      EASY: 20,
      MEDIUM: 60,
      HARD: 120
    },

    // Warning thresholds (percentage of time remaining)
    WARNING_THRESHOLDS: {
      LOW: 0.25,     // 25% time remaining
      CRITICAL: 0.1  // 10% time remaining
    },

    // Buffer times in milliseconds
    BUFFERS: {
      QUESTION_TRANSITION: 2000,
      ANSWER_PROCESSING: 3000,
      SESSION_RESUME: 1000
    }
  },

  // Resume processing configuration
  RESUME: {
    SUPPORTED_FORMATS: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    REQUIRED_FIELDS: ['name', 'email', 'phone'],
    OPTIONAL_FIELDS: ['skills', 'experience', 'education', 'summary', 'location'],

    // Field extraction confidence thresholds
    EXTRACTION_CONFIDENCE: {
      HIGH: 0.8,
      MEDIUM: 0.6,
      LOW: 0.4
    }
  },

  // AI Service configuration
  AI_SERVICE: {
    // API endpoints (would be environment variables in production)
    ENDPOINTS: {
      GENERATE_QUESTION: '/api/generate-question',
      EVALUATE_ANSWER: '/api/evaluate-answer',
      GENERATE_SUMMARY: '/api/generate-summary'
    },

    // Model configurations
    MODELS: {
      QUESTION_GENERATION: 'gpt-3.5-turbo',
      ANSWER_EVALUATION: 'gpt-4',
      SUMMARY_GENERATION: 'gpt-3.5-turbo'
    },

    // Temperature settings for different tasks
    TEMPERATURE: {
      QUESTION_GENERATION: 0.7,
      ANSWER_EVALUATION: 0.3,
      SUMMARY_GENERATION: 0.5
    },

    // Maximum tokens for responses
    MAX_TOKENS: {
      QUESTION: 500,
      EVALUATION: 800,
      SUMMARY: 300
    }
  },

  // Storage configuration
  STORAGE: {
    // Local storage keys
    KEYS: {
      CANDIDATES: 'crisp_interview_candidates',
      CURRENT_SESSION: 'crisp_interview_current_session',
      RESUME_DATA: 'crisp_interview_resume_data',
      APP_SETTINGS: 'crisp_interview_settings'
    },

    // IndexedDB configuration
    INDEXED_DB: {
      NAME: 'CrispInterviewDB',
      VERSION: 1,
      STORES: {
        CANDIDATES: 'candidates',
        INTERVIEWS: 'interviews',
        RESUMES: 'resumes',
        SETTINGS: 'settings'
      }
    },

    // Data retention policies (in days)
    RETENTION: {
      CANDIDATES: 365, // 1 year
      INTERVIEW_SESSIONS: 30, // 30 days
      RESUME_FILES: 7 // 7 days
    }
  },

  // UI Configuration
  UI: {
    // Theme configuration
    THEME: {
      PRIMARY_COLORS: {
        MAIN: '#3B82F6',
        LIGHT: '#60A5FA',
        DARK: '#1D4ED8'
      },
      STATUS_COLORS: {
        SUCCESS: '#10B981',
        WARNING: '#F59E0B',
        ERROR: '#EF4444',
        INFO: '#3B82F6'
      }
    },

    // Animation durations in milliseconds
    ANIMATIONS: {
      SHORT: 200,
      MEDIUM: 500,
      LONG: 1000
    },

    // Responsive breakpoints
    BREAKPOINTS: {
      MOBILE: 640,
      TABLET: 768,
      DESKTOP: 1024,
      LARGE_DESKTOP: 1280
    }
  },

  // Validation rules
  VALIDATION: {
    EMAIL: {
      REGEX: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      MAX_LENGTH: 254
    },
    PHONE: {
      REGEX: /^[\+]?[1-9][\d]{0,15}$/,
      MIN_LENGTH: 10,
      MAX_LENGTH: 15
    },
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 100,
      REGEX: /^[a-zA-Z\s\-'\u00C0-\u024F\u1E00-\u1EFF]+$/
    },
    ANSWER: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 5000
    }
  },

  // Feature flags
  FEATURES: {
    ENABLE_AI_EVALUATION: true,
    ENABLE_RESUME_PARSING: true,
    ENABLE_SESSION_PERSISTENCE: true,
    ENABLE_PROGRESS_SAVING: true,
    ENABLE_EXPORT_RESULTS: true,
    ENABLE_MULTIPLE_CANDIDATES: true
  },

  // Environment-specific configurations
  ENVIRONMENT: {
    DEVELOPMENT: {
      LOG_LEVEL: 'debug',
      ENABLE_MOCK_DATA: true,
      API_BASE_URL: 'http://localhost:3001/api'
    },
    PRODUCTION: {
      LOG_LEVEL: 'error',
      ENABLE_MOCK_DATA: false,
      API_BASE_URL: 'https://api.crisp-interview.com/v1'
    },
    TEST: {
      LOG_LEVEL: 'silent',
      ENABLE_MOCK_DATA: true,
      API_BASE_URL: 'http://localhost:3001/api'
    }
  }
};

// Export individual constants for easier access
export const TOTAL_QUESTIONS = INTERVIEW_CONFIG.STRUCTURE.TOTAL_QUESTIONS;
export const QUESTION_TIME_LIMITS = INTERVIEW_CONFIG.TIMING.QUESTION_TIME_LIMITS;
export const SCORING_THRESHOLDS = INTERVIEW_CONFIG.SCORING.THRESHOLDS;
export const REQUIRED_RESUME_FIELDS = INTERVIEW_CONFIG.RESUME.REQUIRED_FIELDS;
export const SUPPORTED_FILE_FORMATS = INTERVIEW_CONFIG.RESUME.SUPPORTED_FORMATS;

// Helper functions
export const getTimeLimitForDifficulty = (difficulty) => {
  const upperCaseDifficulty = difficulty?.toUpperCase();
  return QUESTION_TIME_LIMITS[upperCaseDifficulty] || QUESTION_TIME_LIMITS.EASY;
};

export const getDifficultyForIndex = (index) => {
  const sequence = INTERVIEW_CONFIG.STRUCTURE.DIFFICULTY_SEQUENCE;
  return sequence[index] || 'easy';
};

export const getQuestionNumberDisplay = (index) => {
  return `Question ${index + 1} of ${TOTAL_QUESTIONS}`;
};

export const isLastQuestion = (index) => {
  return index === TOTAL_QUESTIONS - 1;
};

export const calculateTotalInterviewTime = () => {
  const { EASY, MEDIUM, HARD } = QUESTION_TIME_LIMITS;
  return (EASY * 2) + (MEDIUM * 2) + (HARD * 2);
};

export const getScoreLevel = (score) => {
  const { EXCELLENT, GOOD, FAIR } = SCORING_THRESHOLDS;
  
  if (score >= EXCELLENT) return 'excellent';
  if (score >= GOOD) return 'good';
  if (score >= FAIR) return 'fair';
  return 'poor';
};

export const getScoreColor = (score) => {
  const level = getScoreLevel(score);
  const colors = INTERVIEW_CONFIG.UI.STATUS_COLORS;
  
  switch (level) {
    case 'excellent': return colors.SUCCESS;
    case 'good': return colors.WARNING;
    case 'fair': return colors.ERROR;
    case 'poor': return colors.ERROR;
    default: return colors.INFO;
  }
};

export default INTERVIEW_CONFIG;