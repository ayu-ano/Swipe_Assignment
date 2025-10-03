/**
 * Question-related type definitions
 */

/**
 * @typedef {Object} Question
 * @property {string} id - Unique question identifier
 * @property {string} text - Question text
 * @property {QuestionType} type - Type of question
 * @property {QuestionDifficulty} difficulty - Difficulty level
 * @property {string} category - Question category
 * @property {string[]} tags - Question tags for filtering
 * @property {number} timeLimit - Time limit in seconds
 * @property {string} [hint] - Optional hint for candidate
 * @property {string} expectedAnswer - Expected answer guidelines
 * @property {string[]} keywords - Keywords for answer evaluation
 * @property {QuestionExample[]} examples - Example answers
 * @property {QuestionEvaluationCriteria} evaluationCriteria - How to evaluate answers
 * @property {number} weight - Question weight in overall score (1-10)
 * @property {boolean} isActive - Whether question is active
 * @property {string} createdBy - User ID who created question
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 * @property {QuestionStatistics} statistics - Usage and performance statistics
 */

/**
 * @typedef {'technical' | 'behavioral' | 'problem_solving' | 'system_design' | 'cultural' | 'leadership' | 'analytical'} QuestionType
 */

/**
 * @typedef {'easy' | 'medium' | 'hard'} QuestionDifficulty
 */

/**
 * @typedef {Object} QuestionExample
 * @property {string} answer - Example answer text
 * @property {number} score - Score for this example (0-10)
 * @property {string} feedback - Feedback for this example
 * @property {'excellent' | 'good' | 'average' | 'poor'} rating - Overall rating
 */

/**
 * @typedef {Object} QuestionEvaluationCriteria
 * @property {EvaluationDimension[]} dimensions - Evaluation dimensions
 * @property {number} maxScore - Maximum possible score
 * @property {string} scoringRubric - Scoring guidelines
 * @property {string[]} redFlags - Phrases that indicate poor answers
 * @property {string[]} greenFlags - Phrases that indicate good answers
 */

/**
 * @typedef {Object} EvaluationDimension
 * @property {string} name - Dimension name (e.g., "Technical Accuracy")
 * @property {string} description - Dimension description
 * @property {number} weight - Weight in overall score (0-1)
 * @property {string[]} indicators - What to look for in answers
 */

/**
 * @typedef {Object} QuestionStatistics
 * @property {number} timesUsed - How many times question was used
 * @property {number} averageScore - Average score candidates get
 * @property {number} averageTimeSpent - Average time spent in seconds
 * @property {number} discriminationIndex - How well question discriminates skill levels
 * @property {Object.<string, number>} difficultyBreakdown - Scores by candidate level
 * @property {string[]} commonFeedback - Common feedback points
 * @property {number} skipRate - How often question is skipped
 */

/**
 * @typedef {Object} QuestionBank
 * @property {string} id - Question bank ID
 * @property {string} name - Question bank name
 * @property {string} description - Question bank description
 * @property {QuestionType} focusType - Primary question type
 * @property {string[]} skillsCovered - Skills covered by this bank
 * @property {Question[]} questions - Questions in the bank
 * @property {QuestionBankSettings} settings - Bank settings
 * @property {string} createdBy - User ID who created bank
 * @property {string} createdAt - ISO date string
 * @property {boolean} isPublic - Whether bank is publicly available
 * @property {string[]} allowedUsers - Users with access to this bank
 */

/**
 * @typedef {Object} QuestionBankSettings
 * @property {boolean} allowDuplicates - Allow duplicate questions
 * @property {number} maxQuestionsPerInterview - Maximum questions per interview
 * @property {string[]} requiredApprovals - Users who must approve new questions
 * @property {boolean} autoApprove - Auto-approve new questions
 * @property {string} defaultDifficulty - Default difficulty for new questions
 */

/**
 * @typedef {Object} QuestionGenerationRequest
 * @property {string[]} skills - Required skills
 * @property {QuestionType} type - Question type
 * @property {QuestionDifficulty} difficulty - Difficulty level
 * @property {number} count - Number of questions to generate
 * @property {string} [context] - Additional context for generation
 * @property {string[]} [excludeQuestions] - Question IDs to exclude
 * @property {boolean} [includeExamples] - Whether to include example answers
 */

/**
 * @typedef {Object} QuestionGenerationResponse
 * @property {GeneratedQuestion[]} questions - Generated questions
 * @property {string} generationId - Unique generation ID
 * @property {number} totalGenerated - Total questions generated
 * @property {Object} metadata - Generation metadata
 */

