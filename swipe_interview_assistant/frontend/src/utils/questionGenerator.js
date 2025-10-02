// Question Generator Utility for creating technical interview questions
class QuestionGenerator {
  constructor() {
    this.questionTemplates = this.initializeTemplates();
    this.difficultyWeights = {
      easy: { fundamental: 0.6, syntax: 0.3, concept: 0.1 },
      medium: { concept: 0.4, implementation: 0.4, bestPractice: 0.2 },
      hard: { architecture: 0.5, optimization: 0.3, systemDesign: 0.2 }
    };
  }

  // Initialize question templates with real technical content
  initializeTemplates() {
    return {
      // React Questions
      react: {
        fundamental: [
          {
            template: "What are React components and how do they differ from traditional HTML elements?",
            points: ['Reusability', 'State management', 'Lifecycle', 'JSX syntax'],
            category: 'react-basics'
          },
          {
            template: "Explain the concept of the Virtual DOM and how it improves performance in React applications.",
            points: ['DOM manipulation cost', 'Diffing algorithm', 'Batch updates', 'Reconciliation'],
            category: 'react-performance'
          }
        ],
        hooks: [
          {
            template: "Compare useState and useEffect hooks with their class component equivalents.",
            points: ['State management', 'Lifecycle methods', 'Side effects', 'Dependency arrays'],
            category: 'react-hooks'
          },
          {
            template: "When would you use useCallback and useMemo hooks? Provide practical examples.",
            points: ['Performance optimization', 'Memoization', 'Dependency management', 'Use cases'],
            category: 'react-optimization'
          }
        ],
        advanced: [
          {
            template: "How does React's Context API work and when should it be used over prop drilling?",
            points: ['Provider/Consumer pattern', 'Performance considerations', 'Use cases', 'Alternatives'],
            category: 'react-state'
          },
          {
            template: "Explain React's fiber architecture and how it enables features like concurrent rendering.",
            points: ['Reconciliation process', 'Time slicing', 'Priority levels', 'Suspense'],
            category: 'react-architecture'
          }
        ]
      },

      // JavaScript Questions
      javascript: {
        fundamental: [
          {
            template: "Explain the difference between let, const, and var in JavaScript with examples.",
            points: ['Scope', 'Hoisting', 'Reassignment', 'Temporal dead zone'],
            category: 'js-basics'
          },
          {
            template: "What are closures in JavaScript and provide a practical use case?",
            points: ['Lexical scope', 'Function factories', 'Data privacy', 'Common patterns'],
            category: 'js-closures'
          }
        ],
        asynchronous: [
          {
            template: "Compare callbacks, promises, and async/await for handling asynchronous operations.",
            points: ['Error handling', 'Readability', 'Chaining', 'Browser support'],
            category: 'js-async'
          },
          {
            template: "Explain the JavaScript event loop and how it handles asynchronous code execution.",
            points: ['Call stack', 'Task queue', 'Microtasks', 'Execution order'],
            category: 'js-event-loop'
          }
        ],
        advanced: [
          {
            template: "What are JavaScript prototypes and how do they enable inheritance?",
            points: ['Prototype chain', 'Constructor functions', 'ES6 classes', 'Method lookup'],
            category: 'js-oop'
          },
          {
            template: "Explain memory management in JavaScript and common memory leak patterns.",
            points: ['Garbage collection', 'Reference types', 'Common leaks', 'Debugging tools'],
            category: 'js-memory'
          }
        ]
      },

      // Node.js Questions
      nodejs: {
        fundamental: [
          {
            template: "How does Node.js handle concurrent requests with a single-threaded event loop?",
            points: ['Non-blocking I/O', 'Libuv', 'Worker threads', 'Scalability'],
            category: 'node-basics'
          },
          {
            template: "What is the difference between require and import in Node.js modules?",
            points: ['CommonJS vs ES6', 'Synchronous vs asynchronous', 'Tree shaking', 'Migration'],
            category: 'node-modules'
          }
        ],
        backend: [
          {
            template: "How would you structure a RESTful API in Express.js with proper error handling?",
            points: ['Route organization', 'Middleware', 'Error handling', 'Status codes'],
            category: 'node-express'
          },
          {
            template: "Explain middleware in Express.js and create a custom authentication middleware.",
            points: ['Request pipeline', 'Next function', 'Error middleware', 'Use cases'],
            category: 'node-middleware'
          }
        ],
        performance: [
          {
            template: "What strategies would you use to optimize Node.js application performance?",
            points: ['Caching', 'Cluster module', 'Stream processing', 'Memory management'],
            category: 'node-optimization'
          },
          {
            template: "How do you handle file uploads efficiently in a Node.js application?",
            points: ['Stream processing', 'Memory usage', 'Security considerations', 'Cloud storage'],
            category: 'node-file-upload'
          }
        ]
      },

      // System Design Questions
      systemDesign: {
        architecture: [
          {
            template: "Design a URL shortening service like TinyURL. Discuss the architecture and data model.",
            points: ['Hash generation', 'Database design', 'Scalability', 'Cache strategy'],
            category: 'system-design'
          },
          {
            template: "How would you design a real-time collaborative editing system like Google Docs?",
            points: ['Operational transforms', 'Conflict resolution', 'Real-time sync', 'Scalability'],
            category: 'realtime-system'
          }
        ],
        scalability: [
          {
            template: "What factors would you consider when choosing between microservices and monolith architecture?",
            points: ['Team size', 'Complexity', 'Deployment', 'Monitoring'],
            category: 'architecture'
          },
          {
            template: "Explain database indexing and how it improves query performance.",
            points: ['B-tree structure', 'Query optimization', 'Trade-offs', 'Index types'],
            category: 'database'
          }
        ]
      }
    };
  }

