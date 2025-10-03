// State Migrations for Redux Persist
// Handles state structure changes between app versions

// Current state version - increment when making breaking changes
export const CURRENT_STATE_VERSION = 3;

// Migration definitions
export const migrations = {
  // Migration from version 0 to 1
  1: (state) => {
    console.log('Applying migration from version 0 to 1...');
    
    const migratedState = { ...state };
    
    // Interview state restructuring
    if (migratedState.interview) {
      // Convert old single session to sessions array
      if (migratedState.interview.currentInterview && !migratedState.interview.sessions) {
        migratedState.interview = {
          ...migratedState.interview,
          sessions: migratedState.interview.currentInterview ? [migratedState.interview.currentInterview] : [],
          currentSession: migratedState.interview.currentInterview || null,
          currentSessionId: migratedState.interview.currentInterview?.id || null
        };
        
        // Remove old property
        delete migratedState.interview.currentInterview;
      }
      
      // Add missing properties with default values
      if (!migratedState.interview.sessions) {
        migratedState.interview.sessions = [];
      }
      
      if (!migratedState.interview.filters) {
        migratedState.interview.filters = {
          status: 'all',
          difficulty: 'all',
          dateRange: 'all'
        };
      }
    }
    
    // Candidate state restructuring
    if (migratedState.candidate) {
      // Convert candidates array to normalized structure
      if (Array.isArray(migratedState.candidate) && !migratedState.candidate.list) {
        migratedState.candidate = {
          list: migratedState.candidate,
          selectedCandidate: null,
          filters: {
            status: 'all',
            searchQuery: '',
            sortBy: 'date',
            sortOrder: 'desc'
          },
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalCount: migratedState.candidate.length
          }
        };
      }
      
      // Ensure all candidates have required fields
      if (migratedState.candidate.list) {
        migratedState.candidate.list = migratedState.candidate.list.map(candidate => ({
          id: candidate.id || `candidate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: candidate.name || 'Unknown Candidate',
          email: candidate.email || '',
          status: candidate.status || 'new',
          appliedDate: candidate.appliedDate || new Date().toISOString(),
          resume: candidate.resume || null,
          interviews: candidate.interviews || [],
          skills: candidate.skills || [],
          rating: candidate.rating || 0,
          notes: candidate.notes || '',
          ...candidate
        }));
      }
    }
    
    // Resume state enhancements
    if (migratedState.resume) {
      if (migratedState.resume.data && !migratedState.resume.resumeData) {
        migratedState.resume = {
          ...migratedState.resume,
          resumeData: migratedState.resume.data,
          parsedData: migratedState.resume.parsedData || migratedState.resume.data,
          fileInfo: migratedState.resume.fileInfo || {
            fileName: 'unknown',
            fileType: 'unknown',
            fileSize: 0,
            uploadedAt: new Date().toISOString()
          }
        };
        
        delete migratedState.resume.data;
      }
      
      // Add validation structure
      if (!migratedState.resume.validation) {
        migratedState.resume.validation = {
          isValid: false,
          errors: {},
          missingFields: []
        };
      }
    }
    
    // UI state restructuring
    if (migratedState.ui) {
      // Add missing UI properties
      if (!migratedState.ui.modals) {
        migratedState.ui.modals = {
          welcomeBack: { isOpen: false, data: null },
          missingFields: { isOpen: false, data: null },
          interviewSummary: { isOpen: false, data: null },
          confirmation: { isOpen: false, title: '', message: '', onConfirm: null, onCancel: null },
          settings: { isOpen: false }
        };
      }
      
      if (!migratedState.ui.loading) {
        migratedState.ui.loading = {
          global: false,
          resumeUpload: false,
          aiProcessing: false,
          questionGeneration: false,
          evaluation: false,
          candidateSearch: false
        };
      }
      
      if (!migratedState.ui.notifications) {
        migratedState.ui.notifications = {
          items: [],
          position: 'top-right',
          autoHideDuration: 5000
        };
      }
      
      if (!migratedState.ui.preferences) {
        migratedState.ui.preferences = {
          theme: 'light',
          sidebarCollapsed: false,
          compactMode: false,
          animationsEnabled: true,
          fontSize: 'medium',
          highContrast: false
        };
      }
      
      // Migrate old theme property
      if (migratedState.ui.theme && !migratedState.ui.preferences.theme) {
        migratedState.ui.preferences.theme = migratedState.ui.theme;
        delete migratedState.ui.theme;
      }
    }
    
    console.log('Migration to version 1 completed');
    return migratedState;
  },

  // Migration from version 1 to 2
  2: (state) => {
    console.log('Applying migration from version 1 to 2...');
    
    const migratedState = { ...state };
    
    // Interview session enhancements
    if (migratedState.interview?.sessions) {
      migratedState.interview.sessions = migratedState.interview.sessions.map(session => ({
        // Add new fields with defaults
        version: 2,
        metadata: {
          createdAt: session.createdAt || session.metadata?.createdAt || new Date().toISOString(),
          updatedAt: session.updatedAt || session.metadata?.updatedAt || new Date().toISOString(),
          completedAt: session.completedAt || session.metadata?.completedAt || null,
          totalDuration: session.totalDuration || session.metadata?.totalDuration || 0,
          ...session.metadata
        },
        evaluation: session.evaluation || {
          overallScore: 0,
          technicalScore: 0,
          communicationScore: 0,
          problemSolvingScore: 0,
          feedback: '',
          strengths: [],
          improvements: [],
          recommendations: 'none' // 'hire' | 'maybe' | 'reject' | 'none'
        },
        // Preserve existing data
        ...session,
        // Ensure questions have proper structure
        questions: (session.questions || []).map(question => ({
          id: question.id || `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: question.text || question.question || '',
          type: question.type || 'technical',
          difficulty: question.difficulty || 'medium',
          timeLimit: question.timeLimit || 180, // 3 minutes default
          answer: question.answer || '',
          evaluation: question.evaluation || {
            score: 0,
            feedback: '',
            timeliness: 'average' // 'fast' | 'average' | 'slow'
          },
          startedAt: question.startedAt || null,
          completedAt: question.completedAt || null,
          ...question
        }))
      }));
    }
    
    // Candidate analytics addition
    if (migratedState.candidate) {
      if (!migratedState.candidate.analytics) {
        migratedState.candidate.analytics = {
          totalCandidates: migratedState.candidate.list?.length || 0,
          hiredCount: migratedState.candidate.list?.filter(c => c.status === 'hired')?.length || 0,
          rejectedCount: migratedState.candidate.list?.filter(c => c.status === 'rejected')?.length || 0,
          averageRating: calculateAverageRating(migratedState.candidate.list || []),
          skillsDistribution: calculateSkillsDistribution(migratedState.candidate.list || [])
        };
      }
      
      // Add interview history to candidates
      if (migratedState.candidate.list) {
        migratedState.candidate.list = migratedState.candidate.list.map(candidate => ({
          ...candidate,
          interviewHistory: candidate.interviewHistory || candidate.interviews || [],
          lastInterviewDate: candidate.lastInterviewDate || 
            (candidate.interviews?.length > 0 ? candidate.interviews[candidate.interviews.length - 1]?.date : null),
          totalInterviews: candidate.totalInterviews || candidate.interviews?.length || 0
        }));
      }
    }
    
    // Resume parsing improvements
    if (migratedState.resume) {
      if (!migratedState.resume.analysis) {
        migratedState.resume.analysis = {
          completenessScore: 0,
          skillMatch: [],
          experienceLevel: 'unknown', // 'junior' | 'mid' | 'senior' | 'expert' | 'unknown'
          redFlags: [],
          recommendations: []
        };
      }
      
      // Calculate completeness score if we have resume data
      if (migratedState.resume.resumeData) {
        migratedState.resume.analysis.completenessScore = 
          calculateResumeCompleteness(migratedState.resume.resumeData);
      }
    }
    
    // UI notifications enhancement
    if (migratedState.ui?.notifications?.items) {
      migratedState.ui.notifications.items = migratedState.ui.notifications.items.map(notification => ({
        ...notification,
        type: notification.type || 'info', // 'info' | 'success' | 'warning' | 'error'
        priority: notification.priority || 'normal', // 'low' | 'normal' | 'high'
        actions: notification.actions || [],
        expiresAt: notification.expiresAt || null
      }));
    }
    
    console.log('Migration to version 2 completed');
    return migratedState;
  },

  // Migration from version 2 to 3
  3: (state) => {
    console.log('Applying migration from version 2 to 3...');
    
    const migratedState = { ...state };
    
    // Add AI model configuration
    if (migratedState.interview) {
      if (!migratedState.interview.aiConfig) {
        migratedState.interview.aiConfig = {
          model: 'gpt-4', // Default model
          temperature: 0.7,
          maxTokens: 1000,
          evaluationStrictness: 'medium', // 'easy' | 'medium' | 'strict'
          questionDepth: 'balanced' // 'basic' | 'balanced' | 'deep'
        };
      }
      
      // Add session templates
      if (!migratedState.interview.templates) {
        migratedState.interview.templates = {
          technical: {
            name: 'Technical Screening',
            description: 'Standard technical skills assessment',
            questionCount: 6,
            timeLimit: 1800, // 30 minutes
            difficulty: 'mixed',
            categories: ['programming', 'algorithms', 'system-design']
          },
          behavioral: {
            name: 'Behavioral Interview',
            description: 'Cultural fit and soft skills assessment',
            questionCount: 5,
            timeLimit: 1500, // 25 minutes
            difficulty: 'medium',
            categories: ['teamwork', 'communication', 'problem-solving']
          }
        };
      }
    }
    
    // Candidate status refinement
    if (migratedState.candidate?.list) {
      migratedState.candidate.list = migratedState.candidate.list.map(candidate => ({
        ...candidate,
        // Normalize status values
        status: normalizeCandidateStatus(candidate.status),
        // Add sourcing information
        source: candidate.source || 'direct', // 'direct' | 'referral' | 'agency' | 'campus'
        // Add timeline events
        timeline: candidate.timeline || [
          {
            event: 'applied',
            date: candidate.appliedDate,
            notes: 'Candidate applied for position'
          }
        ]
      }));
    }
    
    // Enhanced resume parsing with multiple versions
    if (migratedState.resume) {
      if (!migratedState.resume.versions) {
        migratedState.resume.versions = migratedState.resume.resumeData ? [{
          id: 'v1',
          data: migratedState.resume.resumeData,
          parsedAt: migratedState.resume.fileInfo?.uploadedAt || new Date().toISOString(),
          version: 1
        }] : [];
      }
      
      // Add parsing quality metrics
      if (!migratedState.resume.metrics) {
        migratedState.resume.metrics = {
          confidence: migratedState.resume.analysis?.completenessScore || 0,
          parsingTime: 0,
          fieldsExtracted: Object.keys(migratedState.resume.resumeData || {}).length,
          accuracyScore: 0.8 // Default accuracy
        };
      }
    }
    
    // UI accessibility enhancements
    if (migratedState.ui?.preferences) {
      migratedState.ui.preferences = {
        ...migratedState.ui.preferences,
        reducedMotion: migratedState.ui.preferences.reducedMotion || false,
        highContrast: migratedState.ui.preferences.highContrast || false,
        largeText: migratedState.ui.preferences.largeText || false,
        screenReader: migratedState.ui.preferences.screenReader || false
      };
    }
    
    console.log('Migration to version 3 completed');
    return migratedState;
  }
};

