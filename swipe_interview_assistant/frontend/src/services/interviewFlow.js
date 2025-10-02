// Interview Flow Management Service
class InterviewFlowService {
  constructor() {
    this.currentSession = null;
    this.timers = new Map();
    this.eventListeners = new Map();
  }

  // Initialize new interview session
  initializeSession(candidateData, resumeData) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentSession = {
      sessionId,
      candidate: candidateData,
      resume: resumeData,
      status: 'initialized',
      currentStage: 'resume_upload',
      startTime: new Date().toISOString(),
      currentQuestionIndex: -1,
      questions: [],
      answers: [],
      timers: {},
      metadata: {
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    this.emit('sessionInitialized', this.currentSession);
    return this.currentSession;
  }

  // Start the interview
  async startInterview() {
    if (!this.currentSession) {
      throw new Error('No active interview session');
    }

    this.currentSession.status = 'in_progress';
    this.currentSession.currentStage = 'question_1_easy';
    this.currentSession.interviewStartTime = new Date().toISOString();

    // Generate first question
    await this.generateNextQuestion();

    this.emit('interviewStarted', this.currentSession);
    return this.currentSession;
  }

  // Generate next question based on current progress
  async generateNextQuestion() {
    if (!this.currentSession) return;

    const nextIndex = this.currentSession.currentQuestionIndex + 1;
    
    if (nextIndex >= 6) {
      await this.completeInterview();
      return;
    }

    const difficulty = this.getDifficultyForIndex(nextIndex);
    const question = await this.generateQuestion(nextIndex, difficulty);

    this.currentSession.currentQuestionIndex = nextIndex;
    this.currentSession.currentStage = `question_${nextIndex + 1}_${difficulty}`;
    this.currentSession.questions.push(question);

    // Start timer for this question
    this.startQuestionTimer(question);

    this.emit('questionGenerated', {
      question,
      session: this.currentSession
    });

    return question;
  }

  // Submit answer for current question
  async submitAnswer(answer, options = {}) {
    if (!this.currentSession || !this.currentSession.questions.length) {
      throw new Error('No active question to answer');
    }

    const currentQuestion = this.getCurrentQuestion();
    const answerData = {
      questionId: currentQuestion.id,
      questionIndex: this.currentSession.currentQuestionIndex,
      answer: answer.trim(),
      submittedAt: new Date().toISOString(),
      timeSpent: this.getQuestionTimeSpent(currentQuestion.id),
      autoSubmitted: options.autoSubmitted || false
    };

    // Stop timer for this question
    this.stopQuestionTimer(currentQuestion.id);

    // Evaluate answer
    const evaluation = await this.evaluateAnswer(currentQuestion, answer);
    answerData.evaluation = evaluation;
    answerData.score = evaluation.score;

    this.currentSession.answers.push(answerData);

    this.emit('answerSubmitted', {
      answer: answerData,
      session: this.currentSession
    });

    // Generate next question after a short delay
    setTimeout(async () => {
      await this.generateNextQuestion();
    }, 2000);

    return answerData;
  }

  // Evaluate answer using AI service
  async evaluateAnswer(question, answer) {
    try {
      // This would integrate with your AI service
      const evaluation = {
        score: this.calculateScore(question, answer),
        feedback: this.generateFeedback(question, answer),
        strengths: this.identifyStrengths(answer),
        improvements: this.identifyImprovements(question, answer),
        evaluatedAt: new Date().toISOString()
      };

      return evaluation;

    } catch (error) {
      console.error('Answer evaluation failed:', error);
      
      // Fallback evaluation
      return {
        score: 50,
        feedback: 'Evaluation service temporarily unavailable.',
        strengths: [],
        improvements: ['Service unavailable'],
        evaluatedAt: new Date().toISOString(),
        error: true
      };
    }
  }

  // Complete the interview
  async completeInterview() {
    if (!this.currentSession) return;

    this.currentSession.status = 'completed';
    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.currentStage = 'completed';

    // Calculate final score
    const finalScore = this.calculateFinalScore();
    this.currentSession.finalScore = finalScore;

    // Generate summary
    const summary = await this.generateSummary();
    this.currentSession.summary = summary;

    // Stop all timers
    this.stopAllTimers();

    this.emit('interviewCompleted', this.currentSession);
    return this.currentSession;
  }

  // Pause the interview
  pauseInterview() {
    if (!this.currentSession || this.currentSession.status !== 'in_progress') {
      return;
    }

    this.currentSession.status = 'paused';
    this.currentSession.pauseStartTime = new Date().toISOString();

    // Pause current question timer
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion) {
      this.pauseQuestionTimer(currentQuestion.id);
    }

    this.emit('interviewPaused', this.currentSession);
  }

