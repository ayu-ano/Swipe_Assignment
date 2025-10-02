import mammoth from 'mammoth';

class DOCXParser {
  constructor() {
    this.isInitialized = true;
    this.supportedFormats = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
  }

  // Extract raw text from DOCX file
  async extractText(file) {
    try {
      console.log('Starting DOCX text extraction for:', file.name);
      
      const arrayBuffer = await file.arrayBuffer();
      
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      if (result.value) {
        const text = this.cleanText(result.value);
        console.log(`Successfully extracted ${text.length} characters from DOCX`);
        return text;
      } else {
        throw new Error('No text content found in DOCX file');
      }

    } catch (error) {
      console.error('DOCX text extraction failed:', error);
      
      if (error.message.includes('corrupt')) {
        throw new Error('The DOCX file appears to be corrupted or invalid.');
      } else if (error.message.includes('Not a ZIP archive')) {
        throw new Error('The file is not a valid DOCX document.');
      } else {
        throw new Error(`Failed to extract text from DOCX: ${error.message}`);
      }
    }
  }

  // Extract text with HTML formatting
  async extractFormattedText(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      const result = await mammoth.convertToHtml({ 
        arrayBuffer,
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "r[style-name='Strong'] => strong",
          "r[style-name='Emphasis'] => em"
        ]
      });
      
