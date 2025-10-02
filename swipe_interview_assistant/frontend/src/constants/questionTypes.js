// Question Types and Categories Configuration
export const QUESTION_TYPES = {
  // Technical question types
  TECHNICAL: {
    key: 'technical',
    label: 'Technical',
    description: 'Questions about programming concepts, syntax, and implementation',
    icon: '💻',
    categories: {
      REACT: {
        key: 'react',
        label: 'React',
        description: 'React.js library questions including hooks, components, and state management',
        difficultyLevels: {
          EASY: [
            'Component basics',
            'JSX syntax',
            'Props and state',
            'Event handling'
          ],
          MEDIUM: [
            'Hooks usage',
            'Context API',
            'Performance optimization',
            'Component lifecycle'
          ],
          HARD: [
            'Advanced patterns',
            'Custom hooks',
            'Concurrent features',
            'Fiber architecture'
          ]
        }
      },
      JAVASCRIPT: {
        key: 'javascript',
        label: 'JavaScript',
        description: 'Core JavaScript concepts including ES6+ features and runtime behavior',
        difficultyLevels: {
          EASY: [
            'Variables and data types',
            'Functions and scope',
            'Array methods',
            'Object manipulation'
          ],
          MEDIUM: [
            'Closures',
            'Prototypes and inheritance',
            'Async programming',
            'ES6+ features'
          ],
          HARD: [
            'Event loop',
            'Memory management',
            'Advanced patterns',
            'Performance optimization'
          ]
        }
      },
      NODEJS: {
        key: 'nodejs',
        label: 'Node.js',
        description: 'Server-side JavaScript runtime and backend development concepts',
        difficultyLevels: {
          EASY: [
            'Module system',
            'Basic server setup',
            'NPM usage',
            'File system operations'
          ],
          MEDIUM: [
            'Event-driven architecture',
            'Streams and buffers',
            'Middleware concepts',
            'Error handling'
          ],
          HARD: [
            'Cluster module',
            'Performance tuning',
            'Security best practices',
            'Microservices architecture'
          ]
        }
      },
      HTML_CSS: {
        key: 'html-css',
        label: 'HTML & CSS',
        description: 'Web markup, styling, and responsive design principles',
        difficultyLevels: {
          EASY: [
            'HTML semantics',
            'Basic CSS styling',
            'Box model',
            'Positioning'
          ],
          MEDIUM: [
            'Flexbox and Grid',
            'Responsive design',
            'CSS preprocessors',
            'Accessibility'
          ],
          HARD: [
            'CSS architecture',
            'Performance optimization',
            'Advanced animations',
            'Cross-browser compatibility'
          ]
        }
      },
      DATABASE: {
        key: 'database',
        label: 'Database',
        description: 'Database design, querying, and optimization techniques',
        difficultyLevels: {
          EASY: [
            'Basic SQL queries',
            'Database normalization',
            'CRUD operations',
            'Data types'
          ],
          MEDIUM: [
            'Joins and relationships',
            'Indexing strategies',
            'Transaction management',
            'NoSQL concepts'
          ],
          HARD: [
            'Query optimization',
            'Database scaling',
            'Data modeling',
            'Distributed databases'
          ]
        }
      }
    }
  },

  // System design question types
  SYSTEM_DESIGN: {
    key: 'system-design',
    label: 'System Design',
    description: 'Architectural questions about designing scalable systems',
    icon: '🏗️',
    categories: {
      ARCHITECTURE: {
        key: 'architecture',
        label: 'System Architecture',
        description: 'High-level system design and architectural patterns',
        difficultyLevels: {
          EASY: [
            'Basic client-server model',
            'REST API design',
            'Database selection'
          ],
          MEDIUM: [
            'Microservices vs monolith',
            'Caching strategies',
            'Load balancing'
          ],
          HARD: [
            'Distributed systems',
            'Event-driven architecture',
            'System scalability'
          ]
        }
      },
      SCALABILITY: {
        key: 'scalability',
        label: 'Scalability',
        description: 'Questions about handling growth and performance at scale',
        difficultyLevels: {
          EASY: [
            'Vertical vs horizontal scaling',
            'Basic performance concepts'
          ],
          MEDIUM: [
            'Database scaling strategies',
            'Caching implementations',
            'CDN usage'
          ],
          HARD: [
            'Sharding strategies',
            'Global distribution',
            'Performance optimization at scale'
          ]
        }
      }
    }
  },

  // Behavioral question types
  BEHAVIORAL: {
    key: 'behavioral',
    label: 'Behavioral',
    description: 'Questions about teamwork, problem-solving approaches, and experience',
    icon: '👥',
    categories: {
      TEAMWORK: {
        key: 'teamwork',
        label: 'Teamwork & Collaboration',
        description: 'Questions about working in teams and collaborative environments',
        difficultyLevels: {
          EASY: [
            'Communication skills',
            'Basic conflict resolution',
            'Team contribution'
          ],
          MEDIUM: [
            'Leadership experiences',
            'Complex team dynamics',
            'Project coordination'
          ],
          HARD: [
            'Organizational influence',
            'Strategic collaboration',
            'Cross-functional leadership'
          ]
        }
      },
      PROBLEM_SOLVING: {
        key: 'problem-solving',
        label: 'Problem Solving',
        description: 'Questions about approach to challenges and decision making',
        difficultyLevels: {
          EASY: [
            'Basic troubleshooting',
            'Simple decision making',
            'Learning from mistakes'
          ],
          MEDIUM: [
            'Complex problem analysis',
            'Risk assessment',
            'Innovative solutions'
          ],
          HARD: [
            'Strategic thinking',
            'Crisis management',
            'Long-term impact analysis'
          ]
        }
      }
    }
  }
};