  // Resume the interview
  resumeInterview() {
    if (!this.currentSession || this.currentSession.status !== 'paused') {
      return;
    }

    this.currentSession.status = 'in_progress';
    const pauseDuration = Date.now() - new Date(this.currentSession.pauseStartTime).getTime();
    
    // Adjust timers for pause duration
    this.currentSession.questions.forEach(question => {
      if (question.timer) {
        question.timer.startTime += pauseDuration;
      }
    });

    // Resume current question timer
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion) {
      this.resumeQuestionTimer(currentQuestion.id);
    }

    this.emit('interviewResumed', this.currentSession);
  }

  // Timer management
  startQuestionTimer(question) {
    const timerId = question.id;
    const timeLimit = this.getTimeLimit(question.difficulty);
    
    const timer = {
      startTime: Date.now(),
      timeLimit: timeLimit * 1000, // Convert to milliseconds
      remaining: timeLimit * 1000,
      isRunning: true
    };

    this.timers.set(timerId, timer);

    // Start countdown
    const intervalId = setInterval(() => {
      const currentTimer = this.timers.get(timerId);
      if (!currentTimer || !currentTimer.isRunning) return;

      const elapsed = Date.now() - currentTimer.startTime;
      currentTimer.remaining = Math.max(0, currentTimer.timeLimit - elapsed);

      this.emit('timerTick', {
        questionId: timerId,
        remaining: Math.ceil(currentTimer.remaining / 1000),
        percentage: (currentTimer.remaining / currentTimer.timeLimit) * 100
      });

      // Auto-submit when time expires
      if (currentTimer.remaining <= 0) {
        this.handleTimeExpired(question);
        clearInterval(intervalId);
      }
    }, 1000);

    // Store interval ID for cleanup
    timer.intervalId = intervalId;
    this.timers.set(timerId, timer);

    this.emit('timerStarted', {
      questionId: timerId,
      timeLimit: timeLimit
    });
  }

  stopQuestionTimer(questionId) {
    const timer = this.timers.get(questionId);
    if (timer && timer.intervalId) {
      clearInterval(timer.intervalId);
      timer.isRunning = false;
      this.timers.set(questionId, timer);
    }
  }

  pauseQuestionTimer(questionId) {
    const timer = this.timers.get(questionId);
    if (timer) {
      timer.isRunning = false;
      this.timers.set(questionId, timer);
    }
  }

  resumeQuestionTimer(questionId) {
    const timer = this.timers.get(questionId);
    if (timer) {
      timer.isRunning = true;
      timer.startTime = Date.now() - (timer.timeLimit - timer.remaining);
      this.timers.set(questionId, timer);
    }
  }

  stopAllTimers() {
    this.timers.forEach((timer, questionId) => {
      this.stopQuestionTimer(questionId);
    });
    this.timers.clear();
  }

  // Event system
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Utility methods
  getDifficultyForIndex(index) {
    if (index < 2) return 'easy';
    if (index < 4) return 'medium';
    return 'hard';
  }

  getTimeLimit(difficulty) {
    const limits = {
      easy: 20,   // 20 seconds
      medium: 60, // 1 minute
      hard: 120   // 2 minutes
    };
    return limits[difficulty] || 60;
  }

  getCurrentQuestion() {
    if (!this.currentSession || this.currentSession.questions.length === 0) {
      return null;
    }
    return this.currentSession.questions[this.currentSession.currentQuestionIndex];
  }

  getQuestionTimeSpent(questionId) {
    const timer = this.timers.get(questionId);
    if (!timer) return 0;
    
    return Math.ceil((timer.timeLimit - timer.remaining) / 1000);
  }

  calculateScore(question, answer) {
    // Basic scoring algorithm - in real implementation, this would use AI
    const baseScore = {
      easy: 70,
      medium: 60,
      hard: 50
    }[question.difficulty] || 50;

    // Adjust based on answer length and content
    const lengthBonus = Math.min(answer.length / 20, 20);
    const contentBonus = this.assessAnswerQuality(answer);
    const randomVariation = (Math.random() - 0.5) * 20;

    return Math.max(0, Math.min(100, baseScore + lengthBonus + contentBonus + randomVariation));
  }

  assessAnswerQuality(answer) {
    let score = 0;
    
    // Simple heuristics for answer quality
    if (answer.length > 100) score += 10;
    if (answer.includes('React') || answer.includes('JavaScript')) score += 5;
    if (answer.includes('example') || answer.includes('experience')) score += 5;
    if (answer.split('.').length > 2) score += 5; // Multiple sentences
    
    return score;
  }

  generateFeedback(question, answer) {
    const score = this.calculateScore(question, answer);
    
    if (score >= 80) {
      return "Excellent answer! You demonstrated strong understanding with clear examples and good structure.";
    } else if (score >= 60) {
      return "Good answer. You covered the main points well but could provide more specific examples or details.";
    } else {
      return "This area needs improvement. Consider providing more specific examples and explaining your thought process more clearly.";
    }
  }

  identifyStrengths(answer) {
    const strengths = [];
    
    if (answer.length > 50) strengths.push('Detailed explanation');
    if (answer.includes('example')) strengths.push('Practical examples');
    if (answer.split('.').length > 2) strengths.push('Structured communication');
    
    return strengths.length > 0 ? strengths : ['Clear communication'];
  }

  identifyImprovements(question, answer) {
    const improvements = [];
    
    if (answer.length < 50) improvements.push('More detailed explanation');
    if (!answer.includes('example')) improvements.push('Include practical examples');
    if (answer.split('.').length <= 1) improvements.push('Better structure and organization');
    
    return improvements.length > 0 ? improvements : ['Continue practicing similar questions'];
  }

  calculateFinalScore() {
    if (!this.currentSession || this.currentSession.answers.length === 0) {
      return 0;
    }

    const scores = this.currentSession.answers.map(a => a.score);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  async generateSummary() {
    if (!this.currentSession) return '';
    
    const { answers, finalScore } = this.currentSession;
    const strengths = answers.filter(a => a.score >= 70).length;
    const weaknesses = answers.filter(a => a.score < 60).length;

    return `Candidate scored ${finalScore}/100 overall, demonstrating ${strengths} strong areas out of ${answers.length} questions. ${
      finalScore >= 80 ? 'Excellent technical skills suitable for senior roles.' :
      finalScore >= 60 ? 'Good foundational knowledge with room for growth.' :
      'Needs significant improvement in core technical concepts.'
    }`;
  }

  async generateQuestion(index, difficulty) {
    // This would integrate with your AI service
    const questionTemplates = {
      easy: [
        "Explain the concept of React components and their role in building user interfaces.",
        "What is the virtual DOM and how does it improve performance in React applications?",
        "Describe the difference between let, const, and var in JavaScript.",
        "How does JavaScript handle asynchronous operations? Explain callbacks and promises.",
        "What are CSS Flexbox and Grid, and when would you use each?"
      ],
      medium: [
        "How would you manage state in a large React application? Discuss different approaches.",
        "Explain the concept of 'lifting state up' in React with a practical example.",
        "What are React hooks and how do they differ from class component lifecycle methods?",
        "How would you optimize the performance of a React application?",
        "Describe RESTful API design principles and best practices."
      ],
      hard: [
        "Design a real-time collaborative editing feature. Discuss architecture and challenges.",
        "How would you implement server-side rendering with React? Discuss benefits and trade-offs.",
        "Explain microservices architecture vs monolithic architecture for a large application.",
        "Describe your approach to handling authentication and authorization securely.",
        "How would you design a scalable WebSocket service for real-time features?"
      ]
    };

    const templates = questionTemplates[difficulty] || questionTemplates.easy;
    const questionText = templates[index % templates.length];

    return {
      id: `question_${index}_${Date.now()}`,
      text: questionText,
      difficulty,
      index,
      category: this.getCategoryForDifficulty(difficulty),
      type: 'technical',
      timeLimit: this.getTimeLimit(difficulty)
    };
  }

  getCategoryForDifficulty(difficulty) {
    const categories = {
      easy: 'fundamentals',
      medium: 'application',
      hard: 'architecture'
    };
    return categories[difficulty] || 'general';
  }

  handleTimeExpired(question) {
    this.emit('timeExpired', { question });
    
    // Auto-submit empty answer
    this.submitAnswer('[Time expired - No answer provided]', {
      autoSubmitted: true
    });
  }

  // Get current session state
  getCurrentSession() {
    return this.currentSession;
  }

  // Reset interview session
  resetSession() {
    this.stopAllTimers();
    this.currentSession = null;
    this.eventListeners.clear();
  }

  // Get interview progress
  getProgress() {
    if (!this.currentSession) return 0;
    
    const totalQuestions = 6;
    const answeredQuestions = this.currentSession.answers.length;
    
    return (answeredQuestions / totalQuestions) * 100;
  }

  // Get time remaining for current question
  getCurrentTimeRemaining() {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return 0;
    
    const timer = this.timers.get(currentQuestion.id);
    return timer ? Math.ceil(timer.remaining / 1000) : 0;
  }
}

// Create and export singleton instance
const interviewFlowService = new InterviewFlowService();
export default interviewFlowService;

// Export individual functions for convenience
export const initializeSession = (candidateData, resumeData) => 
  interviewFlowService.initializeSession(candidateData, resumeData);
export const startInterview = () => interviewFlowService.startInterview();
export const submitAnswer = (answer, options) => interviewFlowService.submitAnswer(answer, options);
export const pauseInterview = () => interviewFlowService.pauseInterview();
export const resumeInterview = () => interviewFlowService.resumeInterview();
export const getCurrentSession = () => interviewFlowService.getCurrentSession();
export const getProgress = () => interviewFlowService.getProgress();
export const getCurrentTimeRemaining = () => interviewFlowService.getCurrentTimeRemaining();