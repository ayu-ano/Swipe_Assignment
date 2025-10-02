// Validators Utility for form validation and data integrity
class Validators {
  constructor() {
    this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    this.phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    this.urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  }

  // Email validation
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return {
        isValid: false,
        error: 'Email is required'
      };
    }

    const trimmedEmail = email.trim();
    
    if (trimmedEmail.length === 0) {
      return {
        isValid: false,
        error: 'Email is required'
      };
    }

    if (trimmedEmail.length > 254) {
      return {
        isValid: false,
        error: 'Email is too long'
      };
    }

    if (!this.emailRegex.test(trimmedEmail)) {
      return {
        isValid: false,
        error: 'Please enter a valid email address'
      };
    }

    // Check for disposable email domains
    if (this.isDisposableEmail(trimmedEmail)) {
      return {
        isValid: false,
        error: 'Disposable email addresses are not allowed'
      };
    }

    return {
      isValid: true,
      normalized: trimmedEmail.toLowerCase()
    };
  }

  // Phone number validation
  validatePhone(phone) {
    if (!phone || typeof phone !== 'string') {
      return {
        isValid: false,
        error: 'Phone number is required'
      };
    }

    const cleaned = phone.replace(/[\s\-\(\)\.]+/g, '');
    
    if (cleaned.length < 10) {
      return {
        isValid: false,
        error: 'Phone number is too short'
      };
    }

    if (cleaned.length > 15) {
      return {
        isValid: false,
        error: 'Phone number is too long'
      };
    }

    if (!this.phoneRegex.test(cleaned)) {
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

  // Name validation
  validateName(name) {
    if (!name || typeof name !== 'string') {
      return {
        isValid: false,
        error: 'Name is required'
      };
    }

    const trimmedName = name.trim();
    
    if (trimmedName.length === 0) {
      return {
        isValid: false,
        error: 'Name is required'
      };
    }

    if (trimmedName.length < 2) {
      return {
        isValid: false,
        error: 'Name must be at least 2 characters long'
      };
    }

    if (trimmedName.length > 100) {
      return {
        isValid: false,
        error: 'Name is too long'
      };
    }

    // Check for valid characters (allow letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s\-'\u00C0-\u024F\u1E00-\u1EFF]+$/.test(trimmedName)) {
      return {
        isValid: false,
        error: 'Name contains invalid characters'
      };
    }

    // Check for at least one space (first and last name)
    if (!trimmedName.includes(' ')) {
      return {
        isValid: false,
        error: 'Please enter your full name (first and last name)'
      };
    }

    return {
      isValid: true,
      normalized: trimmedName
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ')
    };
  }

  // URL validation
  validateURL(url) {
    if (!url || typeof url !== 'string') {
      return {
        isValid: false,
        error: 'URL is required'
      };
    }

    const trimmedURL = url.trim();
    
    if (trimmedURL.length === 0) {
      return {
        isValid: false,
        error: 'URL is required'
      };
    }

    // Add protocol if missing
    let urlToTest = trimmedURL;
    if (!urlToTest.startsWith('http://') && !urlToTest.startsWith('https://')) {
      urlToTest = 'https://' + urlToTest;
    }

    if (!this.urlRegex.test(urlToTest)) {
      return {
        isValid: false,
        error: 'Please enter a valid URL'
      };
    }

    return {
      isValid: true,
      normalized: urlToTest
    };
  }

  // Password validation
  validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return {
        isValid: false,
        error: 'Password is required'
      };
    }

    const requirements = {
      minLength: 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    const errors = [];

    if (password.length < requirements.minLength) {
      errors.push(`Password must be at least ${requirements.minLength} characters long`);
    }

    if (!requirements.hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!requirements.hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!requirements.hasNumbers) {
      errors.push('Password must contain at least one number');
    }

    if (!requirements.hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    if (password.length > 128) {
      errors.push('Password is too long');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      strength: this.calculatePasswordStrength(password, requirements)
    };
  }

  // File validation
  validateFile(file, options = {}) {
    const {
      allowedTypes = [],
      maxSize = 10 * 1024 * 1024, // 10MB default
      minSize = 1
    } = options;

    if (!file || !(file instanceof File)) {
      return {
        isValid: false,
        error: 'Valid file is required'
      };
    }

    const errors = [];

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      errors.push(`File size must be less than ${maxSizeMB}MB`);
    }

    if (file.size < minSize) {
      errors.push('File is too small');
    }

    // Check file name
    if (!file.name || file.name.length > 255) {
      errors.push('Invalid file name');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      fileInfo: {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified)
      }
    };
  }

  // Interview answer validation
  validateAnswer(answer, options = {}) {
    const {
      minLength = 10,
      maxLength = 5000,
      required = true
    } = options;

    if (!answer && required) {
      return {
        isValid: false,
        error: 'Answer is required'
      };
    }

    if (!answer && !required) {
      return {
        isValid: true,
        normalized: ''
      };
    }

    if (typeof answer !== 'string') {
      return {
        isValid: false,
        error: 'Answer must be text'
      };
    }

    const trimmedAnswer = answer.trim();
    
    if (required && trimmedAnswer.length === 0) {
      return {
        isValid: false,
        error: 'Answer is required'
      };
    }

    if (trimmedAnswer.length < minLength) {
      return {
        isValid: false,
        error: `Answer must be at least ${minLength} characters long`
      };
    }

    if (trimmedAnswer.length > maxLength) {
      return {
        isValid: false,
        error: `Answer must be less than ${maxLength} characters long`
      };
    }

    return {
      isValid: true,
      normalized: trimmedAnswer,
      wordCount: trimmedAnswer.split(/\s+/).filter(word => word.length > 0).length
    };
  }

  // Resume data validation
  validateResumeData(resumeData) {
    const errors = {};
    const validatedData = {};

    // Validate name
    const nameValidation = this.validateName(resumeData.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.error;
    } else {
      validatedData.name = nameValidation.normalized;
    }

    // Validate email
    const emailValidation = this.validateEmail(resumeData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    } else {
      validatedData.email = emailValidation.normalized;
    }

    // Validate phone (optional)
    if (resumeData.phone) {
      const phoneValidation = this.validatePhone(resumeData.phone);
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error;
      } else {
        validatedData.phone = phoneValidation.normalized;
      }
    }

    // Validate skills array
    if (resumeData.skills && Array.isArray(resumeData.skills)) {
      const validSkills = resumeData.skills.filter(skill => 
        skill && typeof skill === 'string' && skill.trim().length > 0
      );
      validatedData.skills = validSkills.slice(0, 20); // Limit to 20 skills
    } else {
      validatedData.skills = [];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors,
      data: validatedData
    };
  }

  // Form data validation
  validateFormData(formData, schema) {
    const errors = {};
    const validatedData = {};

    Object.entries(schema).forEach(([field, rules]) => {
      const value = formData[field];
      const validation = this.validateField(value, rules);

      if (!validation.isValid) {
        errors[field] = validation.error;
      } else if (validation.normalized !== undefined) {
        validatedData[field] = validation.normalized;
      } else {
        validatedData[field] = value;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors,
      data: validatedData
    };
  }

  // Generic field validation
  validateField(value, rules) {
    if (rules.required && (value === undefined || value === null || value === '')) {
      return {
        isValid: false,
        error: rules.requiredMessage || 'This field is required'
      };
    }

    if (value === undefined || value === null || value === '') {
      return {
        isValid: true,
        normalized: rules.default || value
      };
    }

    // Type-specific validation
    switch (rules.type) {
      case 'email':
        return this.validateEmail(value);
      
      case 'phone':
        return this.validatePhone(value);
      
      case 'name':
        return this.validateName(value);
      
      case 'url':
        return this.validateURL(value);
      
      case 'password':
        return this.validatePassword(value);
      
      case 'text':
        return this.validateText(value, rules);
      
      case 'number':
        return this.validateNumber(value, rules);
      
      default:
        return { isValid: true, normalized: value };
    }
  }

  // Text validation
  validateText(value, rules) {
    const text = String(value).trim();
    const errors = [];

    if (rules.minLength && text.length < rules.minLength) {
      errors.push(`Must be at least ${rules.minLength} characters long`);
    }

    if (rules.maxLength && text.length > rules.maxLength) {
      errors.push(`Must be less than ${rules.maxLength} characters long`);
    }

    if (rules.pattern && !rules.pattern.test(text)) {
      errors.push(rules.patternMessage || 'Invalid format');
    }

    return {
      isValid: errors.length === 0,
      error: errors.length > 0 ? errors[0] : undefined,
      normalized: text
    };
  }

  // Number validation
  validateNumber(value, rules) {
    const num = Number(value);
    
    if (isNaN(num)) {
      return {
        isValid: false,
        error: 'Must be a valid number'
      };
    }

    const errors = [];

    if (rules.min !== undefined && num < rules.min) {
      errors.push(`Must be at least ${rules.min}`);
    }

    if (rules.max !== undefined && num > rules.max) {
      errors.push(`Must be less than or equal to ${rules.max}`);
    }

    if (rules.integer && !Number.isInteger(num)) {
      errors.push('Must be an integer');
    }

    return {
      isValid: errors.length === 0,
      error: errors.length > 0 ? errors[0] : undefined,
      normalized: num
    };
  }

  // Utility methods
  calculatePasswordStrength(password, requirements) {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (requirements.hasUpperCase) strength += 1;
    if (requirements.hasLowerCase) strength += 1;
    if (requirements.hasNumbers) strength += 1;
    if (requirements.hasSpecialChar) strength += 1;

    return Math.min(strength, 5); // 0-5 scale
  }

  isDisposableEmail(email) {
    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
      'throwawaymail.com', 'fakeinbox.com', 'yopmail.com', 'getairmail.com'
    ];

    const domain = email.split('@')[1];
    return disposableDomains.includes(domain);
  }

  // Sanitize HTML input
  sanitizeHTML(html) {
    if (typeof html !== 'string') return '';
    
    return html
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Validate date
  validateDate(dateString, options = {}) {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        error: 'Invalid date'
      };
    }

    const errors = [];

    if (options.minDate && date < new Date(options.minDate)) {
      errors.push(`Date must be after ${new Date(options.minDate).toLocaleDateString()}`);
    }

    if (options.maxDate && date > new Date(options.maxDate)) {
      errors.push(`Date must be before ${new Date(options.maxDate).toLocaleDateString()}`);
    }

    if (options.futureOnly && date <= new Date()) {
      errors.push('Date must be in the future');
    }

    if (options.pastOnly && date >= new Date()) {
      errors.push('Date must be in the past');
    }

    return {
      isValid: errors.length === 0,
      error: errors.length > 0 ? errors[0] : undefined,
      normalized: date.toISOString()
    };
  }
}

// Create and export singleton instance
const validators = new Validators();
export default validators;

// Export individual functions
export const validateEmail = (email) => validators.validateEmail(email);
export const validatePhone = (phone) => validators.validatePhone(phone);
export const validateName = (name) => validators.validateName(name);
export const validatePassword = (password) => validators.validatePassword(password);
export const validateFile = (file, options) => validators.validateFile(file, options);
export const validateAnswer = (answer, options) => validators.validateAnswer(answer, options);
export const validateResumeData = (resumeData) => validators.validateResumeData(resumeData);
export const validateFormData = (formData, schema) => validators.validateFormData(formData, schema);