// Question templates for different difficulties
export const QUESTION_TEMPLATES = {
  EASY: {
    TECHNICAL: [
      "Explain the concept of {concept} in {technology}.",
      "What is the difference between {conceptA} and {conceptB} in {technology}?",
      "How would you implement a basic {feature} in {technology}?",
      "Describe the purpose of {concept} with a simple example."
    ],
    SYSTEM_DESIGN: [
      "What factors would you consider when designing a {systemType} system?",
      "Explain the basic architecture of a {systemType} application."
    ],
    BEHAVIORAL: [
      "Tell me about a time when you {situation}.",
      "How do you approach {commonScenario} in your work?"
    ]
  },
  MEDIUM: {
    TECHNICAL: [
      "Compare {approachA} and {approachB} for implementing {feature} in {technology}.",
      "How would you optimize {aspect} in a {technology} application?",
      "What are the best practices for handling {scenario} in {technology}?",
      "Implement a solution for {problem} using {technology}."
    ],
    SYSTEM_DESIGN: [
      "Design a {systemType} system that can handle {requirement}.",
      "How would you scale a {systemType} system to handle increased load?"
    ],
    BEHAVIORAL: [
      "Describe a challenging situation where you had to {action} and what you learned.",
      "How do you handle conflicting priorities when working on multiple projects?"
    ]
  },
  HARD: {
    TECHNICAL: [
      "Design and implement a {complexFeature} considering scalability and performance.",
      "What architectural patterns would you use for a large-scale {systemType} and why?",
      "How would you refactor an existing {system} to improve {aspect}?",
      "Discuss the trade-offs between different approaches for solving {complexProblem}."
    ],
    SYSTEM_DESIGN: [
      "Architect a globally distributed {systemType} system with considerations for latency and data consistency.",
      "Design a system that needs to process {largeScaleData} while maintaining {requirements}."
    ],
    BEHAVIORAL: [
      "Describe a situation where you had to make a difficult technical decision that impacted the entire team.",
      "How do you approach mentoring junior developers while maintaining project deadlines?"
    ]
  }
};

