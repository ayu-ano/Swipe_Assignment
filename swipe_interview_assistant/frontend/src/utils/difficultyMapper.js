// Difficulty Mapper for interview question management
class DifficultyMapper {
  constructor() {
    this.difficultyConfig = this.initializeDifficultyConfig();
    this.progression = this.initializeProgression();
    this.scoring = this.initializeScoring();
  }

  // Initialize difficulty configuration
  initializeDifficultyConfig() {
    return {
      easy: {
        level: 1,
        label: 'Easy',
        description: 'Fundamental concepts and basic syntax',
        timeLimit: 20, // seconds
        expectedAnswerLength: 50, // words
        technicalDepth: 'basic',
        questionTypes: ['definition', 'syntax', 'basic-concept'],
        color: '#10B981', // green
        icon: '🟢'
      },
      medium: {
        level: 2,
        label: 'Medium',
        description: 'Practical implementation and problem-solving',
        timeLimit: 60, // seconds
        expectedAnswerLength: 100, // words
        technicalDepth: 'intermediate',
        questionTypes: ['implementation', 'comparison', 'troubleshooting'],
        color: '#F59E0B', // amber
        icon: '🟡'
      },
      hard: {
        level: 3,
        label: 'Hard',
        description: 'Advanced concepts, architecture, and system design',
        timeLimit: 120, // seconds
        expectedAnswerLength: 150, // words
        technicalDepth: 'advanced',
        questionTypes: ['architecture', 'optimization', 'system-design'],
        color: '#EF4444', // red
        icon: '🔴'
      }
    };
  }

  // Initialize question progression
  initializeProgression() {
    return {
      totalQuestions: 6,
      sequence: [
        { index: 0, difficulty: 'easy', stage: 'warmup' },
        { index: 1, difficulty: 'easy', stage: 'foundation' },
        { index: 2, difficulty: 'medium', stage: 'application' },
        { index: 3, difficulty: 'medium', stage: 'problem-solving' },
        { index: 4, difficulty: 'hard', stage: 'advanced' },
        { index: 5, difficulty: 'hard', stage: 'expert' }
      ],
      transitions: {
        'easy-to-medium': { threshold: 2, requiredScore: 60 },
        'medium-to-hard': { threshold: 4, requiredScore: 65 }
      }
    };
  }

  // Initialize scoring configuration
  initializeScoring() {
    return {
      baseScores: {
        easy: { min: 40, max: 90 },
        medium: { min: 30, max: 85 },
        hard: { min: 20, max: 80 }
      },
      weightMultipliers: {
        easy: 1.0,
        medium: 1.2,
        hard: 1.5
      },
      evaluationCriteria: {
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
      }
    };
  }

  // Get difficulty for question index
  getDifficultyForIndex(index) {
    const question = this.progression.sequence.find(q => q.index === index);
    return question ? question.difficulty : 'easy';
  }

  // Get stage for question index
  getStageForIndex(index) {
    const question = this.progression.sequence.find(q => q.index === index);
    return question ? question.stage : 'warmup';
  }

  // Get question number display (e.g., "Question 1 of 6 - Easy")
  getQuestionDisplay(index) {
    const difficulty = this.getDifficultyForIndex(index);
    const config = this.difficultyConfig[difficulty];
    
    return {
      number: `Question ${index + 1} of ${this.progression.totalQuestions}`,
      difficulty: config.label,
      stage: this.getStageForIndex(index),
      color: config.color,
      icon: config.icon
    };
  }

  // Get time limit for question index
  getTimeLimitForIndex(index) {
    const difficulty = this.getDifficultyForIndex(index);
    return this.difficultyConfig[difficulty].timeLimit;
  }

  // Get expected answer length for difficulty
  getExpectedAnswerLength(difficulty) {
    return this.difficultyConfig[difficulty]?.expectedAnswerLength || 50;
  }

  // Check if should progress to next difficulty
  shouldProgressToNextDifficulty(currentIndex, previousScores) {
    if (currentIndex >= this.progression.totalQuestions - 1) {
      return false; // Last question
    }

    const currentDifficulty = this.getDifficultyForIndex(currentIndex);
    const nextDifficulty = this.getDifficultyForIndex(currentIndex + 1);

    // Only check progression when moving between difficulty levels
    if (currentDifficulty === nextDifficulty) {
      return true;
    }

    const transitionKey = `${currentDifficulty}-to-${nextDifficulty}`;
    const transition = this.progression.transitions[transitionKey];

    if (!transition) {
      return true;
    }

    // Check if we've reached the threshold question
    if (currentIndex + 1 < transition.threshold) {
      return false;
    }

    // Calculate average score for current difficulty
    const currentDifficultyScores = previousScores
      .filter((score, idx) => this.getDifficultyForIndex(idx) === currentDifficulty)
      .map(score => score || 0);

    if (currentDifficultyScores.length === 0) {
      return true; // No scores yet, allow progression
    }

    const averageScore = currentDifficultyScores.reduce((sum, score) => sum + score, 0) / currentDifficultyScores.length;

    return averageScore >= transition.requiredScore;
  }

