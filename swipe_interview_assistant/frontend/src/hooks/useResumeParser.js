import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { extractResumeData } from '../services/resumeParser';
import { setResumeData, setMissingFields, setUploadStatus } from '../store/slices/resumeSlice';
import { validateFileType, validateFileSize } from '../utils/fileValidators';

const useResumeParser = () => {
  const dispatch = useDispatch();
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState(null);

  // Parse resume file
  const parseResume = useCallback(async (file) => {
    if (!file) {
      setError('No file provided');
      return null;
    }

    // Validate file type
    if (!validateFileType(file)) {
      setError('Please upload a PDF or DOCX file');
      return null;
    }

    // Validate file size
    if (!validateFileSize(file)) {
      setError('File size must be less than 5MB');
      return null;
    }

    setIsParsing(true);
    setError(null);
    dispatch(setUploadStatus('processing'));

    try {
      // Extract data from resume
      const extractedData = await extractResumeData(file);
      
      if (!extractedData) {
        throw new Error('Failed to extract data from resume');
      }

      // Set resume data in store
      dispatch(setResumeData(extractedData));

      // Check for missing required fields
      const missingFields = [];
      const requiredFields = ['name', 'email', 'phone'];
      
      requiredFields.forEach(field => {
        if (!extractedData[field] || extractedData[field].trim() === '') {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        dispatch(setMissingFields(missingFields));
      }

      dispatch(setUploadStatus('success'));
      return extractedData;

    } catch (err) {
      const errorMessage = err.message || 'Error parsing resume. Please try again.';
      setError(errorMessage);
      dispatch(setUploadStatus('error'));
      console.error('Resume parsing error:', err);
      return null;
    } finally {
      setIsParsing(false);
    }
  }, [dispatch]);

  // Validate resume fields manually
  const validateResumeFields = useCallback((fields) => {
    const errors = {};
    const requiredFields = ['name', 'email', 'phone'];

    requiredFields.forEach(field => {
      if (!fields[field] || fields[field].trim() === '') {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Email validation
    if (fields.email && !isValidEmail(fields.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (fields.phone && !isValidPhone(fields.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Name validation
    if (fields.name && fields.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  // Update resume data
  const updateResumeData = useCallback((updates) => {
    dispatch(setResumeData(updates));
    
    // Re-check for missing fields after update
    const missingFields = [];
    const requiredFields = ['name', 'email', 'phone'];
    
    requiredFields.forEach(field => {
      if (!updates[field] || updates[field].trim() === '') {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      dispatch(setMissingFields(missingFields));
    } else {
      dispatch(setMissingFields([]));
    }
  }, [dispatch]);

  // Clear resume data
  const clearResumeData = useCallback(() => {
    dispatch(setResumeData(null));
    dispatch(setMissingFields([]));
    dispatch(setUploadStatus('idle'));
    setError(null);
  }, [dispatch]);

  // Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation helper
  const isValidPhone = (phone) => {
    // Basic phone validation - accepts various formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleaned = phone.replace(/[\s\-\(\)\.]+/g, '');
    return phoneRegex.test(cleaned);
  };

  return {
    // State
    isParsing,
    error,
    
    // Actions
    parseResume,
    validateResumeFields,
    updateResumeData,
    clearResumeData,
    
    // Utilities
    clearError: () => setError(null)
  };
};

export default useResumeParser;