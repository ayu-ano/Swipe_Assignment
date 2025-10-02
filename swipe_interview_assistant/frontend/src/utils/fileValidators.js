// File Validators Utility for file type and content validation
class FileValidators {
  constructor() {
    this.supportedFormats = this.initializeSupportedFormats();
    this.fileSignatures = this.initializeFileSignatures();
  }

  // Initialize supported file formats
  initializeSupportedFormats() {
    return {
      // Document formats
      'application/pdf': {
        extensions: ['.pdf'],
        mimeType: 'application/pdf',
        maxSize: 10 * 1024 * 1024, // 10MB
        category: 'document'
      },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
        extensions: ['.docx'],
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        maxSize: 10 * 1024 * 1024, // 10MB
        category: 'document'
      },
      'application/msword': {
        extensions: ['.doc'],
        mimeType: 'application/msword',
        maxSize: 10 * 1024 * 1024, // 10MB
        category: 'document'
      },
      
      // Image formats (for profile pictures, etc.)
      'image/jpeg': {
        extensions: ['.jpg', '.jpeg'],
        mimeType: 'image/jpeg',
        maxSize: 5 * 1024 * 1024, // 5MB
        category: 'image'
      },
      'image/png': {
        extensions: ['.png'],
        mimeType: 'image/png',
        maxSize: 5 * 1024 * 1024, // 5MB
        category: 'image'
      },
      'image/gif': {
        extensions: ['.gif'],
        mimeType: 'image/gif',
        maxSize: 5 * 1024 * 1024, // 5MB
        category: 'image'
      },
      
      // Text formats
      'text/plain': {
        extensions: ['.txt'],
        mimeType: 'text/plain',
        maxSize: 1 * 1024 * 1024, // 1MB
        category: 'text'
      }
    };
  }

  // Initialize file signatures (magic numbers) for content validation
  initializeFileSignatures() {
    return {
      // PDF signature
      'application/pdf': [
        [0x25, 0x50, 0x44, 0x46] // %PDF
      ],
      
      // DOCX signature (ZIP-based format)
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
        [0x50, 0x4B, 0x03, 0x04], // PK..
        [0x50, 0x4B, 0x05, 0x06], // PK.. (empty archive)
        [0x50, 0x4B, 0x07, 0x08]  // PK.. (spanned archive)
      ],
      
      // DOC signature (OLE-based format)
      'application/msword': [
        [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1] // DOC file signature
      ],
      
      // Image signatures
      'image/jpeg': [
        [0xFF, 0xD8, 0xFF, 0xE0], // JPEG
        [0xFF, 0xD8, 0xFF, 0xE1], // JPEG with EXIF
        [0xFF, 0xD8, 0xFF, 0xE2]  // JPEG with ICC
      ],
      'image/png': [
        [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] // PNG
      ],
      'image/gif': [
        [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
        [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]  // GIF89a
      ],
      
      // Text files (no specific signature, but we can check for binary content)
      'text/plain': []
    };
  }

  // Validate file type
  validateFileType(file, allowedTypes = []) {
    if (!file || !(file instanceof File)) {
      return {
        isValid: false,
        error: 'Invalid file object'
      };
    }

    const fileInfo = this.supportedFormats[file.type];
    
    if (!fileInfo) {
      return {
        isValid: false,
        error: `Unsupported file type: ${file.type}`
      };
    }

    // Check if file type is in allowed types
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      const allowedExtensions = allowedTypes
        .map(type => this.supportedFormats[type]?.extensions[0])
        .filter(ext => ext)
        .join(', ');
      
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${allowedExtensions}`
      };
    }

    // Validate file extension
    const extension = this.getFileExtension(file.name);
    if (!fileInfo.extensions.includes(extension.toLowerCase())) {
      return {
        isValid: false,
        error: `File extension ${extension} does not match type ${file.type}`
      };
    }

    return {
      isValid: true,
      fileInfo: fileInfo
    };
  }

  // Validate file size
  validateFileSize(file, maxSize = null) {
    if (!file || !(file instanceof File)) {
      return {
        isValid: false,
        error: 'Invalid file object'
      };
    }

    const defaultMaxSize = this.supportedFormats[file.type]?.maxSize || 5 * 1024 * 1024;
    const actualMaxSize = maxSize || defaultMaxSize;

    if (file.size > actualMaxSize) {
      const maxSizeMB = (actualMaxSize / (1024 * 1024)).toFixed(1);
      return {
        isValid: false,
        error: `File size must be less than ${maxSizeMB}MB`
      };
    }

    if (file.size === 0) {
      return {
        isValid: false,
        error: 'File is empty'
      };
    }

    return {
      isValid: true,
      fileSize: file.size
    };
  }

  // Validate file content using magic numbers
  async validateFileContent(file) {
    if (!file || !(file instanceof File)) {
      return {
        isValid: false,
        error: 'Invalid file object'
      };
    }

    try {
      const arrayBuffer = await file.slice(0, 8).arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const detectedType = this.detectFileTypeBySignature(uint8Array);
      
      if (detectedType && detectedType !== file.type) {
        return {
          isValid: false,
          error: `File content does not match declared type. Detected: ${detectedType}`
        };
      }

      // Additional content validation based on file type
      const contentValidation = await this.validateSpecificContent(file, uint8Array);
      if (!contentValidation.isValid) {
        return contentValidation;
      }

      return {
        isValid: true,
        detectedType: detectedType || file.type
      };

    } catch (error) {
      console.error('File content validation failed:', error);
      return {
        isValid: false,
        error: 'Failed to validate file content'
      };
    }
  }

  // Detect file type by magic number signature
  detectFileTypeBySignature(uint8Array) {
    for (const [fileType, signatures] of Object.entries(this.fileSignatures)) {
      for (const signature of signatures) {
        if (this.matchesSignature(uint8Array, signature)) {
          return fileType;
        }
      }
    }
    return null;
  }

  // Check if file data matches signature
  matchesSignature(uint8Array, signature) {
    if (uint8Array.length < signature.length) {
      return false;
    }

    for (let i = 0; i < signature.length; i++) {
      if (uint8Array[i] !== signature[i]) {
        return false;
      }
    }

    return true;
  }

  // Validate specific content based on file type
  async validateSpecificContent(file, headerBytes) {
    switch (file.type) {
      case 'application/pdf':
        return this.validatePDFContent(file, headerBytes);
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return this.validateDOCXContent(file, headerBytes);
      
      case 'application/msword':
        return this.validateDOCContent(file, headerBytes);
      
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return this.validateImageContent(file, headerBytes);
      
      case 'text/plain':
        return this.validateTextContent(file, headerBytes);
      
      default:
        return { isValid: true };
    }
  }

  // PDF content validation
  async validatePDFContent(file, headerBytes) {
    // Basic PDF validation - check for PDF header
    if (!this.matchesSignature(headerBytes, [0x25, 0x50, 0x44, 0x46])) {
      return {
        isValid: false,
        error: 'Invalid PDF file: Missing PDF signature'
      };
    }

    // Check for PDF trailer (basic structure validation)
    try {
      const trailerBuffer = await file.slice(file.size - 128, file.size).arrayBuffer();
      const trailer = new TextDecoder().decode(trailerBuffer);
      
      if (!trailer.includes('%%EOF')) {
        return {
          isValid: false,
          warning: 'PDF file may be corrupted or incomplete'
        };
      }
    } catch (error) {
      // If we can't read the trailer, it's not necessarily invalid
      console.warn('Could not read PDF trailer:', error);
    }

    return { isValid: true };
  }

  // DOCX content validation
  async validateDOCXContent(file, headerBytes) {
    // DOCX is a ZIP archive, check for ZIP signature
    if (!this.matchesSignature(headerBytes, [0x50, 0x4B, 0x03, 0x04])) {
      return {
        isValid: false,
        error: 'Invalid DOCX file: Not a valid ZIP archive'
      };
    }

    // Check for required DOCX structure files
    try {
      const centralDirectoryBuffer = await file.slice(file.size - 256, file.size).arrayBuffer();
      const centralDirectory = new TextDecoder().decode(centralDirectoryBuffer);
      
      // DOCX should contain specific files in its structure
      if (!centralDirectory.includes('[Content_Types].xml') && 
          !centralDirectory.includes('word/document.xml')) {
        return {
          isValid: false,
          error: 'Invalid DOCX file: Missing required document structure'
        };
      }
    } catch (error) {
      console.warn('Could not validate DOCX structure:', error);
    }

    return { isValid: true };
  }

  // DOC content validation
  async validateDOCContent(file, headerBytes) {
    // DOC files use OLE compound file format
    if (!this.matchesSignature(headerBytes, [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1])) {
      return {
        isValid: false,
        error: 'Invalid DOC file: Not a valid OLE compound document'
      };
    }

    return { isValid: true };
  }

  // Image content validation
  async validateImageContent(file, headerBytes) {
    // Basic image validation - check dimensions for very large images
    try {
      const image = await this.createImageFromFile(file);
      
      if (image.width > 10000 || image.height > 10000) {
        return {
          isValid: false,
          error: 'Image dimensions are too large'
        };
      }

      if (image.width === 0 || image.height === 0) {
        return {
          isValid: false,
          error: 'Invalid image dimensions'
        };
      }

    } catch (error) {
      return {
        isValid: false,
        error: 'Failed to load image - file may be corrupted'
      };
    }

    return { isValid: true };
  }

  // Text content validation
  async validateTextContent(file, headerBytes) {
    // Check for binary content in text files
    for (let i = 0; i < Math.min(headerBytes.length, 1024); i++) {
      if (headerBytes[i] === 0) {
        return {
          isValid: false,
          error: 'File appears to be binary, not text'
        };
      }
    }

    return { isValid: true };
  }

  // Comprehensive file validation
  async validateFile(file, options = {}) {
    const {
      allowedTypes = Object.keys(this.supportedFormats),
      maxSize = null,
      validateContent = true
    } = options;

    const results = {
      isValid: true,
      errors: [],
      warnings: [],
      fileInfo: {
        name: file.name,
        type: file.type,
        size: file.size,
        extension: this.getFileExtension(file.name)
      }
    };

    // Validate file type
    const typeValidation = this.validateFileType(file, allowedTypes);
    if (!typeValidation.isValid) {
      results.isValid = false;
      results.errors.push(typeValidation.error);
    } else {
      results.fileInfo.category = typeValidation.fileInfo.category;
    }

    // Validate file size
    const sizeValidation = this.validateFileSize(file, maxSize);
    if (!sizeValidation.isValid) {
      results.isValid = false;
      results.errors.push(sizeValidation.error);
    }

    // Validate file content (if requested and no errors so far)
    if (results.isValid && validateContent) {
      const contentValidation = await this.validateFileContent(file);
      if (!contentValidation.isValid) {
        results.isValid = false;
        results.errors.push(contentValidation.error);
      }
      if (contentValidation.warning) {
        results.warnings.push(contentValidation.warning);
      }
    }

    // Additional security checks
    const securityCheck = this.securityCheck(file);
    if (!securityCheck.isValid) {
      results.isValid = false;
      results.errors.push(securityCheck.error);
    }

    return results;
  }

  // Security checks for uploaded files
  securityCheck(file) {
    const errors = [];

    // Check for potentially dangerous file names
    const dangerousPatterns = [
      /\.\.\//, // Path traversal
      /\.php$/, // PHP files
      /\.exe$/, // Executable files
      /\.js$/,  // JavaScript files
      /\.html?$/, // HTML files
      /\.jar$/, // Java archives
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(file.name.toLowerCase())) {
        errors.push(`Potentially dangerous file type: ${file.name}`);
        break;
      }
    }

    // Check for extremely long file names
    if (file.name.length > 255) {
      errors.push('File name is too long');
    }

    // Check for null bytes in file name (potential security issue)
    if (file.name.includes('\0')) {
      errors.push('Invalid file name');
    }

    return {
      isValid: errors.length === 0,
      error: errors.length > 0 ? errors[0] : undefined
    };
  }

  // Get file extension
  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
  }

  // Create image from file for validation
  createImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);
      
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      image.src = url;
    });
  }

  // Get supported formats for display
  getSupportedFormats(category = null) {
    if (category) {
      return Object.values(this.supportedFormats)
        .filter(format => format.category === category)
        .map(format => format.extensions[0]);
    }
    
    return Object.values(this.supportedFormats)
      .map(format => format.extensions[0])
      .filter(ext => ext);
  }

  // Get maximum file size for a type
  getMaxFileSize(fileType) {
    return this.supportedFormats[fileType]?.maxSize || 5 * 1024 * 1024;
  }

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Validate multiple files
  async validateFiles(files, options = {}) {
    const validations = await Promise.all(
      files.map(file => this.validateFile(file, options))
    );

    const overallValidation = {
      allValid: validations.every(v => v.isValid),
      validFiles: validations.filter(v => v.isValid).map(v => v.fileInfo),
      invalidFiles: validations.filter(v => !v.isValid).map(v => ({
        file: v.fileInfo,
        errors: v.errors
      })),
      totalFiles: files.length,
      validCount: validations.filter(v => v.isValid).length
    };

    return overallValidation;
  }
}

// Create and export singleton instance
const fileValidators = new FileValidators();
export default fileValidators;

// Export individual functions
export const validateFileType = (file, allowedTypes) => 
  fileValidators.validateFileType(file, allowedTypes);

export const validateFileSize = (file, maxSize) => 
  fileValidators.validateFileSize(file, maxSize);

export const validateFileContent = (file) => 
  fileValidators.validateFileContent(file);

export const validateFile = (file, options) => 
  fileValidators.validateFile(file, options);

export const validateFiles = (files, options) => 
  fileValidators.validateFiles(files, options);

export const getSupportedFormats = (category) => 
  fileValidators.getSupportedFormats(category);

export const formatFileSize = (bytes) => 
  fileValidators.formatFileSize(bytes);