  // Calculate weighted score
  calculateWeightedScore(rawScore, difficulty) {
    const multiplier = this.scoring.weightMultipliers[difficulty] || 1.0;
    const baseRange = this.scoring.baseScores[difficulty];
    
    if (!baseRange) {
      return rawScore;
    }

    // Normalize score within base range, then apply multiplier
    const normalized = ((rawScore - baseRange.min) / (baseRange.max - baseRange.min)) * 100;
    const weighted = normalized * multiplier;

    return Math.max(0, Math.min(100, weighted));
  }

  // Get evaluation criteria for difficulty
  getEvaluationCriteria(difficulty) {
    return this.scoring.evaluationCriteria[difficulty] || this.scoring.evaluationCriteria.easy;
  }

  // Get difficulty level from numeric value
  getDifficultyFromLevel(level) {
    const difficulties = Object.entries(this.difficultyConfig);
    const match = difficulties.find(([_, config]) => config.level === level);
    return match ? match[0] : 'easy';
  }

  // Get next difficulty in progression
  getNextDifficulty(currentDifficulty) {
    const difficulties = ['easy', 'medium', 'hard'];
    const currentIndex = difficulties.indexOf(currentDifficulty);
    
    if (currentIndex === -1 || currentIndex === difficulties.length - 1) {
      return currentDifficulty;
    }

    return difficulties[currentIndex + 1];
  }

  // Get previous difficulty in progression
  getPreviousDifficulty(currentDifficulty) {
    const difficulties = ['easy', 'medium', 'hard'];
    const currentIndex = difficulties.indexOf(currentDifficulty);
    
    if (currentIndex <= 0) {
      return currentDifficulty;
    }

    return difficulties[currentIndex - 1];
  }

  // Calculate overall interview difficulty based on scores
  calculateOverallDifficulty(scores) {
    if (!scores || scores.length === 0) {
      return 'easy';
    }

    const difficultyScores = {};
    let totalWeightedScore = 0;
    let totalWeight = 0;

    scores.forEach((score, index) => {
      const difficulty = this.getDifficultyForIndex(index);
      const weight = this.scoring.weightMultipliers[difficulty];
      
      if (!difficultyScores[difficulty]) {
        difficultyScores[difficulty] = [];
      }
      
      difficultyScores[difficulty].push(score);
      totalWeightedScore += score * weight;
      totalWeight += weight;
    });

    const overallScore = totalWeightedScore / totalWeight;

    if (overallScore >= 80) return 'hard';
    if (overallScore >= 60) return 'medium';
    return 'easy';
  }

