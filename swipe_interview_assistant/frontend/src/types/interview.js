/**
 * Interview-related type definitions
 */

/**
 * @typedef {Object} Interview
 * @property {string} id - Unique interview identifier
 * @property {string} candidateId - Associated candidate ID
 * @property {string} title - Interview title
 * @property {InterviewType} type - Type of interview
 * @property {InterviewStatus} status - Current status
 * @property {string} scheduledAt - ISO date string of scheduled time
 * @property {number} duration - Planned duration in minutes
 * @property {string} [startedAt] - ISO date string when interview started
 * @property {string} [completedAt] - ISO date string when interview completed
 * @property {string} [recordingUrl] - URL to recording (if available)
 * @property {InterviewQuestion[]} questions - Array of questions
 * @property {InterviewEvaluation} [evaluation] - Overall evaluation
 * @property {string} interviewerId - ID of the interviewer
 * @property {string} [interviewerNotes] - Interviewer's private notes
 * @property {InterviewConfig} config - Interview configuration
 * @property {InterviewMetadata} metadata - Additional metadata
 */

/**
 * @typedef {'technical' | 'behavioral' | 'system_design' | 'cultural' | 'mixed'} InterviewType
 */

/**
 * @typedef {'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'} InterviewStatus
 */

/**
 * @typedef {Object} InterviewQuestion
 * @property {string} id - Question ID
 * @property {string} text - Question text
 * @property {QuestionType} type - Type of question
 * @property {QuestionDifficulty} difficulty - Difficulty level
 * @property {string} [category] - Question category
 * @property {number} timeLimit - Time limit in seconds
 * @property {string} [hint] - Optional hint for candidate
 * @property {string} [expectedAnswer] - Expected answer guidelines
 * @property {string} [answer] - Candidate's answer
 * @property {string} [startedAt] - When question was presented
 * @property {string} [completedAt] - When question was completed
 * @property {QuestionEvaluation} [evaluation] - Question evaluation
 * @property {number} [order] - Display order
 */

/**
 * @typedef {'technical' | 'behavioral' | 'problem_solving' | 'system_design' | 'cultural'} QuestionType
 */

/**
 * @typedef {'easy' | 'medium' | 'hard'} QuestionDifficulty
 */

/**
 * @typedef {Object} QuestionEvaluation
 * @property {number} score - Score (0-10)
 * @property {string} feedback - Detailed feedback
 * @property {string[]} strengths - What candidate did well
 * @property {string[]} improvements - Areas for improvement
 * @property {'excellent' | 'good' | 'average' | 'poor' | 'unanswered'} rating - Overall rating
 * @property {number} [timeSpent] - Time spent in seconds
 * @property {number} [relevanceScore] - How relevant answer was (0-1)
 * @property {string} [aiFeedback] - AI-generated feedback
 */

/**
 * @typedef {Object} InterviewEvaluation
 * @property {number} overallScore - Overall score (0-100)
 * @property {number} technicalScore - Technical skills score
 * @property {number} communicationScore - Communication skills score
 * @property {number} problemSolvingScore - Problem-solving score
 * @property {number} culturalFitScore - Cultural fit score
 * @property {string} summary - Overall summary
 * @property {string} strengths - Key strengths
 * @property {string} improvements - Areas for improvement
 * @property {'strong_hire' | 'hire' | 'no_hire' | 'strong_no_hire'} recommendation - Hiring recommendation
 * @property {string} detailedFeedback - Detailed feedback for candidate
 * @property {string} internalNotes - Private notes for hiring team
 * @property {SkillAssessment[]} skillAssessments - Skill-specific assessments
 */

/**
 * @typedef {Object} SkillAssessment
 * @property {string} skill - Skill name
 * @property {number} score - Skill score (0-10)
 * @property {string} evidence - Evidence from interview
 * @property {'novice' | 'intermediate' | 'advanced' | 'expert'} level - Skill level
 */

/**
 * @typedef {Object} InterviewConfig
 * @property {string} templateId - Interview template ID
 * @property {number} totalQuestions - Total number of questions
 * @property {boolean} allowRecording - Whether recording is allowed
 * @property {boolean} autoAdvance - Auto-advance to next question
 * @property {boolean} showTimer - Show timer to candidate
 * @property {boolean} allowPause - Allow pausing the interview
 * @property {number} breakTime - Break time between questions (seconds)
 * @property {AIConfig} aiConfig - AI evaluation configuration
 */

