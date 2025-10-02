// Difficulty Levels Configuration and Management
export const DIFFICULTY_LEVELS = {
  EASY: {
    key: 'easy',
    level: 1,
    label: 'Easy',
    description: 'Fundamental concepts and basic syntax questions',
    shortDescription: 'Basic concepts',
    icon: '🟢',
    color: '#10B981', // emerald-500
    backgroundColor: '#ECFDF5', // emerald-50
    borderColor: '#A7F3D0', // emerald-200
    
    // Question characteristics
    questionTypes: ['definition', 'syntax', 'basic-concept', 'fundamental'],
    technicalDepth: 'basic',
    expectedConcepts: 1,
    complexity: 'low',
    
    // Time configuration
    timeLimit: 20, // seconds
    readingTime: 5, // seconds to read and understand
    thinkingTime: 10, // seconds to think
    writingTime: 5, // seconds to write
    
    // Answer expectations
    expectedAnswerLength: {
      min: 50,
      max: 200,
      words: 10
    },
    shouldIncludeExamples: true,
    shouldIncludeCode: false,
    shouldDiscussTradeoffs: false,
    
    // Scoring configuration
    baseScoreRange: { min: 40, max: 90 },
    evaluationWeights: {
      technicalAccuracy: 0.4,
      completeness: 0.3,
      clarity: 0.2,
      examples: 0.1
    },
    penaltyForShortAnswers: 0.1,
    bonusForExamples: 0.05,
    
    // Learning objectives
    objectives: [
      'Assess understanding of basic concepts',
      'Evaluate communication of fundamental ideas',
      'Test knowledge of core syntax and patterns'
    ],
    
    // Feedback templates
    feedbackTemplates: {
      excellent: "Excellent understanding of fundamental concepts! Your answer was clear, accurate, and well-explained.",
      good: "Good grasp of basic concepts. Your answer covers the main points but could benefit from more specific examples.",
      needs_work: "Review the fundamental concepts. Practice explaining them clearly with concrete examples to strengthen your understanding."
    }
  },

  MEDIUM: {
    key: 'medium',
    level: 2,
    label: 'Medium',
    description: 'Practical implementation and problem-solving questions',
    shortDescription: 'Implementation skills',
    icon: '🟡',
    color: '#F59E0B', // amber-500
    backgroundColor: '#FFFBEB', // amber-50
    borderColor: '#FDE68A', // amber-200
    
    // Question characteristics
    questionTypes: ['implementation', 'comparison', 'troubleshooting', 'optimization'],
    technicalDepth: 'intermediate',
    expectedConcepts: 2,
    complexity: 'medium',
    
    // Time configuration
    timeLimit: 60, // seconds
    readingTime: 10, // seconds to read and understand
    thinkingTime: 20, // seconds to think
    writingTime: 30, // seconds to write
    
    // Answer expectations
    expectedAnswerLength: {
      min: 100,
      max: 400,
      words: 25
    },
    shouldIncludeExamples: true,
    shouldIncludeCode: true,
    shouldDiscussTradeoffs: true,
    
    // Scoring configuration
    baseScoreRange: { min: 30, max: 85 },
    evaluationWeights: {
      technicalAccuracy: 0.3,
      problemSolving: 0.3,
      bestPractices: 0.2,
      examples: 0.2
    },
    penaltyForShortAnswers: 0.15,
    bonusForExamples: 0.08,
    bonusForCode: 0.07,
    
    // Learning objectives
    objectives: [
      'Evaluate problem-solving approach',
      'Assess implementation skills',
      'Test understanding of best practices',
      'Measure ability to compare solutions'
    ],
    
    // Feedback templates
    feedbackTemplates: {
      excellent: "Strong problem-solving skills demonstrated! Your approach was logical, well-explained, and followed best practices.",
      good: "Good implementation understanding. Your solution works but could be improved with better error handling and edge case consideration.",
      needs_work: "Focus on practical implementation details. Practice breaking down problems and considering alternative approaches."
    }
  },

  HARD: {
    key: 'hard',
    level: 3,
    label: 'Hard',
    description: 'Advanced concepts, architecture, and system design questions',
    shortDescription: 'Advanced architecture',
    icon: '🔴',
    color: '#EF4444', // red-500
    backgroundColor: '#FEF2F2', // red-50
    borderColor: '#FECACA', // red-200
    
    // Question characteristics
    questionTypes: ['architecture', 'system-design', 'optimization', 'scalability'],
    technicalDepth: 'advanced',
    expectedConcepts: 3,
    complexity: 'high',
    
    // Time configuration
    timeLimit: 120, // seconds
    readingTime: 15, // seconds to read and understand
    thinkingTime: 45, // seconds to think
    writingTime: 60, // seconds to write
    
    // Answer expectations
    expectedAnswerLength: {
      min: 150,
      max: 600,
      words: 40
    },
    shouldIncludeExamples: true,
    shouldIncludeCode: true,
    shouldDiscussTradeoffs: true,
    shouldConsiderScalability: true,
    
    // Scoring configuration
    baseScoreRange: { min: 20, max: 80 },
    evaluationWeights: {
      architecture: 0.3,
      scalability: 0.3,
      tradeOffs: 0.2,
      innovation: 0.2
    },
    penaltyForShortAnswers: 0.2,
    bonusForExamples: 0.1,
    bonusForCode: 0.1,
    bonusForTradeoffs: 0.1,
    
    // Learning objectives
    objectives: [
      'Assess architectural thinking',
      'Evaluate scalability considerations',
      'Test trade-off analysis skills',
      'Measure innovation in solution design'
    ],
    
    // Feedback templates
    feedbackTemplates: {
      excellent: "Outstanding architectural thinking! Your solution demonstrates deep understanding of scalability, trade-offs, and real-world constraints.",
      good: "Good understanding of advanced concepts. Your design works but could be strengthened with more comprehensive consideration of edge cases and performance implications.",
      needs_work: "Work on system design principles and architectural thinking. Practice designing comprehensive solutions that consider multiple aspects of complex problems."
    }
  }
};

