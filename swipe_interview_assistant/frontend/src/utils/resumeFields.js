// Resume Fields Configuration and Validation
class ResumeFields {
  constructor() {
    this.requiredFields = this.initializeRequiredFields();
    this.optionalFields = this.initializeOptionalFields();
    this.fieldPatterns = this.initializeFieldPatterns();
    this.fieldLabels = this.initializeFieldLabels();
  }

  // Initialize required fields with validation rules
  initializeRequiredFields() {
    return {
      name: {
        label: 'Full Name',
        type: 'text',
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z\s\-'\u00C0-\u024F\u1E00-\u1EFF]+$/,
        patternMessage: 'Name can only contain letters, spaces, hyphens, and apostrophes',
        validation: (value) => this.validateName(value)
      },
      email: {
        label: 'Email Address',
        type: 'email',
        required: true,
        pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        validation: (value) => this.validateEmail(value)
      },
      phone: {
        label: 'Phone Number',
        type: 'tel',
        required: true,
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        validation: (value) => this.validatePhone(value)
      }
    };
  }

  // Initialize optional fields that can be extracted from resumes
  initializeOptionalFields() {
    return {
      skills: {
        label: 'Skills',
        type: 'array',
        required: false,
        maxItems: 20,
        validation: (value) => this.validateSkills(value)
      },
      experience: {
        label: 'Experience',
        type: 'text',
        required: false,
        maxLength: 1000,
        validation: (value) => this.validateExperience(value)
      },
      education: {
        label: 'Education',
        type: 'text',
        required: false,
        maxLength: 500,
        validation: (value) => this.validateEducation(value)
      },
      summary: {
        label: 'Professional Summary',
        type: 'text',
        required: false,
        maxLength: 2000,
        validation: (value) => this.validateSummary(value)
      },
      location: {
        label: 'Location',
        type: 'text',
        required: false,
        maxLength: 100,
        validation: (value) => this.validateLocation(value)
      },
      linkedin: {
        label: 'LinkedIn Profile',
        type: 'url',
        required: false,
        pattern: /https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+/,
        validation: (value) => this.validateLinkedIn(value)
      },
      github: {
        label: 'GitHub Profile',
        type: 'url',
        required: false,
        pattern: /https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9\-_]+/,
        validation: (value) => this.validateGitHub(value)
      },
      portfolio: {
        label: 'Portfolio Website',
        type: 'url',
        required: false,
        validation: (value) => this.validateURL(value)
      }
    };
  }

  // Initialize field patterns for extraction
  initializeFieldPatterns() {
    return {
      name: [
        /^[A-Z][a-z]+ [A-Z][a-z]+/,
        /([A-Z][a-z]+ [A-Z][a-z]+)(?=\s*\n)/,
        /resume\s+of\s+([A-Z][a-z]+ [A-Z][a-z]+)/i
      ],
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      linkedin: /linkedin\.com\/in\/[a-zA-Z0-9\-_]+/gi,
      github: /github\.com\/[a-zA-Z0-9\-_]+/gi
    };
  }

  // Initialize field labels for display
  initializeFieldLabels() {
    return {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      skills: 'Technical Skills',
      experience: 'Work Experience',
      education: 'Education',
      summary: 'Professional Summary',
      location: 'Location',
      linkedin: 'LinkedIn Profile',
      github: 'GitHub Profile',
      portfolio: 'Portfolio Website'
    };
  }

  // Get all fields (required + optional)
  getAllFields() {
    return {
      ...this.requiredFields,
      ...this.optionalFields
    };
  }

  // Get required fields only
  getRequiredFields() {
    return this.requiredFields;
  }

  // Get optional fields only
  getOptionalFields() {
    return this.optionalFields;
  }

  // Get field configuration by name
  getFieldConfig(fieldName) {
    return this.getAllFields()[fieldName] || null;
  }

  // Get field label
  getFieldLabel(fieldName) {
    return this.fieldLabels[fieldName] || fieldName;
  }

  // Validate a specific field
  validateField(fieldName, value) {
    const fieldConfig = this.getFieldConfig(fieldName);
    
    if (!fieldConfig) {
      return {
        isValid: false,
        error: `Unknown field: ${fieldName}`
      };
    }

    // Check required field
    if (fieldConfig.required && (!value || value.toString().trim() === '')) {
      return {
        isValid: false,
        error: `${fieldConfig.label} is required`
      };
    }

    // Skip validation for empty optional fields
    if (!fieldConfig.required && (!value || value.toString().trim() === '')) {
      return {
        isValid: true,
        normalized: ''
      };
    }

    // Use custom validation if available
    if (fieldConfig.validation) {
      return fieldConfig.validation(value);
    }

    // Default validation based on type
    switch (fieldConfig.type) {
      case 'email':
        return this.validateEmail(value);
      
      case 'tel':
        return this.validatePhone(value);
      
      case 'text':
        return this.validateText(value, fieldConfig);
      
      case 'url':
        return this.validateURL(value);
      
      case 'array':
        return this.validateArray(value, fieldConfig);
      
      default:
        return {
          isValid: true,
          normalized: value
        };
    }
  }

  // Validate complete resume data
  validateResumeData(resumeData) {
    const errors = {};
    const validatedData = {};
    const missingFields = [];

    // Validate required fields
    Object.keys(this.requiredFields).forEach(fieldName => {
      const validation = this.validateField(fieldName, resumeData[fieldName]);
      
      if (!validation.isValid) {
        errors[fieldName] = validation.error;
        
        if (validation.error.includes('required')) {
          missingFields.push(fieldName);
        }
      } else {
        validatedData[fieldName] = validation.normalized || resumeData[fieldName];
      }
    });

    // Validate optional fields
    Object.keys(this.optionalFields).forEach(fieldName => {
      if (resumeData[fieldName] !== undefined && resumeData[fieldName] !== null) {
        const validation = this.validateField(fieldName, resumeData[fieldName]);
        
        if (!validation.isValid) {
          errors[fieldName] = validation.error;
        } else {
          validatedData[fieldName] = validation.normalized || resumeData[fieldName];
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      validatedData,
      missingFields,
      hasAllRequired: missingFields.length === 0
    };
  }

  // Extract fields from text content
  extractFieldsFromText(text) {
    const extracted = {};

    // Extract name
    extracted.name = this.extractName(text);
    
    // Extract email
    const emailMatch = text.match(this.fieldPatterns.email);
    extracted.email = emailMatch ? emailMatch[0] : null;
    
    // Extract phone
    const phoneMatch = text.match(this.fieldPatterns.phone);
    extracted.phone = phoneMatch ? phoneMatch[0] : null;
    
    // Extract LinkedIn
    const linkedinMatch = text.match(this.fieldPatterns.linkedin);
    extracted.linkedin = linkedinMatch ? `https://${linkedinMatch[0]}` : null;
    
    // Extract GitHub
    const githubMatch = text.match(this.fieldPatterns.github);
    extracted.github = githubMatch ? `https://${githubMatch[0]}` : null;
    
    // Extract skills (basic implementation)
    extracted.skills = this.extractSkills(text);

    return extracted;
  }

  // Field-specific validation methods
  validateName(value) {
    if (typeof value !== 'string') {
      return {
        isValid: false,
        error: 'Name must be text'
      };
    }

    const trimmed = value.trim();
    
    if (trimmed.length < 2) {
      return {
        isValid: false,
        error: 'Name must be at least 2 characters long'
      };
    }

    if (trimmed.length > 100) {
      return {
        isValid: false,
        error: 'Name is too long'
      };
    }

    if (!trimmed.includes(' ')) {
      return {
        isValid: false,
        error: 'Please enter your full name (first and last name)'
      };
    }

    // Format name (Title Case)
    const formatted = trimmed
      .split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');

    return {
      isValid: true,
      normalized: formatted
    };
  }

  validateEmail(value) {
    if (typeof value !== 'string') {
      return {
        isValid: false,
        error: 'Email must be text'
      };
    }

    const trimmed = value.trim().toLowerCase();
    
    if (!this.fieldPatterns.email.test(trimmed)) {
      return {
        isValid: false,
        error: 'Please enter a valid email address'
      };
    }

    if (this.isDisposableEmail(trimmed)) {
      return {
        isValid: false,
        error: 'Disposable email addresses are not allowed'
      };
    }

    return {
      isValid: true,
      normalized: trimmed
    };
  }

  validatePhone(value) {
    if (typeof value !== 'string') {
      return {
        isValid: false,
        error: 'Phone number must be text'
      };
    }

    const cleaned = value.replace(/[\s\-\(\)\.]+/g, '');
    
    if (cleaned.length < 10) {
      return {
        isValid: false,
        error: 'Phone number is too short'
      };
    }

    if (!this.fieldPatterns.phone.test(cleaned)) {
      return {
        isValid: false,
        error: 'Please enter a valid phone number'
      };
    }

    return {
      isValid: true,
      normalized: cleaned
    };
  }

  validateSkills(value) {
    if (!Array.isArray(value)) {
      return {
        isValid: false,
        error: 'Skills must be an array'
      };
    }

    // Filter out empty skills and limit to max items
    const validSkills = value
      .filter(skill => skill && typeof skill === 'string' && skill.trim().length > 0)
      .map(skill => skill.trim())
      .slice(0, 20);

    return {
      isValid: true,
      normalized: validSkills
    };
  }

  validateExperience(value) {
    return this.validateText(value, { maxLength: 1000 });
  }

  validateEducation(value) {
    return this.validateText(value, { maxLength: 500 });
  }

  validateSummary(value) {
    return this.validateText(value, { maxLength: 2000 });
  }

  validateLocation(value) {
    return this.validateText(value, { maxLength: 100 });
  }

  validateLinkedIn(value) {
    const urlValidation = this.validateURL(value);
    if (!urlValidation.isValid) {
      return urlValidation;
    }

    if (!value.includes('linkedin.com/in/')) {
      return {
        isValid: false,
        error: 'Please enter a valid LinkedIn profile URL'
      };
    }

    return {
      isValid: true,
      normalized: value
    };
  }

  validateGitHub(value) {
    const urlValidation = this.validateURL(value);
    if (!urlValidation.isValid) {
      return urlValidation;
    }

    if (!value.includes('github.com/')) {
      return {
        isValid: false,
        error: 'Please enter a valid GitHub profile URL'
      };
    }

    return {
      isValid: true,
      normalized: value
    };
  }

  validateURL(value) {
    if (typeof value !== 'string') {
      return {
        isValid: false,
        error: 'URL must be text'
      };
    }

    const trimmed = value.trim();
    
    try {
      new URL(trimmed);
      return {
        isValid: true,
        normalized: trimmed
      };
    } catch {
      return {
        isValid: false,
        error: 'Please enter a valid URL'
      };
    }
  }

  validateText(value, config = {}) {
    if (typeof value !== 'string') {
      return {
        isValid: false,
        error: 'Value must be text'
      };
    }

    const trimmed = value.trim();
    const errors = [];

    if (config.minLength && trimmed.length < config.minLength) {
      errors.push(`Must be at least ${config.minLength} characters long`);
    }

    if (config.maxLength && trimmed.length > config.maxLength) {
      errors.push(`Must be less than ${config.maxLength} characters long`);
    }

    if (config.pattern && !config.pattern.test(trimmed)) {
      errors.push(config.patternMessage || 'Invalid format');
    }

    return {
      isValid: errors.length === 0,
      error: errors.length > 0 ? errors[0] : undefined,
      normalized: trimmed
    };
  }

  validateArray(value, config = {}) {
    if (!Array.isArray(value)) {
      return {
        isValid: false,
        error: 'Value must be an array'
      };
    }

    const validItems = value.filter(item => 
      item !== null && item !== undefined && item.toString().trim().length > 0
    );

    if (config.maxItems && validItems.length > config.maxItems) {
      return {
        isValid: false,
        error: `Cannot have more than ${config.maxItems} items`
      };
    }

    return {
      isValid: true,
      normalized: validItems
    };
  }

  // Extraction methods
  extractName(text) {
    for (const pattern of this.fieldPatterns.name) {
      const match = text.match(pattern);
      if (match) {
        const potentialName = match[1] || match[0];
        if (potentialName.split(' ').length >= 2 && potentialName.length <= 50) {
          return potentialName.trim();
        }
      }
    }
    return null;
  }

  extractSkills(text) {
    const commonSkills = [
      // Frontend
      'react', 'javascript', 'typescript', 'html', 'css', 'sass', 'bootstrap', 'tailwind',
      'vue', 'angular', 'jquery', 'webpack', 'vite', 'next.js', 'redux', 'context api',
      
      // Backend
      'node.js', 'express', 'nestjs', 'python', 'django', 'flask', 'java', 'spring',
      'c#', '.net', 'php', 'laravel', 'ruby', 'rails', 'go', 'rust',
      
      // Database
      'mongodb', 'mysql', 'postgresql', 'redis', 'sqlite', 'firebase', 'dynamodb',
      
      // DevOps & Tools
      'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'jenkins', 'ci/cd',
      'linux', 'nginx', 'apache', 'rest api', 'graphql', 'websocket'
    ];

    const foundSkills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return [...new Set(foundSkills)].slice(0, 15);
  }

  // Utility methods
  isDisposableEmail(email) {
    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
      'throwawaymail.com', 'fakeinbox.com', 'yopmail.com', 'getairmail.com'
    ];

    const domain = email.split('@')[1];
    return disposableDomains.includes(domain);
  }

  // Get fields that are missing from data
  getMissingFields(resumeData) {
    return Object.keys(this.requiredFields).filter(fieldName => 
      !resumeData[fieldName] || resumeData[fieldName].toString().trim() === ''
    );
  }

  // Check if resume data is complete
  isResumeComplete(resumeData) {
    const missingFields = this.getMissingFields(resumeData);
    return missingFields.length === 0;
  }

  // Get field display order for forms
  getFieldDisplayOrder() {
    return [
      'name', 'email', 'phone', 'location', 
      'summary', 'experience', 'education', 'skills',
      'linkedin', 'github', 'portfolio'
    ];
  }

  // Sanitize field value
  sanitizeFieldValue(fieldName, value) {
    const fieldConfig = this.getFieldConfig(fieldName);
    
    if (!fieldConfig || value === null || value === undefined) {
      return value;
    }

    // Basic sanitization based on field type
    switch (fieldConfig.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        if (typeof value === 'string') {
          return value.trim();
        }
        return value;
      
      case 'array':
        if (Array.isArray(value)) {
          return value.map(item => 
            typeof item === 'string' ? item.trim() : item
          ).filter(item => item !== null && item !== undefined);
        }
        return value;
      
      default:
        return value;
    }
  }

  // Get field placeholder text
  getFieldPlaceholder(fieldName) {
    const placeholders = {
      name: 'Enter your full name',
      email: 'your.email@example.com',
      phone: '+1 (555) 123-4567',
      location: 'City, State/Country',
      summary: 'Brief professional summary...',
      linkedin: 'https://linkedin.com/in/yourprofile',
      github: 'https://github.com/yourusername',
      portfolio: 'https://yourportfolio.com'
    };

    return placeholders[fieldName] || `Enter ${this.getFieldLabel(fieldName).toLowerCase()}`;
  }

  // Get field description
  getFieldDescription(fieldName) {
    const descriptions = {
      name: 'Your full name as it appears on official documents',
      email: 'We will use this to contact you about interview results',
      phone: 'Include country code if international',
      skills: 'List your technical skills and technologies you are proficient with',
      summary: '2-3 sentences about your professional background and career goals'
    };

    return descriptions[fieldName] || null;
  }
}

// Create and export singleton instance
const resumeFields = new ResumeFields();
export default resumeFields;

// Export individual functions
export const validateResumeData = (resumeData) => 
  resumeFields.validateResumeData(resumeData);

export const validateField = (fieldName, value) => 
  resumeFields.validateField(fieldName, value);

export const extractFieldsFromText = (text) => 
  resumeFields.extractFieldsFromText(text);

export const getRequiredFields = () => 
  resumeFields.getRequiredFields();

export const getFieldConfig = (fieldName) => 
  resumeFields.getFieldConfig(fieldName);