/**
 * @typedef {Object} GeneratedQuestion
 * @property {string} id - Generated question ID
 * @property {string} text - Question text
 * @property {QuestionType} type - Question type
 * @property {QuestionDifficulty} difficulty - Difficulty level
 * @property {string} category - Question category
 * @property {string} expectedAnswer - Expected answer
 * @property {string[]} keywords - Evaluation keywords
 * @property {number} confidence - AI confidence score (0-1)
 * @property {string} [reasoning] - AI reasoning for question choice
 */

/**
 * @typedef {Object} QuestionEvaluationRequest
 * @property {string} questionId - Question ID
 * @property {string} answer - Candidate's answer
 * @property {number} timeSpent - Time spent in seconds
 * @property {string} [context] - Additional context for evaluation
 * @property {boolean} [detailedFeedback] - Whether to provide detailed feedback
 */

/**
 * @typedef {Object} QuestionEvaluationResponse
 * @property {string} evaluationId - Evaluation ID
 * @property {number} score - Overall score (0-10)
 * @property {string} feedback - General feedback
 * @property {DimensionScore[]} dimensionScores - Scores by dimension
 * @property {string[]} strengths - What candidate did well
 * @property {string[]} improvements - Areas for improvement
 * @property {'excellent' | 'good' | 'average' | 'poor' | 'unanswered'} rating - Overall rating
 * @property {number} confidence - AI confidence in evaluation (0-1)
 * @property {string} [aiFeedback] - Detailed AI-generated feedback
 */

/**
 * @typedef {Object} DimensionScore
 * @property {string} dimension - Dimension name
 * @property {number} score - Dimension score (0-10)
 * @property {string} feedback - Dimension-specific feedback
 * @property {string[]} evidence - Supporting evidence from answer
 */

/**
 * @typedef {Object} QuestionsState
 * @property {Question[]} all - All available questions
 * @property {QuestionBank[]} banks - Question banks
 * @property {QuestionFilters} filters - Current filters
 * @property {Question | null} selectedQuestion - Currently selected question
 * @property {boolean} loading - Loading state
 * @property {string | null} error - Error message
 * @property {QuestionGenerationState} generation - Question generation state
 * @property {QuestionsAnalytics} analytics - Questions analytics
 */

/**
 * @typedef {Object} QuestionFilters
 * @property {QuestionType[]} [types] - Filter by question types
 * @property {QuestionDifficulty[]} [difficulties] - Filter by difficulties
 * @property {string[]} [categories] - Filter by categories
 * @property {string[]} [tags] - Filter by tags
 * @property {string} [search] - Search query
 * @property {string} [bankId] - Filter by question bank
 * @property {boolean} [activeOnly] - Show only active questions
 */

/**
 * @typedef {Object} QuestionGenerationState
 * @property {boolean} generating - Whether generation is in progress
 * @property {GeneratedQuestion[]} generated - Generated questions
 * @property {string | null} error - Generation error
 * @property {number} progress - Generation progress (0-100)
 */

/**
 * @typedef {Object} QuestionsAnalytics
 * @property {number} totalQuestions - Total number of questions
 * @property {number} activeQuestions - Number of active questions
 * @property {Object.<string, number>} typeDistribution - Count by type
 * @property {Object.<string, number>} difficultyDistribution - Count by difficulty
 * @property {Object.<string, number>} categoryDistribution - Count by category
 * @property {Question[]} mostUsed - Most frequently used questions
 * @property {Question[]} bestDiscriminators - Questions with highest discrimination
 * @property {number} averageQualityScore - Average question quality score
 */

/**
 * @typedef {Object} QuestionImport
 * @property {string} id - Import ID
 * @property {string} fileName - Original file name
 * @property {number} totalQuestions - Total questions in import
 * @property {number} importedCount - Successfully imported count
 * @property {number} failedCount - Failed imports count
 * @property {QuestionImportStatus} status - Import status
 * @property {string} createdAt - ISO date string
 * @property {string} [completedAt] - ISO date string when completed
 * @property {QuestionImportError[]} errors - Import errors
 */

/**
 * @typedef {'pending' | 'processing' | 'completed' | 'failed' | 'partial'} QuestionImportStatus
 */

/**
 * @typedef {Object} QuestionImportError
 * @property {number} line - Line number in import file
 * @property {string} question - Question text
 * @property {string} error - Error message
 * @property {string} [field] - Field that caused error
 */

// Export types for use in JSDoc
export const QuestionTypes = {
  Question: /** @type {Question} */ ({}),
  QuestionType: /** @type {QuestionType} */ (''),
  QuestionDifficulty: /** @type {QuestionDifficulty} */ (''),
  QuestionsState: /** @type {QuestionsState} */ ({}),
  QuestionEvaluationResponse: /** @type {QuestionEvaluationResponse} */ ({})
};

export default QuestionTypes;