// Evaluation criteria for different question types
export const EVALUATION_CRITERIA = {
  TECHNICAL: {
    ACCURACY: {
      weight: 0.4,
      description: 'Technical correctness and understanding of concepts'
    },
    COMPLETENESS: {
      weight: 0.25,
      description: 'Thoroughness in addressing all aspects of the question'
    },
    CLARITY: {
      weight: 0.15,
      description: 'Clear and organized explanation'
    },
    EXAMPLES: {
      weight: 0.1,
      description: 'Use of relevant examples and practical applications'
    },
    BEST_PRACTICES: {
      weight: 0.1,
      description: 'Adherence to coding standards and best practices'
    }
  },
  SYSTEM_DESIGN: {
    ARCHITECTURE: {
      weight: 0.3,
      description: 'Appropriate architectural choices and patterns'
    },
    SCALABILITY: {
      weight: 0.25,
      description: 'Consideration of scalability and performance'
    },
    TRADE_OFFS: {
      weight: 0.2,
      description: 'Analysis of trade-offs between different approaches'
    },
    COMPLETENESS: {
      weight: 0.15,
      description: 'Comprehensive coverage of system components'
    },
    INNOVATION: {
      weight: 0.1,
      description: 'Creative and innovative solutions'
    }
  },
  BEHAVIORAL: {
    STRUCTURE: {
      weight: 0.3,
      description: 'Clear structure (STAR method)'
    },
    RELEVANCE: {
      weight: 0.25,
      description: 'Relevance of examples to the question'
    },
    LEARNING: {
      weight: 0.2,
      description: 'Demonstrated learning and growth'
    },
    IMPACT: {
      weight: 0.15,
      description: 'Impact of actions and decisions'
    },
    SELF_AWARENESS: {
      weight: 0.1,
      description: 'Self-awareness and reflection'
    }
  }
};

// Expected answer characteristics
export const EXPECTED_ANSWER_CHARACTERISTICS = {
  EASY: {
    minLength: 50,
    maxLength: 300,
    expectedConcepts: 2,
    shouldIncludeExamples: true,
    timeToThink: 5 // seconds
  },
  MEDIUM: {
    minLength: 100,
    maxLength: 500,
    expectedConcepts: 3,
    shouldIncludeExamples: true,
    shouldIncludeCode: true,
    timeToThink: 10 // seconds
  },
  HARD: {
    minLength: 150,
    maxLength: 800,
    expectedConcepts: 4,
    shouldIncludeExamples: true,
    shouldIncludeCode: true,
    shouldDiscussTradeoffs: true,
    timeToThink: 15 // seconds
  }
};

// Helper functions
export const getQuestionTypeConfig = (typeKey) => {
  return QUESTION_TYPES[typeKey] || QUESTION_TYPES.TECHNICAL;
};

export const getCategoryConfig = (typeKey, categoryKey) => {
  const typeConfig = getQuestionTypeConfig(typeKey);
  return typeConfig.categories[categoryKey] || Object.values(typeConfig.categories)[0];
};

export const getDifficultyTopics = (typeKey, categoryKey, difficulty) => {
  const categoryConfig = getCategoryConfig(typeKey, categoryKey);
  const upperCaseDifficulty = difficulty?.toUpperCase();
  return categoryConfig.difficultyLevels[upperCaseDifficulty] || [];
};

export const getEvaluationWeights = (questionType) => {
  return EVALUATION_CRITERIA[questionType] || EVALUATION_CRITERIA.TECHNICAL;
};

export const getExpectedAnswerConfig = (difficulty) => {
  const upperCaseDifficulty = difficulty?.toUpperCase();
  return EXPECTED_ANSWER_CHARACTERISTICS[upperCaseDifficulty] || EXPECTED_ANSWER_CHARACTERISTICS.EASY;
};

export const getAllQuestionTypes = () => {
  return Object.values(QUESTION_TYPES).map(type => ({
    key: type.key,
    label: type.label,
    description: type.description,
    icon: type.icon
  }));
};

export const getCategoriesForType = (typeKey) => {
  const typeConfig = getQuestionTypeConfig(typeKey);
  return Object.values(typeConfig.categories).map(category => ({
    key: category.key,
    label: category.label,
    description: category.description
  }));
};

export const isTechnicalQuestion = (questionType) => {
  return questionType === QUESTION_TYPES.TECHNICAL.key;
};

export const isSystemDesignQuestion = (questionType) => {
  return questionType === QUESTION_TYPES.SYSTEM_DESIGN.key;
};

export const isBehavioralQuestion = (questionType) => {
  return questionType === QUESTION_TYPES.BEHAVIORAL.key;
};

export default QUESTION_TYPES;