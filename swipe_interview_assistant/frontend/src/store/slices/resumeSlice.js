// Resume Slice for managing resume data and parsing state
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// Async thunks
export const parseResume = createAsyncThunk(
  'resume/parseResume',
  async (file, { rejectWithValue }) => {
    try {
      // Simulate resume parsing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock resume parsing - in real app, this would use actual parsing libraries
      const mockResumeData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        skills: ['React', 'JavaScript', 'Node.js', 'HTML', 'CSS', 'TypeScript'],
        experience: '5 years of full-stack development experience',
        education: 'Bachelor of Science in Computer Science',
        summary: 'Experienced full-stack developer with strong background in React and Node.js',
        location: 'San Francisco, CA'
      };
      
      // Simulate missing fields occasionally
      if (Math.random() > 0.7) {
        mockResumeData.phone = null;
      }
      if (Math.random() > 0.9) {
        mockResumeData.email = null;
      }
      
      return {
        ...mockResumeData,
        rawText: 'Mock resume text content...',
        fileType: file.type,
        fileName: file.name,
        fileSize: file.size,
        parsedAt: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue('Failed to parse resume file');
    }
  }
);

export const validateResumeFields = createAsyncThunk(
  'resume/validateResumeFields',
  async (resumeData, { rejectWithValue }) => {
    try {
      // Simulate validation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const errors = {};
      const missingFields = [];
      
      // Required field validation
      if (!resumeData.name || resumeData.name.trim().length < 2) {
        errors.name = 'Name is required and must be at least 2 characters';
        missingFields.push('name');
      }
      
      if (!resumeData.email || !/\S+@\S+\.\S+/.test(resumeData.email)) {
        errors.email = 'Valid email is required';
        missingFields.push('email');
      }
      
      if (!resumeData.skills || resumeData.skills.length === 0) {
        errors.skills = 'At least one skill is required';
        missingFields.push('skills');
      }
      
      if (!resumeData.experience || resumeData.experience.trim().length < 10) {
        errors.experience = 'Experience description is required';
        missingFields.push('experience');
      }
      
      return {
        isValid: missingFields.length === 0,
        errors,
        missingFields
      };
    } catch (error) {
      return rejectWithValue('Failed to validate resume fields');
    }
  }
);

export const updateResumeField = createAsyncThunk(
  'resume/updateResumeField',
  async ({ field, value }, { rejectWithValue }) => {
    try {
      // Simulate API call to update field
      await new Promise(resolve => setTimeout(resolve, 300));
      return { field, value };
    } catch (error) {
      return rejectWithValue(`Failed to update ${field}`);
    }
  }
);

