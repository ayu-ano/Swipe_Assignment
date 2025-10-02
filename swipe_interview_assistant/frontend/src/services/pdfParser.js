import * as pdfjsLib from 'pdfjs-dist/webpack';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

class PDFParser {
  constructor() {
    this.isInitialized = true;
    this.pdfjsLib = pdfjsLib;
  }

  // Extract text from PDF file with real PDF parsing
  async extractText(file) {
    try {
      console.log('Starting PDF text extraction for:', file.name);
      
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const loadingTask = this.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;
      
      let fullText = '';
      const metadata = await pdfDocument.getMetadata();
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine text items into single string
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
          
        fullText += pageText + '\n\n';
        
        // Clean up page
        page.cleanup();
      }
      
      // Destroy PDF document to free memory
      await pdfDocument.destroy();
      
      console.log(`Successfully extracted text from ${pdfDocument.numPages} pages`);
      return fullText.trim();

    } catch (error) {
      console.error('PDF text extraction failed:', error);
      
      // Provide specific error messages for common issues
      if (error.name === 'InvalidPDFException') {
        throw new Error('The file appears to be corrupted or not a valid PDF.');
      } else if (error.name === 'PasswordException') {
        throw new Error('This PDF is password protected and cannot be processed.');
      } else if (error.message.includes('network')) {
        throw new Error('Failed to load PDF file. Please check your connection and try again.');
      } else {
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
      }
    }
  }

  // Extract detailed metadata from PDF
  async extractMetadata(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = this.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;
      
      const metadata = await pdfDocument.getMetadata();
      const info = pdfDocument.pdfInfo || {};
      
      const result = {
        title: metadata.info?.Title || file.name.replace('.pdf', ''),
        author: metadata.info?.Author || null,
        subject: metadata.info?.Subject || null,
        keywords: metadata.info?.Keywords || null,
        creator: metadata.info?.Creator || null,
        producer: metadata.info?.Producer || null,
        creationDate: this.parsePDFDate(metadata.info?.CreationDate),
        modificationDate: this.parsePDFDate(metadata.info?.ModDate),
        pageCount: pdfDocument.numPages,
        pdfVersion: info.pdfFormatVersion || 'Unknown',
        isLinearized: info.linearized || false,
        fileSize: file.size,
        fileName: file.name
      };
      
      await pdfDocument.destroy();
      return result;

    } catch (error) {
      console.error('PDF metadata extraction failed:', error);
      return {
        title: file.name,
        pageCount: 0,
        error: error.message
      };
    }
  }

  // Parse PDF date format (D:YYYYMMDDHHmmSS)
  parsePDFDate(dateString) {
    if (!dateString) return null;
    
    try {
      // PDF date format: D:YYYYMMDDHHmmSSOHH'mm'
      const match = dateString.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
      if (match) {
        const [_, year, month, day, hour, minute, second] = match;
        return new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour),
          parseInt(minute),
          parseInt(second)
        ).toISOString();
      }
      return null;
    } catch (error) {
      console.warn('Failed to parse PDF date:', dateString);
      return null;
    }
  }

  // Extract text with formatting and layout information
  async extractStructuredText(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = this.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;
      
      const structuredData = {
        metadata: await this.extractMetadata(file),
        pages: [],
        fullText: ''
      };

      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });
        const textContent = await page.getTextContent();
        
        const pageData = {
          pageNumber: pageNum,
          width: viewport.width,
          height: viewport.height,
          textItems: [],
          text: ''
        };

        // Process each text item with positioning information
        textContent.items.forEach(item => {
          const textItem = {
            text: item.str,
            fontSize: Math.round(item.height),
            fontName: item.fontName,
            boundingBox: {
              x: item.transform[4],
              y: item.transform[5],
              width: item.width,
              height: item.height
            },
            direction: item.dir
          };
          
          pageData.textItems.push(textItem);
        });

        // Combine text in reading order (simple top-to-bottom, left-to-right)
        pageData.textItems.sort((a, b) => {
          // Sort by Y coordinate (top to bottom), then by X coordinate (left to right)
          const yDiff = b.boundingBox.y - a.boundingBox.y;
          if (Math.abs(yDiff) > 5) return yDiff; // Different lines
          return a.boundingBox.x - b.boundingBox.x; // Same line, left to right
        });

        pageData.text = pageData.textItems.map(item => item.text).join(' ');
        structuredData.pages.push(pageData);
        structuredData.fullText += pageData.text + '\n\n';
        
        page.cleanup();
      }

      await pdfDocument.destroy();
      return structuredData;

    } catch (error) {
      console.error('Structured PDF extraction failed:', error);
      throw new Error(`Failed to extract structured text from PDF: ${error.message}`);
    }
  }

  // Extract images from PDF (basic implementation)
  async extractImages(file, maxImages = 5) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = this.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;
      
      const images = [];
      
      for (let pageNum = 1; pageNum <= pdfDocument.numPages && images.length < maxImages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const operatorList = await page.getOperatorList();
        
        // Extract image data from operator list
        for (let i = 0; i < operatorList.fnArray.length; i++) {
          if (operatorList.fnArray[i] === this.pdfjsLib.OPS.paintImageXObject) {
            const imageKey = operatorList.argsArray[i][0];
            const image = await page.objs.get(imageKey);
            
            if (image && image.data) {
              const imageData = {
                page: pageNum,
                width: image.width,
                height: image.height,
                data: image.data,
                format: this.getImageFormat(image)
              };
              
              images.push(imageData);
              
              if (images.length >= maxImages) break;
            }
          }
        }
        
        page.cleanup();
      }
      
      await pdfDocument.destroy();
      return images;

    } catch (error) {
      console.error('PDF image extraction failed:', error);
      return [];
    }
  }

  // Determine image format from PDF image object
  getImageFormat(image) {
    if (image.colorSpace && image.colorSpace.name === 'DeviceRGB') {
      return 'RGB';
    } else if (image.colorSpace && image.colorSpace.name === 'DeviceGray') {
      return 'Grayscale';
    } else if (image.filter && image.filter.name) {
      return image.filter.name;
    }
    return 'Unknown';
  }

  // Validate PDF file with detailed checks
  async validatePDF(file) {
    const issues = [];
    const warnings = [];

    // Basic file validation
    if (file.size > 10 * 1024 * 1024) {
      issues.push('File size exceeds 10MB limit');
    } else if (file.size < 100) {
      issues.push('File too small to be a valid PDF');
    }

    if (file.type !== 'application/pdf') {
      issues.push('Invalid file type. Expected PDF.');
    }

    // Try to load PDF for deeper validation
    if (issues.length === 0) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = this.pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDocument = await loadingTask.promise;
        
        const metadata = await this.extractMetadata(file);
        
        // Check for potential issues
        if (pdfDocument.numPages > 20) {
          warnings.push('Large document: Processing may take longer');
        }
        
        if (!metadata.creationDate) {
          warnings.push('PDF creation date not available');
        }
        
        // Test text extraction from first page
        const firstPage = await pdfDocument.getPage(1);
        const textContent = await firstPage.getTextContent();
        
        if (textContent.items.length === 0) {
          warnings.push('No extractable text found in first page - may be scanned document');
        }
        
        const textLength = textContent.items.reduce((sum, item) => sum + item.str.length, 0);
        if (textLength < 10) {
          warnings.push('Very little text content detected');
        }
        
        firstPage.cleanup();
        await pdfDocument.destroy();

      } catch (error) {
        issues.push(`Invalid PDF: ${error.message}`);
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

  // Get text statistics from PDF
  async getTextStatistics(file) {
    try {
      const structuredText = await this.extractStructuredText(file);
      
      const stats = {
        totalPages: structuredText.pages.length,
        totalCharacters: structuredText.fullText.length,
        totalWords: structuredText.fullText.split(/\s+/).filter(word => word.length > 0).length,
        pages: []
      };

      structuredText.pages.forEach(page => {
        const pageText = page.text;
        stats.pages.push({
          pageNumber: page.pageNumber,
          characters: pageText.length,
          words: pageText.split(/\s+/).filter(word => word.length > 0).length,
          textItems: page.textItems.length
        });
      });

      return stats;

    } catch (error) {
      console.error('PDF statistics extraction failed:', error);
      return {
        totalPages: 0,
        totalCharacters: 0,
        totalWords: 0,
        pages: [],
        error: error.message
      };
    }
  }

  // Extract specific sections from PDF (experimental)
  async extractSections(file) {
    try {
      const fullText = await this.extractText(file);
      const sections = this.identifySections(fullText);
      return sections;

    } catch (error) {
      console.error('PDF section extraction failed:', error);
      return [];
    }
  }

  // Identify common resume sections
  identifySections(text) {
    const sectionPatterns = {
      contact: /(contact|personal|information|details)/i,
      summary: /(summary|objective|profile|about)/i,
      experience: /(experience|work|employment|career)/i,
      education: /(education|academic|qualifications)/i,
      skills: /(skills|technical|technologies|competencies)/i,
      projects: /(projects|portfolio|work samples)/i,
      certifications: /(certifications|certificates)/i
    };

    const lines = text.split('\n');
    const sections = {};
    let currentSection = 'preamble';

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
          return;
        }
      }

      // Add line to current section
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
      sections[currentSection].push(trimmedLine);
    });

    // Convert arrays to text
    const result = {};
    Object.entries(sections).forEach(([section, lines]) => {
      result[section] = lines.join(' ').substring(0, 500); // Limit section length
    });

    return result;
  }

  // Get parser capabilities and status
  getCapabilities() {
    return {
      version: this.pdfjsLib.version,
      features: [
        'text-extraction',
        'metadata-extraction',
        'structured-text',
        'image-extraction',
        'validation',
        'statistics'
      ],
      maxFileSize: '10MB',
      supported: true
    };
  }
}

// Create and export singleton instance
const pdfParser = new PDFParser();
export default pdfParser;

// Export individual functions for convenience
export const extractTextFromPDF = (file) => pdfParser.extractText(file);
export const extractPDFMetadata = (file) => pdfParser.extractMetadata(file);
export const extractStructuredPDF = (file) => pdfParser.extractStructuredText(file);
export const validatePDFFile = (file) => pdfParser.validatePDF(file);
export const getPDFStatistics = (file) => pdfParser.getTextStatistics(file);
export const extractPDFSections = (file) => pdfParser.extractSections(file);