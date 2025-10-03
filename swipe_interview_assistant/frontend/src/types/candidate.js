/**
 * Candidate-related type definitions
 * Using JSDoc for type annotations in JavaScript
 */

/**
 * @typedef {Object} Candidate
 * @property {string} id - Unique identifier
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} email - Email address
 * @property {string} [phone] - Phone number (optional)
 * @property {string} [position] - Applied position
 * @property {string} [source] - How candidate applied (direct, referral, agency, campus)
 * @property {CandidateStatus} status - Current application status
 * @property {string} appliedDate - ISO date string when candidate applied
 * @property {string} [lastContactDate] - ISO date string of last contact
 * @property {CandidateResume} [resume] - Resume information
 * @property {string[]} skills - Array of skills
 * @property {number} [rating] - Overall rating (0-5)
 * @property {string} [notes] - Internal notes
 * @property {InterviewSummary[]} interviews - Array of interview summaries
 * @property {CandidateTimelineEvent[]} timeline - Timeline of candidate events
 * @property {CandidateMetadata} metadata - Additional metadata
 */

/**
 * @typedef {'new' | 'screening' | 'interview' | 'final' | 'offer' | 'hired' | 'rejected' | 'withdrawn'} CandidateStatus
 */

/**
 * @typedef {Object} CandidateResume
 * @property {string} id - Resume ID
 * @property {string} fileName - Original file name
 * @property {string} fileType - File type (pdf, doc, docx)
 * @property {number} fileSize - File size in bytes
 * @property {string} uploadedAt - ISO date string
 * @property {string} [parsedText] - Extracted text from resume
 * @property {ResumeAnalysis} [analysis] - Resume analysis data
 */

/**
 * @typedef {Object} ResumeAnalysis
 * @property {number} completenessScore - Resume completeness score (0-100)
 * @property {string} experienceLevel - Estimated experience level
 * @property {SkillMatch[]} skillMatches - Skills matched to job requirements
 * @property {string[]} redFlags - Potential concerns
 * @property {string[]} recommendations - Improvement suggestions
 * @property {number} yearsOfExperience - Estimated years of experience
 * @property {string[]} certifications - Found certifications
 * @property {Education[]} education - Education history
 */

/**
 * @typedef {Object} SkillMatch
 * @property {string} skill - Skill name
 * @property {number} relevance - Relevance score (0-1)
 * @property {'primary' | 'secondary' | 'bonus'} level - Importance level
 * @property {boolean} verified - Whether skill was verified in interview
 */

/**
 * @typedef {Object} Education
 * @property {string} institution - School/University name
 * @property {string} degree - Degree obtained
 * @property {string} field - Field of study
 * @property {number} graduationYear - Year of graduation
 * @property {string} [gpa] - GPA if provided
 */

/**
 * @typedef {Object} InterviewSummary
 * @property {string} id - Interview ID
 * @property {string} type - Interview type (technical, behavioral, cultural)
 * @property {string} date - ISO date string
 * @property {number} duration - Duration in minutes
 * @property {number} score - Overall score (0-100)
 * @property {string} interviewer - Interviewer name
 * @property {string} status - Interview status
 * @property {string} [feedback] - Overall feedback
 */

/**
 * @typedef {Object} CandidateTimelineEvent
 * @property {string} id - Event ID
 * @property {TimelineEventType} type - Type of event
 * @property {string} date - ISO date string
 * @property {string} title - Event title
 * @property {string} description - Event description
 * @property {string} [interviewId] - Associated interview ID
 * @property {string} [userId] - User who performed the action
 * @property {Object} [metadata] - Additional event data
 */

/**
 * @typedef {'applied' | 'screened' | 'interview_scheduled' | 'interview_completed' | 'feedback_received' | 'offer_sent' | 'offer_accepted' | 'offer_rejected' | 'rejected' | 'withdrawn' | 'note_added' | 'resume_uploaded'} TimelineEventType
 */

/**
 * @typedef {Object} CandidateMetadata
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 * @property {string} [deletedAt] - ISO date string if soft deleted
 * @property {string} createdBy - User ID who created the candidate
 * @property {string} [updatedBy] - User ID who last updated
 * @property {Object} [customFields] - Custom field values
 * @property {string[]} tags - Candidate tags
 */

/**
 * @typedef {Object} CandidateFilters
 * @property {string} [search] - Search query
 * @property {CandidateStatus[]} [status] - Filter by status
 * @property {string[]} [skills] - Filter by skills
 * @property {string} [position] - Filter by position
 * @property {string} [source] - Filter by source
 * @property {DateRange} [appliedDate] - Filter by applied date range
 * @property {number} [minRating] - Minimum rating
 * @property {string[]} [tags] - Filter by tags
 */

/**
 * @typedef {Object} DateRange
 * @property {string} [from] - Start date (ISO string)
 * @property {string} [to] - End date (ISO string)
 */

/**
 * @typedef {Object} CandidatePagination
 * @property {number} page - Current page (1-based)
 * @property {number} pageSize - Items per page
 * @property {number} totalCount - Total number of items
 * @property {number} totalPages - Total number of pages
 */

/**
 * @typedef {Object} CandidatesState
 * @property {Candidate[]} list - Array of candidates
 * @property {Candidate | null} selectedCandidate - Currently selected candidate
 * @property {CandidateFilters} filters - Current filters
 * @property {CandidatePagination} pagination - Pagination info
 * @property {boolean} loading - Loading state
 * @property {string | null} error - Error message
 * @property {CandidatesAnalytics} analytics - Analytics data
 */

/**
 * @typedef {Object} CandidatesAnalytics
 * @property {number} totalCandidates - Total number of candidates
 * @property {number} hiredCount - Number of hired candidates
 * @property {number} rejectedCount - Number of rejected candidates
 * @property {number} averageRating - Average candidate rating
 * @property {Object.<string, number>} statusDistribution - Count by status
 * @property {Object.<string, number>} skillsDistribution - Count by skill
 * @property {Object.<string, number>} sourceDistribution - Count by source
 * @property {number} averageTimeToHire - Average days to hire
 */

// Export types for use in JSDoc
export const CandidateTypes = {
  Candidate: /** @type {Candidate} */ ({}),
  CandidateStatus: /** @type {CandidateStatus} */ (''),
  CandidateFilters: /** @type {CandidateFilters} */ ({}),
  CandidatesState: /** @type {CandidatesState} */ ({})
};

export default CandidateTypes;