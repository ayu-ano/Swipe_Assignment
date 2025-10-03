// Candidate Slice for managing candidate data and interviews
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Async thunks
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      const storedCandidates = localStorage.getItem('crisp_candidates');
      return storedCandidates ? JSON.parse(storedCandidates) : [];
    } catch (error) {
      return rejectWithValue('Failed to fetch candidates');
    }
  }
);

export const saveCandidate = createAsyncThunk(
  'candidates/saveCandidate',
  async (candidateData, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const candidate = {
        id: candidateData.id || uuidv4(),
        ...candidateData,
        createdAt: candidateData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, this would be an API call
      const storedCandidates = localStorage.getItem('crisp_candidates');
      const candidates = storedCandidates ? JSON.parse(storedCandidates) : [];
      
      const existingIndex = candidates.findIndex(c => c.id === candidate.id);
      if (existingIndex >= 0) {
        candidates[existingIndex] = candidate;
      } else {
        candidates.push(candidate);
      }
      
      localStorage.setItem('crisp_candidates', JSON.stringify(candidates));
      
      return candidate;
    } catch (error) {
      return rejectWithValue('Failed to save candidate');
    }
  }
);

export const deleteCandidate = createAsyncThunk(
  'candidates/deleteCandidate',
  async (candidateId, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real app, this would be an API call
      const storedCandidates = localStorage.getItem('crisp_candidates');
      const candidates = storedCandidates ? JSON.parse(storedCandidates) : [];
      const filteredCandidates = candidates.filter(c => c.id !== candidateId);
      
      localStorage.setItem('crisp_candidates', JSON.stringify(filteredCandidates));
      
      return candidateId;
    } catch (error) {
      return rejectWithValue('Failed to delete candidate');
    }
  }
);

// Initial state
const initialState = {
  candidates: [],
  selectedCandidate: null,
  filters: {
    search: '',
    status: 'all',
    minScore: 0,
    maxScore: 100,
    dateRange: {
      start: null,
      end: null
    }
  },
  sort: {
    field: 'interviewDate',
    order: 'desc'
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0
  },
  loading: false,
  error: null,
  lastUpdated: null
};

// Candidate slice
const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    // Sync actions
    setSelectedCandidate: (state, action) => {
      state.selectedCandidate = action.payload;
    },
    
    clearSelectedCandidate: (state) => {
      state.selectedCandidate = null;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    },
    
    setSort: (state, action) => {
      state.sort = { ...state.sort, ...action.payload };
    },
    
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    updateCandidateScore: (state, action) => {
      const { candidateId, score, summary } = action.payload;
      const candidate = state.candidates.find(c => c.id === candidateId);
      
      if (candidate) {
        candidate.score = score;
        candidate.summary = summary;
        candidate.updatedAt = new Date().toISOString();
      }
    },
    
    addCandidateAnswer: (state, action) => {
      const { candidateId, questionId, answer, score, feedback } = action.payload;
      const candidate = state.candidates.find(c => c.id === candidateId);
      
      if (candidate) {
        if (!candidate.answers) {
          candidate.answers = [];
        }
        
        const existingAnswerIndex = candidate.answers.findIndex(a => a.questionId === questionId);
        const answerData = {
          questionId,
          answer,
          score,
          feedback,
          submittedAt: new Date().toISOString()
        };
        
        if (existingAnswerIndex >= 0) {
          candidate.answers[existingAnswerIndex] = answerData;
        } else {
          candidate.answers.push(answerData);
        }
        
        candidate.updatedAt = new Date().toISOString();
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetCandidates: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch candidates
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
        state.pagination.totalCount = action.payload.length;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save candidate
      .addCase(saveCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCandidate.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.candidates.findIndex(c => c.id === action.payload.id);
        
        if (existingIndex >= 0) {
          state.candidates[existingIndex] = action.payload;
        } else {
          state.candidates.push(action.payload);
        }
        
        state.pagination.totalCount = state.candidates.length;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(saveCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete candidate
      .addCase(deleteCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = state.candidates.filter(c => c.id !== action.payload);
        state.pagination.totalCount = state.candidates.length;
        
        if (state.selectedCandidate?.id === action.payload) {
          state.selectedCandidate = null;
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  setSelectedCandidate,
  clearSelectedCandidate,
  setFilters,
  clearFilters,
  setSort,
  setPagination,
  updateCandidateScore,
  addCandidateAnswer,
  clearError,
  resetCandidates
} = candidateSlice.actions;

// Selectors
export const selectCandidates = (state) => state.candidates.candidates;
export const selectSelectedCandidate = (state) => state.candidates.selectedCandidate;
export const selectFilters = (state) => state.candidates.filters;
export const selectSort = (state) => state.candidates.sort;
export const selectPagination = (state) => state.candidates.pagination;
export const selectLoading = (state) => state.candidates.loading;
export const selectError = (state) => state.candidates.error;
export const selectLastUpdated = (state) => state.candidates.lastUpdated;

// Memoized selectors
export const selectFilteredCandidates = createSelector(
  [selectCandidates, selectFilters, selectSort],
  (candidates, filters, sort) => {
    let filtered = candidates.filter(candidate => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          candidate.name?.toLowerCase().includes(searchLower) ||
          candidate.email?.toLowerCase().includes(searchLower) ||
          candidate.summary?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Score filters
      if (candidate.score < filters.minScore || candidate.score > filters.maxScore) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'all') {
        let candidateStatus = 'good';
        if (candidate.score >= 80) candidateStatus = 'excellent';
        else if (candidate.score < 60) candidateStatus = 'needs_review';
        
        if (candidateStatus !== filters.status) return false;
      }
      
      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const interviewDate = new Date(candidate.interviewDate);
        
        if (filters.dateRange.start && interviewDate < new Date(filters.dateRange.start)) {
          return false;
        }
        
        if (filters.dateRange.end && interviewDate > new Date(filters.dateRange.end)) {
          return false;
        }
      }
      
      return true;
    });
    
    // Sort candidates
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sort.field) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'score':
          aValue = a.score || 0;
          bValue = b.score || 0;
          break;
        case 'interviewDate':
        default:
          aValue = new Date(a.interviewDate).getTime();
          bValue = new Date(b.interviewDate).getTime();
          break;
      }
      
      if (sort.order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }
);

export const selectPaginatedCandidates = createSelector(
  [selectFilteredCandidates, selectPagination],
  (filteredCandidates, pagination) => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredCandidates.slice(startIndex, endIndex);
  }
);

export const selectCandidateById = (candidateId) => 
  createSelector(
    [selectCandidates],
    (candidates) => candidates.find(c => c.id === candidateId)
  );

export const selectCandidatesStats = createSelector(
  [selectCandidates],
  (candidates) => {
    const total = candidates.length;
    const averageScore = total > 0 
      ? Math.round(candidates.reduce((sum, c) => sum + (c.score || 0), 0) / total)
      : 0;
    
    const scoreDistribution = {
      excellent: candidates.filter(c => c.score >= 80).length,
      good: candidates.filter(c => c.score >= 60 && c.score < 80).length,
      needs_review: candidates.filter(c => c.score < 60).length
    };
    
    const recentInterviews = candidates.filter(c => {
      const interviewDate = new Date(c.interviewDate);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return interviewDate > sevenDaysAgo;
    }).length;
    
    return {
      total,
      averageScore,
      scoreDistribution,
      recentInterviews,
      completionRate: total > 0 ? Math.round((candidates.filter(c => c.score !== undefined).length / total) * 100) : 0
    };
  }
);

// Export the reducer
export default candidateSlice.reducer;