// Difficulty progression sequence
export const DIFFICULTY_PROGRESSION = {
  SEQUENCE: ['easy', 'easy', 'medium', 'medium', 'hard', 'hard'],
  TOTAL_QUESTIONS: 6,
  QUESTIONS_PER_LEVEL: 2,
  
  // Transition requirements
  TRANSITIONS: {
    EASY_TO_MEDIUM: {
      requiredScore: 60,
      minimumQuestions: 2,
      description: 'Move from basic concepts to implementation'
    },
    MEDIUM_TO_HARD: {
      requiredScore: 65,
      minimumQuestions: 2,
      description: 'Advance from implementation to architecture'
    }
  },
  
  // Stage definitions
  STAGES: {
    WARMUP: {
      questions: [0, 1],
      difficulty: 'easy',
      purpose: 'Build confidence and assess fundamentals'
    },
    FOUNDATION: {
      questions: [2, 3],
      difficulty: 'medium',
      purpose: 'Test practical implementation skills'
    },
    ADVANCED: {
      questions: [4, 5],
      difficulty: 'hard',
      purpose: 'Evaluate architectural and design thinking'
    }
  }
};

// Difficulty-based scoring multipliers
export const DIFFICULTY_MULTIPLIERS = {
  EASY: 1.0,
  MEDIUM: 1.2,
  HARD: 1.5
};

// Expected performance by difficulty
export const EXPECTED_PERFORMANCE = {
  EASY: {
    excellent: { min: 80, label: 'Strong Fundamentals' },
    good: { min: 60, max: 79, label: 'Good Understanding' },
    fair: { min: 40, max: 59, label: 'Basic Understanding' },
    poor: { max: 39, label: 'Needs Review' }
  },
  MEDIUM: {
    excellent: { min: 75, label: 'Excellent Problem-Solver' },
    good: { min: 55, max: 74, label: 'Competent Implementer' },
    fair: { min: 35, max: 54, label: 'Developing Skills' },
    poor: { max: 34, label: 'Needs Practice' }
  },
  HARD: {
    excellent: { min: 70, label: 'Exceptional Architect' },
    good: { min: 50, max: 69, label: 'Solid Designer' },
    fair: { min: 30, max: 49, label: 'Learning Advanced Concepts' },
    poor: { max: 29, label: 'Focus on Fundamentals' }
  }
};

// Helper functions
export const getDifficultyConfig = (difficulty) => {
  const upperCaseDifficulty = difficulty?.toUpperCase();
  return DIFFICULTY_LEVELS[upperCaseDifficulty] || DIFFICULTY_LEVELS.EASY;
};

export const getDifficultyForIndex = (index) => {
  const sequence = DIFFICULTY_PROGRESSION.SEQUENCE;
  return sequence[index] || 'easy';
};

export const getStageForQuestion = (index) => {
  const stages = DIFFICULTY_PROGRESSION.STAGES;
  
  for (const [stageName, stageConfig] of Object.entries(stages)) {
    if (stageConfig.questions.includes(index)) {
      return {
        name: stageName.toLowerCase(),
        ...stageConfig
      };
    }
  }
  
  return {
    name: 'unknown',
    difficulty: 'easy',
    purpose: 'Assessment'
  };
};

export const getTimeLimitForDifficulty = (difficulty) => {
  const config = getDifficultyConfig(difficulty);
  return config.timeLimit;
};

export const getDifficultyMultiplier = (difficulty) => {
  const upperCaseDifficulty = difficulty?.toUpperCase();
  return DIFFICULTY_MULTIPLIERS[upperCaseDifficulty] || DIFFICULTY_MULTIPLIERS.EASY;
};

