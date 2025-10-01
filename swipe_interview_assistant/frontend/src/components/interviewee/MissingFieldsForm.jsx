import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { updateResumeData, clearMissingFields } from '../../store/slices/resumeSlice';
import { validateEmail, validatePhone } from '../../utils/validators';

const MissingFieldsForm = () => {
  const dispatch = useDispatch();
  const { missingFields, resumeData } = useSelector(state => state.resume);
  
  const [formData, setFormData] = useState({
    name: resumeData?.name || '',
    email: resumeData?.email || '',
    phone: resumeData?.phone || ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!validateEmail(value)) error = 'Please enter a valid email address';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!validatePhone(value)) error = 'Please enter a valid phone number';
        break;
      default:
        break;
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
    
    return !error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    missingFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Update resume data with missing fields
      dispatch(updateResumeData(formData));
      dispatch(clearMissingFields());
    }
  };

  const getFieldIcon = (field) => {
    switch (field) {
      case 'name': return <User className="w-5 h-5 text-gray-400" />;
      case 'email': return <Mail className="w-5 h-5 text-gray-400" />;
      case 'phone': return <Phone className="w-5 h-5 text-gray-400" />;
      default: return null;
    }
  };

  const getFieldLabel = (field) => {
    switch (field) {
      case 'name': return 'Full Name';
      case 'email': return 'Email Address';
      case 'phone': return 'Phone Number';
      default: return field;
    }
  };

  const getFieldPlaceholder = (field) => {
    switch (field) {
      case 'name': return 'Enter your full name';
      case 'email': return 'Enter your email address';
      case 'phone': return 'Enter your phone number';
      default: return `Enter your ${field}`;
    }
  };

  const getFieldType = (field) => {
    switch (field) {
      case 'email': return 'email';
      case 'phone': return 'tel';
      default: return 'text';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Additional Information Needed
          </h1>
          <p className="text-gray-600">
            We couldn't extract all the required information from your resume. 
            Please complete the following fields to start your interview.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {missingFields.map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getFieldLabel(field)} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {getFieldIcon(field)}
                </div>
                <input
                  type={getFieldType(field)}
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  onBlur={() => handleBlur(field)}
                  placeholder={getFieldPlaceholder(field)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors[field] 
                      ? 'border-red-300 focus:border-red-300' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors[field] && touched[field] && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors[field]}
                </p>
              )}
            </div>
          ))}

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Why we need this:</strong> This information helps us personalize your 
              interview experience and contact you about the results.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            Start Interview
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Extracted Info Preview */}
        {resumeData && (resumeData.name || resumeData.email || resumeData.phone) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Information from your resume:
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              {resumeData.name && <p>✓ Name: {resumeData.name}</p>}
              {resumeData.email && <p>✓ Email: {resumeData.email}</p>}
              {resumeData.phone && <p>✓ Phone: {resumeData.phone}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissingFieldsForm;