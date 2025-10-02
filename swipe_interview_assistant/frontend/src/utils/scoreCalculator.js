// Score Calculator Utility for evaluating interview answers
class ScoreCalculator {
  constructor() {
    this.scoringWeights = this.initializeScoringWeights();
    this.keywordMatchers = this.initializeKeywordMatchers();
  }

  // Initialize scoring weights for different criteria
  initializeScoringWeights() {
    return {
      technicalAccuracy: 0.35,
      completeness: 0.25,
      clarity: 0.15,
      examples: 0.15,
      depth: 0.10
    };
  }

  // Initialize keyword matchers for different technologies
  initializeKeywordMatchers() {
    return {
      react: [
        'component', 'state', 'props', 'hook', 'effect', 'context',
        'virtual dom', 'jsx', 'reconciliation', 'fiber'
      ],
      javascript: [
        'closure', 'promise', 'async', 'await', 'scope', 'hoisting',
        'prototype', 'event loop', 'callback', 'es6'
      ],
      nodejs: [
        'event loop', 'non-blocking', 'middleware', 'express', 'module',
        'require', 'import', 'stream', 'buffer', 'cluster'
      ],
      general: [
        'performance', 'optimization', 'scalability', 'architecture',
        'database', 'api', 'rest', 'graphql', 'authentication'
      ]
    };
  }

  // Calculate score for an answer
  calculateScore(question, answer, difficulty) {
    const analysis = this.analyzeAnswer(question, answer, difficulty);
    
    let totalScore = 0;
    let maxPossible = 0;

    // Calculate weighted score based on criteria
    Object.entries(this.scoringWeights).forEach(([criterion, weight]) => {
      const criterionScore = this.calculateCriterionScore(criterion, analysis, difficulty);
      totalScore += criterionScore * weight;
      maxPossible += 100 * weight;
    });

    // Adjust for difficulty
    const rawScore = (totalScore / maxPossible) * 100;
    const adjustedScore = this.adjustForDifficulty(rawScore, difficulty);

    // Apply penalties/bonuses
    const finalScore = this.applyAdjustments(adjustedScore, analysis);

    return Math.max(0, Math.min(100, Math.round(finalScore)));
  }

  // Analyze answer content
  analyzeAnswer(question, answer, difficulty) {
    const text = answer.toLowerCase().trim();
    const words = text.split(/\s+/).filter(word => word.length > 0);
    
    return {
      wordCount: words.length,
      sentenceCount: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
      containsCode: this.containsCodeExamples(text),
      containsExamples: this.containsPracticalExamples(text),
      keywordMatches: this.countKeywordMatches(question, text),
      structureScore: this.analyzeStructure(text),
      technicalDepth: this.assessTechnicalDepth(text, difficulty),
      clarity: this.assessClarity(text),
      relevance: this.assessRelevance(question, text)
    };
  }

  // Calculate score for specific criterion
  calculateCriterionScore(criterion, analysis, difficulty) {
    switch (criterion) {
      case 'technicalAccuracy':
        return this.calculateTechnicalAccuracy(analysis, difficulty);
      
      case 'completeness':
        return this.calculateCompleteness(analysis, difficulty);
      
      case 'clarity':
        return this.calculateClarity(analysis);
      
      case 'examples':
        return this.calculateExamples(analysis, difficulty);
      
      case 'depth':
        return this.calculateDepth(analysis, difficulty);
      
      default:
        return 50; // Default score
    }
  }

  // Technical accuracy scoring
  calculateTechnicalAccuracy(analysis, difficulty) {
    let score = 50; // Base score

    // Bonus for keyword matches
    score += Math.min(analysis.keywordMatches * 5, 20);

    // Bonus for technical depth
    score += analysis.technicalDepth * 10;

    // Penalty for potential inaccuracies (simplified)
    if (analysis.wordCount < 20) {
      score -= 20; // Very short answer
    }

    // Adjust for difficulty
    if (difficulty === 'hard') {
      score = score * 0.9; // Stricter scoring for hard questions
    }

    return Math.max(0, Math.min(100, score));
  }