// Helper functions for migrations
const calculateAverageRating = (candidates) => {
  const ratedCandidates = candidates.filter(c => c.rating && c.rating > 0);
  if (ratedCandidates.length === 0) return 0;
  
  const total = ratedCandidates.reduce((sum, candidate) => sum + candidate.rating, 0);
  return Math.round((total / ratedCandidates.length) * 10) / 10;
};

const calculateSkillsDistribution = (candidates) => {
  const distribution = {};
  
  candidates.forEach(candidate => {
    candidate.skills?.forEach(skill => {
      distribution[skill] = (distribution[skill] || 0) + 1;
    });
  });
  
  return distribution;
};

const calculateResumeCompleteness = (resumeData) => {
  const requiredFields = ['name', 'email', 'skills', 'experience'];
  const optionalFields = ['phone', 'education', 'summary', 'location', 'projects'];
  
  const requiredPresent = requiredFields.filter(field => 
    resumeData[field] && 
    (Array.isArray(resumeData[field]) ? resumeData[field].length > 0 : resumeData[field].toString().trim().length > 0)
  ).length;
  
  const optionalPresent = optionalFields.filter(field => 
    resumeData[field] && 
    (Array.isArray(resumeData[field]) ? resumeData[field].length > 0 : resumeData[field].toString().trim().length > 0)
  ).length;
  
  const requiredScore = (requiredPresent / requiredFields.length) * 70;
  const optionalScore = (optionalPresent / optionalFields.length) * 30;
  
  return Math.min(100, Math.round(requiredScore + optionalScore));
};