/**
 * @typedef {Object} AIConfig
 * @property {string} model - AI model to use
 * @property {number} temperature - Creativity level (0-1)
 * @property {number} maxTokens - Maximum response length
 * @property {'easy' | 'medium' | 'strict'} evaluationStrictness - Scoring strictness
 * @property {'basic' | 'balanced' | 'deep'} questionDepth - Question complexity
 * @property {boolean} realTimeFeedback - Provide real-time feedback
 */

/**
 * @typedef {Object} InterviewMetadata
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 * @property {string} createdBy - User ID who created
 * @property {string} [completedBy] - User ID who completed
 * @property {number} version - Interview version
 * @property {string} [timezone] - Interview timezone
 * @property {Object} [customFields] - Custom field values
 */

/**
 * @typedef {Object} InterviewSession
 * @property {string} id - Session ID
 * @property {string} interviewId - Associated interview ID
 * @property {string} candidateId - Candidate ID
 * @property {'waiting' | 'active' | 'paused' | 'completed' | 'cancelled'} status - Session status
 * @property {string} [startedAt] - When session started
 * @property {string} [endedAt] - When session ended
 * @property {number} totalDuration - Total duration in seconds
 * @property {string} currentQuestionId - Current question ID
 * @property {number} timeElapsed - Time elapsed in current question
 * @property {SessionStats} stats - Session statistics
 */

/**
 * @typedef {Object} SessionStats
 * @property {number} questionsCompleted - Number of completed questions
 * @property {number} totalQuestions - Total questions
 * @property {number} averageTimePerQuestion - Average time per question
 * @property {number} score - Current score
 * @property {number} completionPercentage - Progress percentage
 */

/**
 * @typedef {Object} InterviewTemplate
 * @property {string} id - Template ID
 * @property {string} name - Template name
 * @property {string} description - Template description
 * @property {InterviewType} type - Interview type
 * @property {QuestionDifficulty} defaultDifficulty - Default difficulty
 * @property {number} defaultDuration - Default duration in minutes
 * @property {TemplateQuestion[]} questions - Template questions
 * @property {string[]} requiredSkills - Required skills for this template
 * @property {boolean} isPublic - Whether template is publicly available
 * @property {string} createdBy - User ID who created template
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {Object} TemplateQuestion
 * @property {string} id - Question ID
 * @property {string} text - Question text
 * @property {QuestionType} type - Question type
 * @property {QuestionDifficulty} difficulty - Difficulty level
 * @property {string} category - Question category
 * @property {number} timeLimit - Time limit in seconds
 * @property {string} [hint] - Optional hint
 * @property {string} expectedAnswer - Expected answer guidelines
 * @property {string[]} keywords - Keywords for evaluation
 * @property {number} weight - Question weight in scoring
 */

/**
 * @typedef {Object} InterviewFilters
 * @property {InterviewStatus[]} [status] - Filter by status
 * @property {InterviewType[]} [type] - Filter by type
 * @property {string} [candidateId] - Filter by candidate
 * @property {string} [interviewerId] - Filter by interviewer
 * @property {DateRange} [scheduledDate] - Filter by scheduled date
 * @property {number} [minScore] - Minimum score
 * @property {string} [search] - Search query
 */

/**
 * @typedef {Object} InterviewsState
 * @property {Interview[]} sessions - Array of interviews
 * @property {Interview | null} currentSession - Currently active interview
 * @property {InterviewSession | null} sessionState - Current session state
 * @property {InterviewFilters} filters - Current filters
 * @property {boolean} loading - Loading state
 * @property {string | null} error - Error message
 * @property {InterviewAnalytics} analytics - Interview analytics
 * @property {InterviewTemplate[]} templates - Available templates
 */

/**
 * @typedef {Object} InterviewAnalytics
 * @property {number} totalInterviews - Total interviews conducted
 * @property {number} averageDuration - Average interview duration
 * @property {number} averageScore - Average interview score
 * @property {Object.<string, number>} statusDistribution - Count by status
 * @property {Object.<string, number>} typeDistribution - Count by type
 * @property {Object.<string, number>} difficultyDistribution - Count by difficulty
 * @property {number} completionRate - Interview completion rate
 */

// Export types for use in JSDoc
export const InterviewTypes = {
  Interview: /** @type {Interview} */ ({}),
  InterviewStatus: /** @type {InterviewStatus} */ (''),
  InterviewQuestion: /** @type {InterviewQuestion} */ ({}),
  InterviewEvaluation: /** @type {InterviewEvaluation} */ ({}),
  InterviewsState: /** @type {InterviewsState} */ ({})
};

export default InterviewTypes;