  // Get difficulty recommendations based on performance
  getDifficultyRecommendations(scores) {
    const recommendations = [];
    const difficultyPerformance = {};

    // Calculate performance by difficulty
    Object.keys(this.difficultyConfig).forEach(difficulty => {
      const difficultyScores = scores
        .map((score, index) => ({ score, difficulty: this.getDifficultyForIndex(index) }))
        .filter(item => item.difficulty === difficulty)
        .map(item => item.score);

      if (difficultyScores.length > 0) {
        const average = difficultyScores.reduce((sum, score) => sum + score, 0) / difficultyScores.length;
        difficultyPerformance[difficulty] = average;
      }
    });

    // Generate recommendations
    if (difficultyPerformance.easy !== undefined) {
      if (difficultyPerformance.easy < 60) {
        recommendations.push({
          type: 'improvement',
          difficulty: 'easy',
          message: 'Focus on fundamental concepts and basic syntax',
          priority: 'high'
        });
      } else if (difficultyPerformance.easy >= 80) {
        recommendations.push({
          type: 'strength',
          difficulty: 'easy',
          message: 'Strong understanding of basic concepts',
          priority: 'low'
        });
      }
    }

    if (difficultyPerformance.medium !== undefined) {
      if (difficultyPerformance.medium < 60) {
        recommendations.push({
          type: 'improvement',
          difficulty: 'medium',
          message: 'Practice problem-solving and implementation skills',
          priority: 'medium'
        });
      }
    }

    if (difficultyPerformance.hard !== undefined) {
      if (difficultyPerformance.hard < 50) {
        recommendations.push({
          type: 'improvement',
          difficulty: 'hard',
          message: 'Work on system design and architectural thinking',
          priority: 'low'
        });
      } else if (difficultyPerformance.hard >= 70) {
        recommendations.push({
          type: 'strength',
          difficulty: 'hard',
          message: 'Excellent advanced problem-solving skills',
          priority: 'low'
        });
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  // Validate difficulty string
  validateDifficulty(difficulty) {
    return Object.keys(this.difficultyConfig).includes(difficulty);
  }

  // Get all difficulties
  getAllDifficulties() {
    return Object.keys(this.difficultyConfig);
  }

  // Get difficulty configuration
  getDifficultyConfig(difficulty) {
    return this.difficultyConfig[difficulty] || this.difficultyConfig.easy;
  }

  // Get progression configuration
  getProgressionConfig() {
    return this.progression;
  }

  // Calculate time pressure score
  calculateTimePressureScore(actualTime, allocatedTime, difficulty) {
    if (allocatedTime <= 0) return 0;

    const timeRatio = actualTime / allocatedTime;
    const config = this.difficultyConfig[difficulty];

    if (!config) return 0;

    // Lower pressure for using less time, higher pressure for using more time
    if (timeRatio <= 0.5) return 90; // Finished very quickly
    if (timeRatio <= 0.8) return 70; // Finished with comfortable time
    if (timeRatio <= 1.0) return 50; // Finished just in time
    if (timeRatio <= 1.2) return 30; // Slightly overtime
    return 10; // Significantly overtime
  }

  // Get difficulty-based feedback templates
  getFeedbackTemplates(difficulty) {
    const templates = {
      easy: {
        excellent: "Excellent understanding of fundamental concepts! Your answer was clear and accurate.",
        good: "Good grasp of basic concepts. Consider providing more specific examples to strengthen your answer.",
        needs_work: "Review the fundamental concepts. Practice explaining them clearly with examples."
      },
      medium: {
        excellent: "Strong problem-solving skills demonstrated! Your approach was logical and well-explained.",
        good: "Good implementation understanding. Work on considering edge cases and alternative approaches.",
        needs_work: "Focus on practical implementation details and problem-solving strategies."
      },
      hard: {
        excellent: "Outstanding architectural thinking! Your solution considers scalability and trade-offs effectively.",
        good: "Good understanding of advanced concepts. Practice designing more comprehensive system architectures.",
        needs_work: "Work on system design principles and considering multiple aspects of complex problems."
      }
    };

    return templates[difficulty] || templates.easy;
  }

  // Map score to feedback category
  getFeedbackCategory(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    return 'needs_work';
  }

  // Generate difficulty-based feedback
  generateFeedback(score, difficulty, specificComments = []) {
    const templates = this.getFeedbackTemplates(difficulty);
    const category = this.getFeedbackCategory(score);
    const baseFeedback = templates[category];

    let feedback = baseFeedback;

    if (specificComments && specificComments.length > 0) {
      feedback += ` ${specificComments.join(' ')}`;
    }

    return {
      score,
      difficulty,
      category,
      feedback,
      suggestions: this.getImprovementSuggestions(difficulty, category)
    };
  }

  // Get improvement suggestions
  getImprovementSuggestions(difficulty, category) {
    const suggestions = {
      easy: {
        excellent: [
          "Continue building on your strong foundation with more complex topics",
          "Practice explaining concepts to others to reinforce understanding"
        ],
        good: [
          "Review documentation for deeper understanding",
          "Build small projects to apply your knowledge practically"
        ],
        needs_work: [
          "Study fundamental concepts thoroughly",
          "Practice with coding exercises and tutorials",
          "Focus on one concept at a time until mastered"
        ]
      },
      medium: {
        excellent: [
          "Tackle more complex implementation challenges",
          "Study design patterns and best practices"
        ],
        good: [
          "Practice with real-world problem scenarios",
          "Learn about testing and debugging strategies"
        ],
        needs_work: [
          "Work on intermediate-level coding challenges",
          "Study common algorithms and data structures",
          "Practice breaking down complex problems"
        ]
      },
      hard: {
        excellent: [
          "Explore advanced system design patterns",
          "Study scalability and performance optimization"
        ],
        good: [
          "Practice designing larger systems",
          "Learn about distributed systems concepts"
        ],
        needs_work: [
          "Study software architecture principles",
          "Practice with system design interviews",
          "Learn about different database architectures"
        ]
      }
    };

    return suggestions[difficulty]?.[category] || [
      "Continue practicing and building your skills"
    ];
  }
}

// Create and export singleton instance
const difficultyMapper = new DifficultyMapper();
export default difficultyMapper;

// Export individual functions
export const getDifficultyForIndex = (index) => 
  difficultyMapper.getDifficultyForIndex(index);

export const getTimeLimitForIndex = (index) => 
  difficultyMapper.getTimeLimitForIndex(index);

export const getQuestionDisplay = (index) => 
  difficultyMapper.getQuestionDisplay(index);

export const calculateWeightedScore = (rawScore, difficulty) => 
  difficultyMapper.calculateWeightedScore(rawScore, difficulty);

export const generateFeedback = (score, difficulty, specificComments) => 
  difficultyMapper.generateFeedback(score, difficulty, specificComments);

export const getDifficultyRecommendations = (scores) => 
  difficultyMapper.getDifficultyRecommendations(scores);