const normalizeCandidateStatus = (oldStatus) => {
  const statusMap = {
    'new': 'new',
    'reviewed': 'reviewed',
    'phone_screen': 'screening',
    'technical_interview': 'interview',
    'final_round': 'final',
    'offer_pending': 'offer',
    'hired': 'hired',
    'rejected': 'rejected',
    'withdrawn': 'withdrawn'
  };
  
  return statusMap[oldStatus] || oldStatus;
};

// Migration manager
export class MigrationManager {
  constructor() {
    this.version = CURRENT_STATE_VERSION;
    this.migrations = migrations;
  }

  // Apply all necessary migrations
  async migrateState(state) {
    if (!state) return state;
    
    const persistedVersion = state._persist?.version || 0;
    
    if (persistedVersion === this.version) {
      console.log(`State is already at current version ${this.version}`);
      return state;
    }
    
    console.log(`Migrating state from version ${persistedVersion} to ${this.version}`);
    
    let migratedState = { ...state };
    
    // Apply each migration in sequence
    for (let version = persistedVersion + 1; version <= this.version; version++) {
      if (this.migrations[version]) {
        try {
          console.log(`Applying migration to version ${version}`);
          migratedState = this.migrations[version](migratedState);
          
          // Update version in persisted state
          if (migratedState._persist) {
            migratedState._persist.version = version;
          }
        } catch (error) {
          console.error(`Failed to apply migration to version ${version}:`, error);
          throw new Error(`Migration to version ${version} failed: ${error.message}`);
        }
      }
    }
    
    console.log('State migration completed successfully');
    return migratedState;
  }