export const calculateWeightedScore = (rawScore, difficulty) => {
  const multiplier = getDifficultyMultiplier(difficulty);
  return Math.min(100, Math.round(rawScore * multiplier));
};

export const getExpectedAnswerLength = (difficulty) => {
  const config = getDifficultyConfig(difficulty);
  return config.expectedAnswerLength;
};

export const shouldIncludeCode = (difficulty) => {
  const config = getDifficultyConfig(difficulty);
  return config.shouldIncludeCode;
};

export const getEvaluationWeights = (difficulty) => {
  const config = getDifficultyConfig(difficulty);
  return config.evaluationWeights;
};

export const getPerformanceLevel = (score, difficulty) => {
  const performanceLevels = EXPECTED_PERFORMANCE[difficulty?.toUpperCase()] || EXPECTED_PERFORMANCE.EASY;
  
  for (const [level, range] of Object.entries(performanceLevels)) {
    const meetsMin = range.min === undefined || score >= range.min;
    const meetsMax = range.max === undefined || score <= range.max;
    
    if (meetsMin && meetsMax) {
      return {
        level,
        label: range.label,
        scoreRange: range
      };
    }
  }
  
  return {
    level: 'unknown',
    label: 'Not Assessed',
    scoreRange: {}
  };
};

export const getFeedbackTemplate = (difficulty, performanceLevel) => {
  const config = getDifficultyConfig(difficulty);
  return config.feedbackTemplates[performanceLevel] || config.feedbackTemplates.needs_work;
};

export const canProgressToNextDifficulty = (currentDifficulty, scores) => {
  const currentScores = scores.filter(score => 
    score.difficulty === currentDifficulty
  ).map(score => score.value);
  
  if (currentScores.length === 0) return true;
  
  const averageScore = currentScores.reduce((sum, score) => sum + score, 0) / currentScores.length;
  const transition = DIFFICULTY_PROGRESSION.TRANSITIONS[`${currentDifficulty.toUpperCase()}_TO_${getNextDifficulty(currentDifficulty).toUpperCase()}`];
  
  return transition ? averageScore >= transition.requiredScore : true;
};

export const getNextDifficulty = (currentDifficulty) => {
  const difficulties = Object.keys(DIFFICULTY_LEVELS).map(d => d.toLowerCase());
  const currentIndex = difficulties.indexOf(currentDifficulty);
  
  if (currentIndex === -1 || currentIndex === difficulties.length - 1) {
    return currentDifficulty;
  }
  
  return difficulties[currentIndex + 1];
};

export const getPreviousDifficulty = (currentDifficulty) => {
  const difficulties = Object.keys(DIFFICULTY_LEVELS).map(d => d.toLowerCase());
  const currentIndex = difficulties.indexOf(currentDifficulty);
  
  if (currentIndex <= 0) {
    return currentDifficulty;
  }
  
  return difficulties[currentIndex - 1];
};

export const getAllDifficulties = () => {
  return Object.values(DIFFICULTY_LEVELS).map(difficulty => ({
    key: difficulty.key,
    label: difficulty.label,
    description: difficulty.description,
    icon: difficulty.icon,
    color: difficulty.color,
    level: difficulty.level
  }));
};

export const getDifficultyByLevel = (level) => {
  return Object.values(DIFFICULTY_LEVELS).find(diff => diff.level === level) || DIFFICULTY_LEVELS.EASY;
};

export const isValidDifficulty = (difficulty) => {
  const difficulties = Object.keys(DIFFICULTY_LEVELS).map(d => d.toLowerCase());
  return difficulties.includes(difficulty?.toLowerCase());
};

export const getTotalInterviewTime = () => {
  const { EASY, MEDIUM, HARD } = DIFFICULTY_LEVELS;
  return (EASY.timeLimit * 2) + (MEDIUM.timeLimit * 2) + (HARD.timeLimit * 2);
};

export const getDifficultyProgress = (currentIndex) => {
  const totalQuestions = DIFFICULTY_PROGRESSION.TOTAL_QUESTIONS;
  const currentDifficulty = getDifficultyForIndex(currentIndex);
  const questionsInCurrent = DIFFICULTY_PROGRESSION.SEQUENCE.filter(d => d === currentDifficulty).length;
  const completedInCurrent = DIFFICULTY_PROGRESSION.SEQUENCE
    .slice(0, currentIndex + 1)
    .filter(d => d === currentDifficulty).length;
  
  return {
    currentDifficulty,
    completedInCurrent,
    totalInCurrent: questionsInCurrent,
    progressInCurrent: completedInCurrent / questionsInCurrent,
    overallProgress: (currentIndex + 1) / totalQuestions
  };
};

// Export for direct access
export const EASY = DIFFICULTY_LEVELS.EASY;
export const MEDIUM = DIFFICULTY_LEVELS.MEDIUM;
export const HARD = DIFFICULTY_LEVELS.HARD;

export default DIFFICULTY_LEVELS;