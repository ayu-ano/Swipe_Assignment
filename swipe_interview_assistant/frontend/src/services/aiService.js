// AI Service for interview question generation and answer evaluation
// This service integrates with AI APIs (OpenAI, Anthropic, etc.)

const AI_SERVICE_CONFIG = {
  baseURL: process.env.REACT_APP_AI_API_URL || 'https://api.openai.com/v1',
  apiKey: process.env.REACT_APP_AI_API_KEY,
  model: process.env.REACT_APP_AI_MODEL || 'gpt-3.5-turbo',
  maxTokens: 1000,
  temperature: 0.7
};

// Cache for generated questions to ensure consistency
const questionCache = new Map();

class AIService {
  constructor() {
    this.isMockMode = !AI_SERVICE_CONFIG.apiKey;
    if (this.isMockMode) {
      console.warn('AI Service running in mock mode. Set REACT_APP_AI_API_KEY to use real AI.');
    }
  }

  // Generate interview question based on difficulty and index
  async generateQuestion(index, difficulty) {
    const cacheKey = `${difficulty}_${index}`;
    
    // Return cached question if available
    if (questionCache.has(cacheKey)) {
      return questionCache.get(cacheKey);
    }

    if (this.isMockMode) {
      const mockQuestion = this.generateMockQuestion(index, difficulty);
      questionCache.set(cacheKey, mockQuestion);
      return mockQuestion;
    }

    try {
      const prompt = this.buildQuestionPrompt(index, difficulty);
      const response = await this.makeAIRequest(prompt);
      const question = this.parseQuestionResponse(response, index, difficulty);
      
      questionCache.set(cacheKey, question);
      return question;

    } catch (error) {
      console.error('Error generating question:', error);
      // Fallback to mock question
      const mockQuestion = this.generateMockQuestion(index, difficulty);
      questionCache.set(cacheKey, mockQuestion);
      return mockQuestion;
    }
  }

  // Evaluate candidate's answer
  async evaluateAnswer(question, answer, difficulty) {
    if (this.isMockMode) {
      return this.generateMockEvaluation(question, answer, difficulty);
    }

    try {
      const prompt = this.buildEvaluationPrompt(question, answer, difficulty);
      const response = await this.makeAIRequest(prompt);
      return this.parseEvaluationResponse(response);

    } catch (error) {
      console.error('Error evaluating answer:', error);
      // Fallback to mock evaluation
      return this.generateMockEvaluation(question, answer, difficulty);
    }
  }

  // Generate candidate summary based on all answers
  async generateSummary(answers, finalScore) {
    if (this.isMockMode) {
      return this.generateMockSummary(answers, finalScore);
    }

    try {
      const prompt = this.buildSummaryPrompt(answers, finalScore);
      const response = await this.makeAIRequest(prompt);
      return this.parseSummaryResponse(response);

    } catch (error) {
      console.error('Error generating summary:', error);
      return this.generateMockSummary(answers, finalScore);
    }
  }