  // Check if migration is needed
  needsMigration(state) {
    if (!state) return false;
    const persistedVersion = state._persist?.version || 0;
    return persistedVersion < this.version;
  }

  // Get migration info
  getMigrationInfo(state) {
    if (!state) return null;
    
    const persistedVersion = state._persist?.version || 0;
    const migrationsNeeded = [];
    
    for (let version = persistedVersion + 1; version <= this.version; version++) {
      if (this.migrations[version]) {
        migrationsNeeded.push(version);
      }
    }
    
    return {
      currentVersion: persistedVersion,
      targetVersion: this.version,
      migrationsNeeded,
      needsMigration: migrationsNeeded.length > 0
    };
  }

  // Create a backup before migration
  async createBackup(state) {
    const backup = {
      data: JSON.parse(JSON.stringify(state)),
      timestamp: new Date().toISOString(),
      version: state._persist?.version || 0
    };
    
    // Store backup in localStorage
    try {
      localStorage.setItem('crisp-interview-backup', JSON.stringify(backup));
      return true;
    } catch (error) {
      console.error('Failed to create backup:', error);
      return false;
    }
  }

  // Restore from backup
  async restoreBackup() {
    try {
      const backup = localStorage.getItem('crisp-interview-backup');
      if (backup) {
        return JSON.parse(backup);
      }
      return null;
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return null;
    }
  }
}

// Export singleton instance
export const migrationManager = new MigrationManager();

export default migrations;