const initialState = {
  resumeData: null,
  parsedData: null,
  validation: {
    isValid: false,
    errors: {},
    missingFields: []
  },
  parsingStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  validationStatus: 'idle',
  updateStatus: 'idle',
  uploadStatus: 'idle',
  error: null,
  lastUpdated: null,
  fileInfo: null
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearResumeData: (state) => {
      state.resumeData = null;
      state.parsedData = null;
      state.validation = {
        isValid: false,
        errors: {},
        missingFields: []
      };
      state.error = null;
      state.lastUpdated = null;
      state.fileInfo = null;
      state.uploadStatus = 'idle';
    },
    setResumeData: (state, action) => {
      state.resumeData = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    updateResumeData: (state, action) => {
      state.resumeData = { ...state.resumeData, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    updateFieldLocally: (state, action) => {
      const { field, value } = action.payload;
      if (state.resumeData) {
        state.resumeData[field] = value;
        state.lastUpdated = new Date().toISOString();
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetValidation: (state) => {
      state.validation = {
        isValid: false,
        errors: {},
        missingFields: []
      };
      state.validationStatus = 'idle';
    },
    setMissingFields: (state, action) => {
      state.validation.missingFields = action.payload;
    },
    clearMissingFields: (state) => {
      state.validation.missingFields = [];
    },
    setUploadStatus: (state, action) => {
      state.uploadStatus = action.payload;
    },
    // Persistence actions
    loadResumeState: (state) => {
      try {
        const resumeState = localStorage.getItem('crisp_resume_state');
        if (resumeState) {
          const parsedState = JSON.parse(resumeState);
          
          // Only load if we have valid resume data
          if (parsedState.resumeData) {
            Object.keys(parsedState).forEach(key => {
              if (key in state) {
                state[key] = parsedState[key];
              }
            });
          }
        }
      } catch (error) {
        console.error('Failed to load resume state:', error);
        state.error = 'Failed to load resume data';
      }
    },
    saveResumeState: (state) => {
      try {
        localStorage.setItem('crisp_resume_state', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save resume state:', error);
      }
    },
    clearResumeState: () => {
      try {
        localStorage.removeItem('crisp_resume_state');
      } catch (error) {
        console.error('Failed to clear resume state:', error);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Parse Resume cases
      .addCase(parseResume.pending, (state) => {
        state.parsingStatus = 'loading';
        state.uploadStatus = 'uploading';
        state.error = null;
      })
      .addCase(parseResume.fulfilled, (state, action) => {
        state.parsingStatus = 'succeeded';
        state.uploadStatus = 'success';
        state.parsedData = action.payload;
        state.resumeData = action.payload;
        state.fileInfo = {
          fileName: action.payload.fileName,
          fileType: action.payload.fileType,
          fileSize: action.payload.fileSize,
          parsedAt: action.payload.parsedAt
        };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(parseResume.rejected, (state, action) => {
        state.parsingStatus = 'failed';
        state.uploadStatus = 'failed';
        state.error = action.payload;
      })
      // Validate Resume Fields cases
      .addCase(validateResumeFields.pending, (state) => {
        state.validationStatus = 'loading';
      })
      .addCase(validateResumeFields.fulfilled, (state, action) => {
        state.validationStatus = 'succeeded';
        state.validation = action.payload;
      })
      .addCase(validateResumeFields.rejected, (state, action) => {
        state.validationStatus = 'failed';
        state.error = action.payload;
      })
      // Update Resume Field cases
      .addCase(updateResumeField.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateResumeField.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const { field, value } = action.payload;
        if (state.resumeData) {
          state.resumeData[field] = value;
          state.lastUpdated = new Date().toISOString();
        }
      })
      .addCase(updateResumeField.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectResumeData = (state) => state.resume.resumeData;
export const selectParsedData = (state) => state.resume.parsedData;
export const selectValidation = (state) => state.resume.validation;
export const selectParsingStatus = (state) => state.resume.parsingStatus;
export const selectValidationStatus = (state) => state.resume.validationStatus;
export const selectUpdateStatus = (state) => state.resume.updateStatus;
export const selectUploadStatus = (state) => state.resume.uploadStatus;
export const selectResumeError = (state) => state.resume.error;
export const selectFileInfo = (state) => state.resume.fileInfo;
export const selectLastUpdated = (state) => state.resume.lastUpdated;

// Memoized selectors
export const selectMissingFields = createSelector(
  [selectValidation],
  (validation) => validation.missingFields
);

export const selectIsResumeComplete = createSelector(
  [selectValidation],
  (validation) => validation.isValid
);

export const selectResumeSkills = createSelector(
  [selectResumeData],
  (resumeData) => resumeData?.skills || []
);

export const selectResumeValidationErrors = createSelector(
  [selectValidation],
  (validation) => validation.errors
);

// Export actions
export const { 
  clearResumeData, 
  setResumeData, 
  updateResumeData,
  updateFieldLocally, 
  clearError, 
  resetValidation,
  setMissingFields,
  clearMissingFields,
  setUploadStatus,
  loadResumeState,
  saveResumeState,
  clearResumeState
} = resumeSlice.actions;

// Export reducer
export default resumeSlice.reducer;