  // Make actual API request to AI service
  async makeAIRequest(prompt) {
    const response = await fetch(`${AI_SERVICE_CONFIG.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_SERVICE_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: AI_SERVICE_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: AI_SERVICE_CONFIG.maxTokens,
        temperature: AI_SERVICE_CONFIG.temperature
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content;
  }

  // Build prompt for question generation
  buildQuestionPrompt(index, difficulty) {
    const questionTypes = {
      easy: "basic React components, JavaScript fundamentals, HTML/CSS concepts",
      medium: "state management, API integration, performance optimization, React hooks",
      hard: "system design, advanced React patterns, scalability, architecture decisions"
    };

    return `
      Generate a technical interview question for a Full-Stack Developer position (React/Node.js).
      
      Requirements:
      - Difficulty: ${difficulty}
      - Question ${index + 1} of 6
      - Focus on: ${questionTypes[difficulty]}
      - Should be practical and relevant to real-world development
      - Expect a detailed, code-oriented answer
      - Make it specific and actionable
      
      Return response in JSON format:
      {
        "text": "the question text",
        "difficulty": "${difficulty}",
        "category": "react|node|javascript|html|css|database|architecture",
        "type": "technical|behavioral|system-design"
      }
    `;
  }

  // Build prompt for answer evaluation
  buildEvaluationPrompt(question, answer, difficulty) {
    const scoringCriteria = {
      easy: "Focus on basic understanding, syntax correctness, and fundamental concepts",
      medium: "Evaluate problem-solving approach, code quality, and best practices",
      hard: "Assess architecture decisions, scalability considerations, and trade-off analysis"
    };

    return `
      Evaluate the following interview answer and provide a score (0-100) with detailed feedback.
      
      QUESTION: ${question}
      DIFFICULTY: ${difficulty}
      CANDIDATE'S ANSWER: ${answer}
      
      Scoring Criteria (${difficulty}):
      ${scoringCriteria[difficulty]}
      
      Evaluation Guidelines:
      - Technical accuracy (40%)
      - Completeness and depth (30%)
      - Code quality/best practices (20%)
      - Clarity and communication (10%)
      
      Return response in JSON format:
      {
        "score": 85,
        "feedback": "Detailed constructive feedback...",
        "strengths": ["strength1", "strength2"],
        "improvements": ["area1", "area2"]
      }
    `;
  }

  // Build prompt for candidate summary
  buildSummaryPrompt(answers, finalScore) {
    const answersText = answers.map((a, i) => 
      `Q${i + 1} (${a.difficulty}): Score ${a.score}/100 - ${a.answer.substring(0, 100)}...`
    ).join('\n');

    return `
      Generate a professional summary for a candidate based on their technical interview performance.
      
      FINAL SCORE: ${finalScore}/100
      
      QUESTION ANSWERS:
      ${answersText}
      
      Requirements:
      - Be objective and professional
      - Highlight strengths and areas for improvement
      - Focus on technical capabilities
      - Keep it concise (2-3 sentences)
      - Suitable for hiring managers
      
      Return only the summary text, no JSON format.
    `;
  }

  // Parse AI response for question generation
  parseQuestionResponse(response, index, difficulty) {
    try {
      const parsed = JSON.parse(response);
      return {
        id: `question_${index}_${Date.now()}`,
        text: parsed.text,
        difficulty: difficulty,
        index: index,
        category: parsed.category || 'general',
        type: parsed.type || 'technical'
      };
    } catch (error) {
      console.error('Error parsing question response:', error);
      return this.generateMockQuestion(index, difficulty);
    }
  }

  // Parse AI response for evaluation
  parseEvaluationResponse(response) {
    try {
      const parsed = JSON.parse(response);
      return {
        score: Math.max(0, Math.min(100, parsed.score)),
        feedback: parsed.feedback || 'No specific feedback provided.',
        strengths: parsed.strengths || [],
        improvements: parsed.improvements || []
      };
    } catch (error) {
      console.error('Error parsing evaluation response:', error);
      return this.generateMockEvaluation();
    }
  }

  // Parse AI response for summary
  parseSummaryResponse(response) {
    return response.trim();
  }

  // Mock question generator for development
  generateMockQuestion(index, difficulty) {
    const questions = {
      easy: [
        "Explain the difference between functional components and class components in React. When would you use each?",
        "What is the virtual DOM in React and how does it improve performance compared to direct DOM manipulation?",
        "How does JavaScript's event loop work, and why is it important for understanding asynchronous programming?",
        "What are React hooks? Explain useState and useEffect with examples of when you would use them.",
        "Describe the box model in CSS and how box-sizing property affects it."
      ],
      medium: [
        "How would you implement state management in a large React application? Discuss the trade-offs between Context API, Redux, and other state management solutions.",
        "Explain the concept of 'lifting state up' in React. Provide a practical example where this pattern would be useful.",
        "What are React's key props and why are they important for list rendering performance?",
        "How would you optimize a React application's performance? Discuss specific techniques like code splitting, memoization, and lazy loading.",
        "Explain RESTful API design principles. How would you structure endpoints for a blog application with users, posts, and comments?"
      ],
      hard: [
        "Design a real-time collaborative editing feature (like Google Docs) for a web application. Discuss the architecture, technologies, and challenges you would face.",
        "How would you implement server-side rendering with React? Discuss the benefits, challenges, and when you would choose SSR over client-side rendering.",
        "Explain microservices architecture vs monolithic architecture. What factors would influence your decision between them for a new project?",
        "Describe how you would handle authentication and authorization in a secure web application. Discuss JWT, sessions, and security best practices.",
        "How would you design a scalable WebSocket service for real-time features? Discuss load balancing, connection management, and fault tolerance."
      ]
    };

    const questionPool = questions[difficulty] || questions.easy;
    const questionIndex = (index + Math.floor(Date.now() / 10000)) % questionPool.length;
    
    const categories = {
      easy: ['react-basics', 'javascript', 'html-css'],
      medium: ['react-advanced', 'state-management', 'api-design'],
      hard: ['system-design', 'architecture', 'scalability']
    };

    return {
      id: `mock_question_${index}_${Date.now()}`,
      text: questionPool[questionIndex],
      difficulty: difficulty,
      index: index,
      category: categories[difficulty]?.[index % categories[difficulty].length] || 'general',
      type: 'technical'
    };
  }

  // Mock evaluation generator for development
  generateMockEvaluation(question, answer, difficulty) {
    // Generate realistic score based on answer length and content
    const baseScore = difficulty === 'easy' ? 75 : difficulty === 'medium' ? 65 : 55;
    const lengthBonus = Math.min(answer.length / 50, 20); // Up to 20 points for detailed answers
    const contentBonus = answer.includes('React') || answer.includes('JavaScript') ? 10 : 0;
    const randomVariation = Math.random() * 20 - 10; // ±10 points random variation
    
    const score = Math.max(0, Math.min(100, baseScore + lengthBonus + contentBonus + randomVariation));

    const feedbackTemplates = {
      good: [
        "Excellent answer! You demonstrated strong understanding of the concept with clear examples.",
        "Well explained with good technical depth. Your answer shows practical experience.",
        "Comprehensive response covering all key aspects. Good use of terminology and examples."
      ],
      average: [
        "Good overall understanding but could benefit from more specific examples or deeper explanation.",
        "You've covered the basics well. Consider expanding on implementation details and edge cases.",
        "Solid foundation shown. To improve, focus on providing more concrete code examples."
      ],
      poor: [
        "Basic understanding shown but needs more depth. Consider reviewing the fundamental concepts.",
        "Answer lacks specific details and examples. Practice explaining concepts with code snippets.",
        "You're on the right track but need to deepen your understanding of this topic."
      ]
    };

    let feedbackType = 'good';
    if (score < 60) feedbackType = 'poor';
    else if (score < 80) feedbackType = 'average';

    const feedbackOptions = feedbackTemplates[feedbackType];
    const feedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];

    return {
      score: Math.round(score),
      feedback: feedback,
      strengths: ['Technical understanding', 'Communication skills'],
      improvements: ['Could use more specific examples', 'Consider edge cases']
    };
  }

  // Mock summary generator for development
  generateMockSummary(answers, finalScore) {
    const strengths = answers.filter(a => a.score >= 70).length;
    const weaknesses = answers.filter(a => a.score < 60).length;

    if (finalScore >= 80) {
      return `Candidate demonstrated excellent technical skills with strong performance across ${strengths} out of ${answers.length} questions. Shows deep understanding of full-stack development concepts, particularly in React and system architecture. Would be a strong addition to any development team.`;
    } else if (finalScore >= 60) {
      return `Candidate showed good technical competency with solid understanding of core concepts. Performed well in ${strengths} areas while showing some gaps in ${weaknesses} topics. Has a good foundation and learning potential for further development.`;
    } else {
      return `Candidate displayed basic understanding of technical concepts but requires significant improvement in ${weaknesses} key areas. Recommended to focus on fundamental programming concepts and gain more hands-on experience with React and Node.js development.`;
    }
  }

  // Clear question cache (useful for generating new questions)
  clearCache() {
    questionCache.clear();
  }

  // Get service status
  getStatus() {
    return {
      isMockMode: this.isMockMode,
      cacheSize: questionCache.size,
      config: {
        model: AI_SERVICE_CONFIG.model,
        hasApiKey: !!AI_SERVICE_CONFIG.apiKey
      }
    };
  }
}

// Create and export singleton instance
const aiService = new AIService();
export default aiService;

// Export individual functions for convenience
export const generateQuestion = (index, difficulty) => aiService.generateQuestion(index, difficulty);
export const evaluateAnswer = (question, answer, difficulty) => aiService.evaluateAnswer(question, answer, difficulty);
export const generateSummary = (answers, finalScore) => aiService.generateSummary(answers, finalScore);