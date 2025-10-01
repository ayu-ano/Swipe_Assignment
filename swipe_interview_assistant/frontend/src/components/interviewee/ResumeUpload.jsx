import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { validateFileType, validateFileSize } from '../../utils/fileValidators';
import { extractResumeData } from '../../services/resumeParser';
import { setResumeData, setMissingFields, setUploadStatus } from '../../store/slices/resumeSlice';
import LoadingSpinner from '../Common/LoadingSpinner';

const ResumeUpload = () => {
  const dispatch = useDispatch();
  const { uploadStatus, resumeData } = useSelector(state => state.resume);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file) => {
    if (!validateFileType(file)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    if (!validateFileSize(file)) {
      alert('File size must be less than 5MB');
      return;
    }

    dispatch(setUploadStatus('processing'));
    
    try {
      const extractedData = await extractResumeData(file);
      dispatch(setResumeData(extractedData));
      
      // Check for missing required fields
      const missingFields = [];
      if (!extractedData.name) missingFields.push('name');
      if (!extractedData.email) missingFields.push('email');
      if (!extractedData.phone) missingFields.push('phone');
      
      if (missingFields.length > 0) {
        dispatch(setMissingFields(missingFields));
      }
      
      dispatch(setUploadStatus('success'));
    } catch (error) {
      console.error('Error parsing resume:', error);
      dispatch(setUploadStatus('error'));
      alert('Error parsing resume. Please try again or enter details manually.');
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const getUploadStatusIcon = () => {
    switch (uploadStatus) {
      case 'processing':
        return <LoadingSpinner size={24} />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Upload className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'processing':
        return 'Processing your resume...';
      case 'success':
        return 'Resume uploaded successfully!';
      case 'error':
        return 'Failed to process resume. Please try again.';
      default:
        return 'Drag & drop your resume here or click to browse';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Your Interview
        </h1>
        <p className="text-gray-600">
          Upload your resume to get started. We'll extract your basic information.
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : uploadStatus === 'success'
            ? 'border-green-400 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,.docx"
          onChange={handleChange}
          className="hidden"
          disabled={uploadStatus === 'processing'}
        />
        
        <label
          htmlFor="resume-upload"
          className="cursor-pointer flex flex-col items-center justify-center space-y-4"
        >
          {getUploadStatusIcon()}
          
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-1">
              {getStatusMessage()}
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF and DOCX files (max 5MB)
            </p>
          </div>
          
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploadStatus === 'processing'}
          >
            Choose File
          </button>
        </label>
      </div>

      {resumeData && uploadStatus === 'success' && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Extracted Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <p className="font-medium">{resumeData.name || 'Not found'}</p>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="font-medium">{resumeData.email || 'Not found'}</p>
            </div>
            <div>
              <span className="text-gray-500">Phone:</span>
              <p className="font-medium">{resumeData.phone || 'Not found'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;