  // Completeness scoring
  calculateCompleteness(analysis, difficulty) {
    const expectedLength = {
      easy: 50,
      medium: 100,
      hard: 150
    }[difficulty] || 80;

    const lengthRatio = analysis.wordCount / expectedLength;
    let score = Math.min(lengthRatio * 60, 60); // 60% for length

    // Bonus for structure
    score += analysis.structureScore * 20;

    // Bonus for covering multiple aspects
    if (analysis.sentenceCount >= 3) {
      score += 20;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Clarity scoring
  calculateClarity(analysis) {
    let score = 50;

    // Bonus for good structure
    score += analysis.structureScore * 20;

    // Bonus for appropriate length
    if (analysis.wordCount >= 30 && analysis.wordCount <= 300) {
      score += 20;
    }

    // Penalty for very poor structure
    if (analysis.structureScore < 0.3) {
      score -= 20;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Examples scoring
  calculateExamples(analysis, difficulty) {
    let score = 0;

    if (analysis.containsExamples) {
      score += 60; // Base score for having examples
    }

    if (analysis.containsCode) {
      score += 30; // Bonus for code examples
    }

    // Adjust for difficulty
    if (difficulty === 'hard' && !analysis.containsExamples) {
      score = Math.max(score, 30); // Hard questions need examples
    }

    return Math.max(0, Math.min(100, score));
  }

  // Depth scoring
  calculateDepth(analysis, difficulty) {
    let score = analysis.technicalDepth * 70;

    // Bonus for comprehensive coverage
    if (analysis.wordCount > 100) {
      score += 20;
    }

    // Bonus for multiple technical concepts
    if (analysis.keywordMatches >= 3) {
      score += 10;
    }

    // Higher expectations for harder questions
    if (difficulty === 'hard' && analysis.technicalDepth < 0.7) {
      score *= 0.7;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Adjust score based on difficulty
  adjustForDifficulty(score, difficulty) {
    const adjustments = {
      easy: 1.1,    // Easier questions get slight boost
      medium: 1.0,  // Standard scoring
      hard: 0.9     // Harder questions get slight reduction
    };

    return score * (adjustments[difficulty] || 1.0);
  }

  // Apply final adjustments
  applyAdjustments(score, analysis) {
    let adjustedScore = score;

    // Penalty for very short answers
    if (analysis.wordCount < 15) {
      adjustedScore *= 0.6;
    }

    // Bonus for well-structured answers
    if (analysis.structureScore > 0.8) {
      adjustedScore *= 1.1;
    }

    // Penalty for poor relevance
    if (analysis.relevance < 0.3) {
      adjustedScore *= 0.7;
    }

    return adjustedScore;
  }

  // Utility analysis methods
  containsCodeExamples(text) {
    const codeIndicators = [
      'function', 'const ', 'let ', 'var ', '=>', 'import', 'export',
      'class ', 'return', 'if (', 'for (', 'while (', 'console.log'
    ];
    return codeIndicators.some(indicator => text.includes(indicator));
  }

  containsPracticalExamples(text) {
    const exampleIndicators = [
      'for example', 'for instance', 'such as', 'like when',
      'in practice', 'real world', 'scenario', 'use case'
    ];
    return exampleIndicators.some(indicator => text.includes(indicator));
  }

  countKeywordMatches(question, answer) {
    const category = question.category || 'general';
    const keywords = this.keywordMatchers[category] || this.keywordMatchers.general;
    
    return keywords.filter(keyword => 
      answer.includes(keyword.toLowerCase())
    ).length;
  }

  analyzeStructure(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) return 0;

    let structureScore = 0;

    // Check for introductory sentence
    if (sentences[0].length > 10) {
      structureScore += 0.3;
    }

    // Check for multiple sentences (indicating structure)
    if (sentences.length >= 2) {
      structureScore += 0.4;
    }

    // Check for concluding sentence
    if (sentences.length >= 3 && sentences[sentences.length - 1].length > 10) {
      structureScore += 0.3;
    }

    return structureScore;
  }

  assessTechnicalDepth(text, difficulty) {
    const depthIndicators = {
      easy: ['because', 'reason', 'why', 'how'],
      medium: ['compare', 'difference', 'advantage', 'disadvantage', 'trade-off'],
      hard: ['architecture', 'scalability', 'performance', 'optimization', 'security']
    };

    const indicators = depthIndicators[difficulty] || depthIndicators.easy;
    const matches = indicators.filter(indicator => text.includes(indicator)).length;
    
    return Math.min(matches / indicators.length, 1);
  }

  assessClarity(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;

    // Simple clarity assessment based on sentence length variation
    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    const variance = sentences.reduce((sum, s) => sum + Math.pow(s.length - avgLength, 2), 0) / sentences.length;

    // Moderate variance suggests good clarity (not all very short or very long)
    return Math.max(0, 1 - Math.abs(variance - 400) / 400);
  }

  assessRelevance(question, answer) {
    const questionKeywords = this.extractKeywords(question.text);
    const answerText = answer.toLowerCase();
    
    const matches = questionKeywords.filter(keyword => 
      answerText.includes(keyword.toLowerCase())
    ).length;

    return matches / Math.max(questionKeywords.length, 1);
  }

  extractKeywords(text) {
    // Simple keyword extraction (in real implementation, use NLP)
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && 
        !stopWords.has(word) &&
        /^[a-z]+$/.test(word)
      )
      .slice(0, 10); // Limit to top 10 keywords
  }

  // Generate detailed feedback based on score analysis
  generateFeedback(score, analysis, question) {
    const feedback = {
      score: score,
      strengths: [],
      improvements: [],
      overall: ''
    };

    // Identify strengths
    if (analysis.technicalDepth > 0.7) {
      feedback.strengths.push('Strong technical understanding');
    }
    if (analysis.containsExamples) {
      feedback.strengths.push('Good use of practical examples');
    }
    if (analysis.structureScore > 0.7) {
      feedback.strengths.push('Well-structured answer');
    }
    if (analysis.keywordMatches >= 3) {
      feedback.strengths.push('Comprehensive coverage of key concepts');
    }

    // Identify improvements
    if (analysis.wordCount < 50) {
      feedback.improvements.push('Provide more detailed explanations');
    }
    if (!analysis.containsExamples && question.difficulty !== 'easy') {
      feedback.improvements.push('Include practical examples or use cases');
    }
    if (analysis.structureScore < 0.5) {
      feedback.improvements.push('Improve answer structure with clear introduction and conclusion');
    }
    if (analysis.relevance < 0.6) {
      feedback.improvements.push('Focus more directly on the question asked');
    }

    // Overall feedback
    if (score >= 80) {
      feedback.overall = 'Excellent answer! Demonstrates strong understanding and clear communication.';
    } else if (score >= 60) {
      feedback.overall = 'Good answer with solid understanding. Consider adding more depth and examples.';
    } else if (score >= 40) {
      feedback.overall = 'Basic understanding shown. Focus on providing more detailed explanations and examples.';
    } else {
      feedback.overall = 'Needs significant improvement. Review the fundamental concepts and practice explaining them clearly.';
    }

    return feedback;
  }

  // Calculate average score from multiple answers
  calculateAverageScore(scores) {
    if (!scores || scores.length === 0) return 0;
    
    const validScores = scores.filter(score => typeof score === 'number' && !isNaN(score));
    if (validScores.length === 0) return 0;

    const sum = validScores.reduce((total, score) => total + score, 0);
    return Math.round(sum / validScores.length);
  }

  // Get performance breakdown by difficulty
  getPerformanceBreakdown(answers) {
    const breakdown = {
      easy: { scores: [], average: 0, count: 0 },
      medium: { scores: [], average: 0, count: 0 },
      hard: { scores: [], average: 0, count: 0 }
    };

    answers.forEach(answer => {
      if (breakdown[answer.difficulty]) {
        breakdown[answer.difficulty].scores.push(answer.score);
        breakdown[answer.difficulty].count++;
      }
    });

    // Calculate averages
    Object.keys(breakdown).forEach(difficulty => {
      const data = breakdown[difficulty];
      data.average = data.scores.length > 0 
        ? this.calculateAverageScore(data.scores)
        : 0;
    });

    return breakdown;
  }
}

// Create and export singleton instance
const scoreCalculator = new ScoreCalculator();
export default scoreCalculator;

// Export individual functions
export const calculateScore = (question, answer, difficulty) => 
  scoreCalculator.calculateScore(question, answer, difficulty);

export const generateFeedback = (score, analysis, question) => 
  scoreCalculator.generateFeedback(score, analysis, question);

export const calculateAverageScore = (scores) => 
  scoreCalculator.calculateAverageScore(scores);

export const getPerformanceBreakdown = (answers) => 
  scoreCalculator.getPerformanceBreakdown(answers);