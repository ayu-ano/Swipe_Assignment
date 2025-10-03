import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, FileText, AlertCircle, CheckCircle, User, Mail, Phone } from 'lucide-react';
import { validateFileType, validateFileSize } from '../../utils/fileValidators';
import { extractResumeData } from '../../services/resumeParser';
import { setResumeData, setMissingFields, setUploadStatus } from '../../store/slices/resumeSlice';
import LoadingSpinner from '../common/LoadingSpinner';

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
        return <LoadingSpinner size={32} />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-500" />;
      default:
        return (
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
        );
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Interview
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume to get started. We'll extract your basic information to personalize your interview experience.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div
            className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
                : uploadStatus === 'success'
                ? 'border-green-400 bg-green-50'
                : uploadStatus === 'error'
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
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
              className="cursor-pointer flex flex-col items-center justify-center space-y-6"
            >
              {getUploadStatusIcon()}
              
              <div className="text-center space-y-2">
                <p className="text-2xl font-semibold text-gray-900">
                  {getStatusMessage()}
                </p>
                <p className="text-lg text-gray-500">
                  Supports PDF and DOCX files (max 5MB)
                </p>
              </div>
              
              <button
                type="button"
                className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                disabled={uploadStatus === 'processing'}
              >
                Choose File
              </button>
            </label>
          </div>
        </div>

        {resumeData && uploadStatus === 'success' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Extracted Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
                <User className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <span className="text-sm font-medium text-blue-600 block mb-2">Name</span>
                <p className="text-lg font-semibold text-gray-900">
                  {resumeData.name || 'Not found'}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
                <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <span className="text-sm font-medium text-green-600 block mb-2">Email</span>
                <p className="text-lg font-semibold text-gray-900">
                  {resumeData.email || 'Not found'}
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 text-center border border-purple-200">
                <Phone className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <span className="text-sm font-medium text-purple-600 block mb-2">Phone</span>
                <p className="text-lg font-semibold text-gray-900">
                  {resumeData.phone || 'Not found'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;