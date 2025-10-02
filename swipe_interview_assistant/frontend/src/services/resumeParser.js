// Resume Parser Service for extracting information from PDF and DOCX files
import pdfParser from './pdfParser';
import docxParser from './docxParser';

class ResumeParserService {
  constructor() {
    this.supportedFormats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  }

  // Main method to extract data from resume file
  async extractResumeData(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (!this.supportedFormats.includes(file.type)) {
      throw new Error(`Unsupported file format: ${file.type}. Please upload PDF or DOCX.`);
    }

    try {
      let extractedText = '';

      // Route to appropriate parser based on file type
      if (file.type === 'application/pdf') {
        extractedText = await pdfParser.extractText(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await docxParser.extractText(file);
      }

      // Parse the extracted text for structured data
      const parsedData = this.parseResumeText(extractedText);
      
      return {
        ...parsedData,
        rawText: extractedText.substring(0, 1000) + '...', // Store truncated raw text
        fileType: file.type,
        fileName: file.name,
        fileSize: file.size,
        parsedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Resume parsing error:', error);
      throw new Error(`Failed to parse resume: ${error.message}`);
    }
  }

  // Parse extracted text to structured data
  parseResumeText(text) {
    const normalizedText = text.replace(/\s+/g, ' ').toLowerCase();
    
    return {
      name: this.extractName(text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      skills: this.extractSkills(normalizedText),
      experience: this.extractExperience(normalizedText),
      education: this.extractEducation(normalizedText),
      summary: this.extractSummary(normalizedText)
    };
  }

  // Extract name from resume text
  extractName(text) {
    // Look for patterns that typically indicate a name
    const namePatterns = [
      /^[A-Z][a-z]+ [A-Z][a-z]+/, // First line starting with capitalized words
      /([A-Z][a-z]+ [A-Z][a-z]+)(?=\s*\n)/, // Capitalized words at beginning of lines
      /resume\s+of\s+([A-Z][a-z]+ [A-Z][a-z]+)/i,
      /^([A-Z][a-z]+ [A-Z][a-z]+)(?=\s*[-•]|\s*$)/m
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        const potentialName = match[1] || match[0];
        // Basic name validation (at least two words, reasonable length)
        if (potentialName.split(' ').length >= 2 && potentialName.length <= 50) {
          return potentialName.trim();
        }
      }
    }

    return null;
  }

  // Extract email addresses
  extractEmail(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailRegex);
    return emails ? emails[0] : null;
  }

  // Extract phone numbers
  extractPhone(text) {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = text.match(phoneRegex);
    
    if (phones) {
      // Return the first phone number that looks valid
      const validPhone = phones.find(phone => {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
      });
      
      return validPhone || phones[0];
    }

    return null;
  }

  // Extract skills from resume text
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
      'linux', 'nginx', 'apache', 'rest api', 'graphql', 'websocket',
      
      // Mobile
      'react native', 'flutter', 'ios', 'android', 'swift', 'kotlin'
    ];

    const foundSkills = commonSkills.filter(skill => 
      text.includes(skill.toLowerCase())
    );

    // Return unique skills, limited to 15
    return [...new Set(foundSkills)].slice(0, 15);
  }

  // Extract experience information
  extractExperience(text) {
    const experienceIndicators = [
      'experience',
      'work experience',
      'employment',
      'professional experience',
      'career'
    ];

    const hasExperienceSection = experienceIndicators.some(indicator => 
      text.includes(indicator)
    );

    if (!hasExperienceSection) {
      return 'Not specified';
    }

    // Try to extract years of experience
    const yearsRegex = /(\d+)\s*(?:years?|yrs?)(?:\s+of)?\s+experience/;
    const yearsMatch = text.match(yearsRegex);
    
    if (yearsMatch) {
      return `${yearsMatch[1]} years of experience`;
    }

    return 'Experience section found';
  }

  // Extract education information
  extractEducation(text) {
    const educationIndicators = [
      'education',
      'university',
      'college',
      'bachelor',
      'master',
      'phd',
      'degree'
    ];

    const hasEducation = educationIndicators.some(indicator => 
      text.includes(indicator)
    );

    return hasEducation ? 'Education details found' : 'Not specified';
  }

  // Extract summary/objective
  extractSummary(text) {
    const summaryIndicators = [
      'summary',
      'objective',
      'about',
      'profile',
      'professional summary'
    ];

    // Look for summary section
    for (const indicator of summaryIndicators) {
      const indicatorIndex = text.indexOf(indicator);
      if (indicatorIndex !== -1) {
        // Extract text after the indicator (next 200 characters)
        const start = indicatorIndex + indicator.length;
        const summary = text.substring(start, start + 200).trim();
        return summary || 'Summary section found';
      }
    }

    return 'No summary available';
  }

  // Validate if file is a resume (basic check)
  async validateResume(file) {
    try {
      const data = await this.extractResumeData(file);
      
      // Basic validation - at least some structured data should be found
      const hasBasicInfo = data.name || data.email || data.phone;
      const hasContent = data.skills.length > 0 || data.experience !== 'Not specified';
      
      return {
        isValid: hasBasicInfo && hasContent,
        data: data,
        issues: []
      };

    } catch (error) {
      return {
        isValid: false,
        data: null,
        issues: [error.message]
      };
    }
  }

  // Get parser capabilities
  getCapabilities() {
    return {
      supportedFormats: this.supportedFormats,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      extractableFields: [
        'name', 'email', 'phone', 'skills', 'experience', 
        'education', 'summary'
      ]
    };
  }
}

// Create and export singleton instance
const resumeParser = new ResumeParserService();
export default resumeParser;

// Export individual functions for convenience
export const extractResumeData = (file) => resumeParser.extractResumeData(file);
export const validateResume = (file) => resumeParser.validateResume(file);