  // Generate a question based on difficulty and category
  generateQuestion(index, difficulty, category = 'auto') {
    const actualCategory = category === 'auto' ? this.selectCategory(difficulty) : category;
    const topic = this.selectTopic(actualCategory, difficulty);
    const template = this.selectTemplate(actualCategory, topic, difficulty);

    if (!template) {
      return this.getFallbackQuestion(index, difficulty);
    }

    return {
      id: `q_${index}_${Date.now()}`,
      text: this.customizeQuestion(template.template, difficulty),
      difficulty,
      index,
      category: template.category,
      type: this.getQuestionType(difficulty),
      expectedAnswerPoints: template.points,
      timeLimit: this.getTimeLimit(difficulty),
      evaluationCriteria: this.getEvaluationCriteria(difficulty)
    };
  }

  // Select appropriate category based on difficulty
  selectCategory(difficulty) {
    const categoryWeights = {
      easy: { react: 0.4, javascript: 0.4, nodejs: 0.2 },
      medium: { react: 0.3, javascript: 0.3, nodejs: 0.3, systemDesign: 0.1 },
      hard: { react: 0.2, javascript: 0.2, nodejs: 0.2, systemDesign: 0.4 }
    };

    const weights = categoryWeights[difficulty] || categoryWeights.easy;
    const random = Math.random();
    let cumulative = 0;

    for (const [category, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (random <= cumulative) {
        return category;
      }
    }

    return 'javascript';
  }

  // Select topic within category based on difficulty
  selectTopic(category, difficulty) {
    const topics = Object.keys(this.questionTemplates[category] || {});
    const difficultyMap = {
      easy: ['fundamental'],
      medium: ['fundamental', 'hooks', 'asynchronous', 'backend'],
      hard: ['advanced', 'performance', 'architecture', 'scalability']
    };

    const availableTopics = topics.filter(topic => 
      difficultyMap[difficulty]?.includes(topic)
    );

    return availableTopics.length > 0 
      ? availableTopics[Math.floor(Math.random() * availableTopics.length)]
      : topics[0];
  }

  // Select specific template
  selectTemplate(category, topic, difficulty) {
    const templates = this.questionTemplates[category]?.[topic];
    if (!templates || templates.length === 0) {
      return null;
    }

    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Customize question based on difficulty
  customizeQuestion(template, difficulty) {
    const customizations = {
      easy: {
        prefixes: ["Explain", "What is", "Describe"],
        specificity: "basic"
      },
      medium: {
        prefixes: ["Compare", "How would you", "Discuss"],
        specificity: "detailed"
      },
      hard: {
        prefixes: ["Design", "Architect", "Optimize"],
        specificity: "comprehensive"
      }
    };

    const customization = customizations[difficulty] || customizations.easy;
    
    // Ensure the question starts with an appropriate prefix
    const firstWord = template.split(' ')[0];
    if (!customization.prefixes.some(prefix => firstWord.toLowerCase().includes(prefix.toLowerCase()))) {
      const prefix = customization.prefixes[Math.floor(Math.random() * customization.prefixes.length)];
      return `${prefix} ${template.toLowerCase()}`;
    }

    return template;
  }

  // Get time limit based on difficulty
  getTimeLimit(difficulty) {
    const limits = {
      easy: 20,    // 20 seconds for fundamental questions
      medium: 60,  // 1 minute for implementation questions
      hard: 120    // 2 minutes for complex problems
    };
    return limits[difficulty] || 60;
  }

  // Get question type based on difficulty
  getQuestionType(difficulty) {
    const types = {
      easy: 'fundamental',
      medium: 'implementation',
      hard: 'design'
    };
    return types[difficulty] || 'technical';
  }

  // Get evaluation criteria for scoring
  getEvaluationCriteria(difficulty) {
    const criteria = {
      easy: {
        technicalAccuracy: 0.4,
        completeness: 0.3,
        clarity: 0.2,
        examples: 0.1
      },
      medium: {
        technicalAccuracy: 0.3,
        problemSolving: 0.3,
        bestPractices: 0.2,
        examples: 0.2
      },
      hard: {
        architecture: 0.3,
        scalability: 0.3,
        tradeOffs: 0.2,
        innovation: 0.2
      }
    };
    return criteria[difficulty] || criteria.easy;
  }

  // Fallback question generator
  getFallbackQuestion(index, difficulty) {
    const fallbacks = {
      easy: "Explain the concept of component-based architecture in modern web development.",
      medium: "How would you implement state management in a medium-sized React application?",
      hard: "Design a scalable notification system for a social media application."
    };

    return {
      id: `fallback_${index}_${Date.now()}`,
      text: fallbacks[difficulty] || fallbacks.easy,
      difficulty,
      index,
      category: 'general',
      type: 'technical',
      expectedAnswerPoints: ['Technical accuracy', 'Completeness', 'Clarity'],
      timeLimit: this.getTimeLimit(difficulty),
      evaluationCriteria: this.getEvaluationCriteria(difficulty)
    };
  }

  // Generate a sequence of questions for complete interview
  generateInterviewQuestions() {
    const questions = [];
    
    // 2 easy questions
    for (let i = 0; i < 2; i++) {
      questions.push(this.generateQuestion(i, 'easy'));
    }
    
    // 2 medium questions
    for (let i = 2; i < 4; i++) {
      questions.push(this.generateQuestion(i, 'medium'));
    }
    
    // 2 hard questions
    for (let i = 4; i < 6; i++) {
      questions.push(this.generateQuestion(i, 'hard'));
    }

    return questions;
  }

  // Validate question parameters
  validateQuestionParams(difficulty, category) {
    const validDifficulties = ['easy', 'medium', 'hard'];
    const validCategories = ['auto', 'react', 'javascript', 'nodejs', 'systemDesign'];

    if (!validDifficulties.includes(difficulty)) {
      throw new Error(`Invalid difficulty: ${difficulty}. Must be one of: ${validDifficulties.join(', ')}`);
    }

    if (!validCategories.includes(category)) {
      throw new Error(`Invalid category: ${category}. Must be one of: ${validCategories.join(', ')}`);
    }

    return true;
  }

  // Get available categories for difficulty
  getAvailableCategories(difficulty) {
    const allCategories = Object.keys(this.questionTemplates);
    
    if (difficulty === 'easy') {
      return allCategories.filter(cat => cat !== 'systemDesign');
    }
    
    return allCategories;
  }

  // Get question statistics
  getQuestionStats() {
    let totalQuestions = 0;
    const stats = {};

    Object.entries(this.questionTemplates).forEach(([category, topics]) => {
      stats[category] = {};
      Object.entries(topics).forEach(([topic, questions]) => {
        stats[category][topic] = questions.length;
        totalQuestions += questions.length;
      });
    });

    return {
      totalQuestions,
      byCategory: stats,
      difficulties: ['easy', 'medium', 'hard']
    };
  }
}

// Create and export singleton instance
const questionGenerator = new QuestionGenerator();
export default questionGenerator;

// Export individual functions
export const generateQuestion = (index, difficulty, category = 'auto') =>  questionGenerator.generateQuestion(index, difficulty, category);

export const generateInterviewQuestions = () => questionGenerator.generateInterviewQuestions();

export const validateQuestionParams = (difficulty, category) => questionGenerator.validateQuestionParams(difficulty, category);

export const getQuestionStats = () => questionGenerator.getQuestionStats();