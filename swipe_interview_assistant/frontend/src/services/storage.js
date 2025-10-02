// Storage service for managing interview data persistence
class StorageService {
  constructor() {
    this.storage = typeof window !== 'undefined' ? window.localStorage : null;
    this.dbName = 'CrispInterviewDB';
    this.dbVersion = 1;
    this.db = null;
    this.initDatabase();
  }

  // Initialize IndexedDB for larger storage
  async initDatabase() {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('IndexedDB not available, falling back to localStorage');
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('IndexedDB initialization failed:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores for different data types
        if (!db.objectStoreNames.contains('candidates')) {
          const candidateStore = db.createObjectStore('candidates', { keyPath: 'id' });
          candidateStore.createIndex('email', 'email', { unique: false });
          candidateStore.createIndex('score', 'score', { unique: false });
          candidateStore.createIndex('date', 'interviewDate', { unique: false });
        }

        if (!db.objectStoreNames.contains('interviews')) {
          const interviewStore = db.createObjectStore('interviews', { keyPath: 'sessionId' });
          interviewStore.createIndex('candidateId', 'candidateId', { unique: false });
          interviewStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains('resumes')) {
          db.createObjectStore('resumes', { keyPath: 'candidateId' });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Save candidate data
  async saveCandidate(candidateData) {
    try {
      // Save to IndexedDB if available
      if (this.db) {
        return await this.saveToIndexedDB('candidates', candidateData);
      }
      
      // Fallback to localStorage
      return this.saveToLocalStorage(`candidate_${candidateData.id}`, candidateData);
    } catch (error) {
      console.error('Failed to save candidate:', error);
      throw error;
    }
  }

  // Get candidate by ID
  async getCandidate(candidateId) {
    try {
      if (this.db) {
        return await this.getFromIndexedDB('candidates', candidateId);
      }
      
      return this.getFromLocalStorage(`candidate_${candidateId}`);
    } catch (error) {
      console.error('Failed to get candidate:', error);
      return null;
    }
  }

  // Get all candidates with pagination and filtering
  async getCandidates(options = {}) {
    const {
      page = 1,
      limit = 50,
      sortBy = 'interviewDate',
      sortOrder = 'desc',
      filter = {}
    } = options;

    try {
      if (this.db) {
        return await this.getCandidatesFromIndexedDB(options);
      }
      
      return this.getCandidatesFromLocalStorage(options);
    } catch (error) {
      console.error('Failed to get candidates:', error);
      return { candidates: [], total: 0, page, limit };
    }
  }

  // Save interview session
  async saveInterviewSession(sessionData) {
    try {
      const session = {
        ...sessionData,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      };

      if (this.db) {
        return await this.saveToIndexedDB('interviews', session);
      }
      
      return this.saveToLocalStorage(`interview_${session.sessionId}`, session);
    } catch (error) {
      console.error('Failed to save interview session:', error);
      throw error;
    }
  }

  // Get interview session
  async getInterviewSession(sessionId) {
    try {
      if (this.db) {
        return await this.getFromIndexedDB('interviews', sessionId);
      }
      
      return this.getFromLocalStorage(`interview_${sessionId}`);
    } catch (error) {
      console.error('Failed to get interview session:', error);
      return null;
    }
  }

  // Save resume data
  async saveResume(candidateId, resumeData) {
    try {
      const resume = {
        candidateId,
        data: resumeData,
        uploadedAt: new Date().toISOString(),
        fileSize: resumeData.fileSize
      };

      if (this.db) {
        return await this.saveToIndexedDB('resumes', resume);
      }
      
      return this.saveToLocalStorage(`resume_${candidateId}`, resume);
    } catch (error) {
      console.error('Failed to save resume:', error);
      throw error;
    }
  }

  // Get resume data
  async getResume(candidateId) {
    try {
      if (this.db) {
        return await this.getFromIndexedDB('resumes', candidateId);
      }
      
      return this.getFromLocalStorage(`resume_${candidateId}`);
    } catch (error) {
      console.error('Failed to get resume:', error);
      return null;
    }
  }

  // Save application settings
  async saveSettings(settings) {
    try {
      if (this.db) {
        return await this.saveToIndexedDB('settings', { key: 'appSettings', ...settings });
      }
      
      return this.saveToLocalStorage('appSettings', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  // Get application settings
  async getSettings() {
    try {
      if (this.db) {
        const settings = await this.getFromIndexedDB('settings', 'appSettings');
        return settings || {};
      }
      
      return this.getFromLocalStorage('appSettings') || {};
    } catch (error) {
      console.error('Failed to get settings:', error);
      return {};
    }
  }

  // Export all data (for backup)
  async exportData() {
    try {
      if (this.db) {
        return await this.exportFromIndexedDB();
      }
      
      return this.exportFromLocalStorage();
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  // Import data (for restore)
  async importData(data) {
    try {
      if (this.db) {
        return await this.importToIndexedDB(data);
      }
      
      return this.importToLocalStorage(data);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  // Clear all data
  async clearAllData() {
    try {
      if (this.db) {
        return await this.clearIndexedDB();
      }
      
      return this.clearLocalStorage();
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }

  // Get storage statistics
  async getStorageStats() {
    try {
      if (this.db) {
        return await this.getIndexedDBStats();
      }
      
      return this.getLocalStorageStats();
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { totalSize: 0, itemCount: 0 };
    }
  }

  // IndexedDB methods
  async saveToIndexedDB(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  async getFromIndexedDB(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getCandidatesFromIndexedDB(options) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['candidates'], 'readonly');
      const store = transaction.objectStore('candidates');
      const index = store.index('date');
      const request = index.getAll();

      request.onsuccess = () => {
        let candidates = request.result;

        // Apply filters
        if (options.filter.minScore) {
          candidates = candidates.filter(c => c.score >= options.filter.minScore);
        }
        if (options.filter.maxScore) {
          candidates = candidates.filter(c => c.score <= options.filter.maxScore);
        }
        if (options.filter.status) {
          candidates = candidates.filter(c => 
            this.getCandidateStatus(c.score) === options.filter.status
          );
        }

        // Sort
        candidates.sort((a, b) => {
          const aVal = a[options.sortBy];
          const bVal = b[options.sortBy];
          
          if (options.sortOrder === 'desc') {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
          }
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        });

        // Paginate
        const start = (options.page - 1) * options.limit;
        const end = start + options.limit;
        const paginatedCandidates = candidates.slice(start, end);

        resolve({
          candidates: paginatedCandidates,
          total: candidates.length,
          page: options.page,
          limit: options.limit,
          totalPages: Math.ceil(candidates.length / options.limit)
        });
      };

      request.onerror = () => reject(request.error);
    });
  }

  // LocalStorage methods
  saveToLocalStorage(key, data) {
    if (!this.storage) throw new Error('LocalStorage not available');
    
    try {
      const serialized = JSON.stringify(data);
      this.storage.setItem(key, serialized);
      return data;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some data.');
      }
      throw error;
    }
  }

  getFromLocalStorage(key) {
    if (!this.storage) return null;
    
    try {
      const item = this.storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to parse localStorage item:', error);
      return null;
    }
  }

  getCandidatesFromLocalStorage(options) {
    if (!this.storage) return { candidates: [], total: 0 };
    
    const candidates = [];
    const keys = Object.keys(this.storage);
    
    keys.forEach(key => {
      if (key.startsWith('candidate_')) {
        try {
          const candidate = JSON.parse(this.storage.getItem(key));
          if (candidate) candidates.push(candidate);
        } catch (error) {
          console.warn('Failed to parse candidate:', key);
        }
      }
    });

    // Apply sorting and filtering (similar to IndexedDB version)
    // ... implementation similar to getCandidatesFromIndexedDB

    return {
      candidates: candidates.slice(0, options.limit),
      total: candidates.length,
      page: options.page,
      limit: options.limit
    };
  }

  // Utility methods
  getCandidateStatus(score) {
    if (score >= 80) return 'top';
    if (score >= 60) return 'good';
    return 'needs_review';
  }

  async exportFromIndexedDB() {
    // Implementation for exporting all data from IndexedDB
    const exportData = {
      candidates: await this.getAllFromStore('candidates'),
      interviews: await this.getAllFromStore('interviews'),
      resumes: await this.getAllFromStore('resumes'),
      settings: await this.getAllFromStore('settings'),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    return exportData;
  }

  async getAllFromStore(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  getLocalStorageStats() {
    if (!this.storage) return { totalSize: 0, itemCount: 0 };
    
    let totalSize = 0;
    let itemCount = 0;

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      const value = this.storage.getItem(key);
      totalSize += key.length + (value ? value.length : 0);
      itemCount++;
    }

    return { totalSize, itemCount };
  }

  // Get storage status
  getStatus() {
    return {
      hasIndexedDB: !!this.db,
      hasLocalStorage: !!this.storage,
      dbName: this.dbName,
      dbVersion: this.dbVersion
    };
  }
}

// Create and export singleton instance
const storageService = new StorageService();
export default storageService;

// Export individual functions for convenience
export const saveCandidate = (candidateData) => storageService.saveCandidate(candidateData);
export const getCandidate = (candidateId) => storageService.getCandidate(candidateId);
export const getCandidates = (options) => storageService.getCandidates(options);
export const saveInterviewSession = (sessionData) => storageService.saveInterviewSession(sessionData);
export const getInterviewSession = (sessionId) => storageService.getInterviewSession(sessionId);
export const saveResume = (candidateId, resumeData) => storageService.saveResume(candidateId, resumeData);
export const getResume = (candidateId) => storageService.getResume(candidateId);
export const saveSettings = (settings) => storageService.saveSettings(settings);
export const getSettings = () => storageService.getSettings();
export const exportData = () => storageService.exportData();
export const importData = (data) => storageService.importData(data);
export const clearAllData = () => storageService.clearAllData();
export const getStorageStats = () => storageService.getStorageStats();