      return {
        html: result.value,
        messages: result.messages,
        formatted: true
      };

    } catch (error) {
      console.error('DOCX formatted text extraction failed:', error);
      throw new Error(`Failed to extract formatted text from DOCX: ${error.message}`);
    }
  }

  // Extract structured content from DOCX
  async extractStructuredContent(file) {
    try {
      const [rawText, formatted] = await Promise.all([
        this.extractText(file),
        this.extractFormattedText(file)
      ]);

      const sections = this.identifySections(rawText);
      const lists = this.extractLists(rawText);
      const tables = await this.extractTables(file);

      return {
        rawText,
        html: formatted.html,
        sections,
        lists,
        tables,
        metadata: await this.extractMetadata(file),
        statistics: this.calculateStatistics(rawText)
      };

    } catch (error) {
      console.error('DOCX structured extraction failed:', error);
      throw new Error(`Failed to extract structured content from DOCX: ${error.message}`);
    }
  }

  // Extract tables from DOCX
  async extractTables(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      const result = await mammoth.convertToHtml({ 
        arrayBuffer,
        transformDocument: this.transformTables.bind(this)
      });

      // Parse tables from HTML
      const tables = this.parseTablesFromHTML(result.value);
      return tables;

    } catch (error) {
      console.error('DOCX table extraction failed:', error);
      return [];
    }
  }

  // Transform tables during conversion
  transformTables(element) {
    if (element.type === "table") {
      return {
        ...element,
        type: "table",
        children: element.children.map(row => ({
          ...row,
          type: "tr",
          children: row.children.map(cell => ({
            ...cell,
            type: "td"
          }))
        }))
      };
    }
    return element;
  }

  // Parse tables from HTML
  parseTablesFromHTML(html) {
    const tables = [];
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    let match;

    while ((match = tableRegex.exec(html)) !== null) {
      const tableHTML = match[0];
      const rows = [];
      
      const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let rowMatch;
      
      while ((rowMatch = rowRegex.exec(tableHTML)) !== null) {
        const cells = [];
        const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
        let cellMatch;
        
        while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
          cells.push(this.stripHTML(cellMatch[1]).trim());
        }
        
        if (cells.length > 0) {
          rows.push(cells);
        }
      }
      
      if (rows.length > 0) {
        tables.push({
          rows: rows,
          columns: Math.max(...rows.map(row => row.length))
        });
      }
    }

    return tables;
  }

  // Extract metadata from DOCX
  async extractMetadata(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // For more detailed metadata, we'd need a different library
      // This is a basic implementation
      return {
        title: this.extractTitleFromFilename(file.name),
        author: null, // Would require more complex parsing
        subject: null,
        creationDate: new Date(file.lastModified).toISOString(),
        modificationDate: new Date(file.lastModified).toISOString(),
        fileSize: file.size,
        fileName: file.name,
        type: 'DOCX',
        wordCount: await this.calculateWordCount(file)
      };

    } catch (error) {
      console.error('DOCX metadata extraction failed:', error);
      return {
        title: file.name,
        error: error.message
      };
    }
  }

  // Calculate word count
  async calculateWordCount(file) {
    try {
      const text = await this.extractText(file);
      return text.split(/\s+/).filter(word => word.length > 0).length;
    } catch (error) {
      return 0;
    }
  }

  // Identify sections in resume text
  identifySections(text) {
    const sectionPatterns = {
      contact: /(contact|personal|information|details|^[A-Z][a-z]+ [A-Z][a-z]+$)/im,
      summary: /(summary|objective|profile|about|executive\s+summary)/im,
      experience: /(experience|work\s+history|employment|career|professional)/im,
      education: /(education|academic|qualifications|degrees)/im,
      skills: /(skills|technical|technologies|competencies|expertise)/im,
      projects: /(projects|portfolio|work\s+samples|achievements)/im,
      certifications: /(certifications|certificates|licenses)/im
    };

    const lines = text.split('\n');
    const sections = {};
    let currentSection = 'header';

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.length < 2) return;

      // Check if this line starts a new section
      for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
        if (pattern.test(trimmedLine)) {
          currentSection = sectionName;
          if (!sections[sectionName]) {
            sections[sectionName] = [];
          }
          sections[sectionName].push(`[SECTION_HEADER] ${trimmedLine}`);
          return;
        }
      }

      // Add line to current section
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
      sections[currentSection].push(trimmedLine);
    });

    // Convert arrays to text and clean up
    const result = {};
    Object.entries(sections).forEach(([section, lines]) => {
      const content = lines.join('\n').replace(/\[SECTION_HEADER\] /g, '');
      result[section] = this.cleanSectionContent(content);
    });

    return result;
  }

  // Extract lists from text
  extractLists(text) {
    const listItems = text.split('\n')
      .filter(line => {
        // Match bullet points, numbered lists, or lines starting with -
        return /^[•\-\*]\s|^\d+\.\s|^\[|\]/.test(line.trim());
      })
      .map(item => item.trim());

    return {
      bulletPoints: listItems.filter(item => /^[•\-\*]/.test(item)),
      numberedItems: listItems.filter(item => /^\d+\./.test(item)),
      otherLists: listItems.filter(item => !/^[•\-\*]|^\d+\./.test(item))
    };
  }

  // Calculate text statistics
  calculateStatistics(text) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return {
      characters: text.length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
      avgWordLength: words.length > 0 ? 
        words.reduce((sum, word) => sum + word.length, 0) / words.length : 0,
      avgSentenceLength: sentences.length > 0 ? 
        words.length / sentences.length : 0
    };
  }

  // Validate DOCX file
  async validateDOCX(file) {
    const issues = [];
    const warnings = [];

    // Basic file validation
    if (file.size > 10 * 1024 * 1024) {
      issues.push('File size exceeds 10MB limit');
    } else if (file.size < 100) {
      issues.push('File too small to be a valid DOCX');
    }

    if (!this.supportedFormats.includes(file.type)) {
      issues.push(`Unsupported file type: ${file.type}`);
    }

    // Try to parse the file for deeper validation
    if (issues.length === 0) {
      try {
        const text = await this.extractText(file);
        
        if (text.length < 50) {
          warnings.push('Very little text content detected - file may not be a resume');
        }
        
        if (text.length > 50000) {
          warnings.push('Very large document - processing may take longer');
        }

        // Check if it looks like a resume
        const resumeIndicators = ['experience', 'education', 'skills', 'summary'];
        const hasResumeContent = resumeIndicators.some(indicator => 
          text.toLowerCase().includes(indicator)
        );

        if (!hasResumeContent) {
          warnings.push('Document may not be a resume - missing common resume sections');
        }

      } catch (error) {
        issues.push(`Invalid DOCX file: ${error.message}`);
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      fileSize: file.size,
      fileName: file.name
    };
  }

  // Utility methods
  cleanText(text) {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\t/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  cleanSectionContent(content) {
    return content
      .replace(/\n{3,}/g, '\n\n')
      .substring(0, 1000) // Limit section length
      .trim();
  }

  stripHTML(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  extractTitleFromFilename(filename) {
    return filename
      .replace('.docx', '')
      .replace('.doc', '')
      .replace(/_/g, ' ')
      .replace(/-/g, ' ');
  }

  // Get parser capabilities
  getCapabilities() {
    return {
      version: '1.0.0',
      features: [
        'text-extraction',
        'html-conversion',
        'section-identification',
        'table-extraction',
        'list-extraction',
        'metadata-extraction',
        'validation'
      ],
      maxFileSize: '10MB',
      supportedFormats: this.supportedFormats
    };
  }
}

// Create and export singleton instance
const docxParser = new DOCXParser();
export default docxParser;

// Export individual functions
export const extractTextFromDOCX = (file) => docxParser.extractText(file);
export const extractFormattedDOCX = (file) => docxParser.extractFormattedText(file);
export const extractStructuredDOCX = (file) => docxParser.extractStructuredContent(file);
export const validateDOCXFile = (file) => docxParser.validateDOCX(file);