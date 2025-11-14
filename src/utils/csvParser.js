// CSV Parser utility
export class CSVParser {
  static parseCSV(csvText) {
    // Handle different line endings
    const normalizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Parse CSV properly handling quoted fields and line breaks
    const { headers, rows } = this.parseCSVRows(normalizedText);
    
    if (headers.length === 0 || rows.length === 0) return [];
    
    const emails = [];
    
    for (const row of rows) {
      if (row.length === 0) continue;
      
      const email = {};
      headers.forEach((header, index) => {
        email[header] = row[index] || '';
      });
      
      emails.push(this.transformEmailData(email));
    }
    
    return emails;
  }
  
  static parseCSVRows(csvText) {
    const lines = csvText.split('\n');
    if (lines.length === 0) return { headers: [], rows: [] };
    
    // Parse header
    const headers = this.parseCSVLine(lines[0]);
    
    // Parse data rows
    const rows = [];
    let currentRow = [];
    let inQuotes = false;
    let currentField = '';
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          // Handle escaped quotes
          if (j + 1 < line.length && line[j + 1] === '"') {
            currentField += '"';
            j++; // Skip the escaped quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          currentRow.push(currentField.trim());
          currentField = '';
        } else {
          currentField += char;
        }
      }
      
      // End of line
      if (!inQuotes) {
        currentRow.push(currentField.trim());
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        // Still in quotes, add newline to field
        currentField += '\n';
      }
    }
    
    // Handle last field if file doesn't end with newline
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      rows.push(currentRow);
    }
    
    return { headers, rows };
  }
  
  static parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        // Handle escaped quotes
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // Skip the escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }
  
  static transformEmailData(csvEmail) {
    // Extract sender name and email from "From" field
    const fromField = csvEmail.From || '';
    const senderMatch = fromField.match(/^(.+?)\s*<(.+?)>$/);
    let sender = fromField;
    let senderEmail = '';
    
    if (senderMatch) {
      sender = senderMatch[1].trim();
      senderEmail = senderMatch[2].trim();
    } else if (fromField.includes('@')) {
      sender = fromField.split('@')[0];
      senderEmail = fromField;
    }
    
    // Parse date
    const dateStr = csvEmail.Date || '';
    const timestamp = this.parseDate(dateStr);
    
    // Clean subject (remove [ALERT] prefix)
    let subject = csvEmail.Subject || '';
    subject = subject.replace(/^\[ALERT\]\s*/i, '');
    
    // Clean body (remove HTML tags and CSS)
    let body = csvEmail.Body || '';
    body = this.cleanEmailBody(body);
    
    // Determine category based on content
    const category = this.determineCategory(sender, subject, body);
    
    return {
      id: csvEmail['Message-ID'] || `email-${Date.now()}-${Math.random()}`,
      sender,
      senderEmail,
      subject,
      body,
      timestamp,
      read: false,
      category,
      hasAttachments: csvEmail.Attachments && csvEmail.Attachments.trim() !== ''
    };
  }
  
  static parseDate(dateStr) {
    if (!dateStr) return new Date().toISOString();
    
    // Handle ISO format: 2025-11-10T23:37:06.000Z
    if (dateStr.includes('T') && dateStr.includes('Z')) {
      return dateStr;
    }
    
    // Try to parse other formats
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  }
  
  static cleanEmailBody(body) {
    if (!body) return '';
    
    // Extract text content from HTML more intelligently
    let cleaned = body;
    
    // Remove CSS style blocks first
    cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Remove HTML comments
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
    
    // Convert common HTML tags to text
    cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
    cleaned = cleaned.replace(/<\/p>/gi, '\n\n');
    cleaned = cleaned.replace(/<\/div>/gi, '\n');
    cleaned = cleaned.replace(/<\/h[1-6]>/gi, '\n\n');
    
    // Remove remaining HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    cleaned = cleaned.replace(/&nbsp;/g, ' ');
    cleaned = cleaned.replace(/&amp;/g, '&');
    cleaned = cleaned.replace(/&lt;/g, '<');
    cleaned = cleaned.replace(/&gt;/g, '>');
    cleaned = cleaned.replace(/&quot;/g, '"');
    cleaned = cleaned.replace(/&#39;/g, "'");
    
    // Remove CSS properties and hex colors
    cleaned = cleaned.replace(/#[a-fA-F0-9]{6}|rgb\([^)]+\)|rgba\([^)]+\)/g, '');
    cleaned = cleaned.replace(/font-family:[^;]*;?/g, '');
    cleaned = cleaned.replace(/color:[^;]*;?/g, '');
    cleaned = cleaned.replace(/background[^;]*;?/g, '');
    cleaned = cleaned.replace(/margin[^;]*;?/g, '');
    cleaned = cleaned.replace(/padding[^;]*;?/g, '');
    cleaned = cleaned.replace(/width[^;]*;?/g, '');
    cleaned = cleaned.replace(/height[^;]*;?/g, '');
    
    // Remove excessive whitespace and clean up
    cleaned = cleaned.replace(/\s+/g, ' ');
    cleaned = cleaned.replace(/\n\s*\n/g, '\n');
    cleaned = cleaned.replace(/^\s+|\s+$/g, '');
    
    // Remove common email headers/footers
    cleaned = cleaned.replace(/You received this message because.*?$/gim, '');
    cleaned = cleaned.replace(/--\s*Original Message--.*?$/gim, '');
    cleaned = cleaned.replace(/This email was sent.*?$/gim, '');
    
    // Limit body length to prevent extremely long content
    if (cleaned.length > 2000) {
      cleaned = cleaned.substring(0, 2000) + '...';
    }
    
    return cleaned.trim();
  }
  
  static determineCategory(sender, subject, body) {
    const lowerSubject = subject.toLowerCase();
    const lowerBody = body.toLowerCase();
    const lowerSender = sender.toLowerCase();
    
    // Work/Professional
    if (lowerSubject.includes('zapier') || 
        lowerSubject.includes('error') || 
        lowerSubject.includes('alert') ||
        lowerSubject.includes('filevine') ||
        lowerSubject.includes('task assigned') ||
        lowerSender.includes('zapier') ||
        lowerSender.includes('filevine') ||
        lowerBody.includes('zap') ||
        lowerBody.includes('workflow') ||
        lowerBody.includes('task')) {
      return 'work';
    }
    
    // Personal
    if (lowerSubject.includes('family') || 
        lowerSubject.includes('personal') ||
        lowerBody.includes('family') ||
        lowerBody.includes('personal')) {
      return 'personal';
    }
    
    // Social
    if (lowerSubject.includes('notification') || 
        lowerSubject.includes('update') ||
        lowerSubject.includes('social') ||
        lowerBody.includes('social') ||
        lowerBody.includes('network')) {
      return 'social';
    }
    
    // Promotion
    if (lowerSubject.includes('offer') || 
        lowerSubject.includes('deal') ||
        lowerSubject.includes('discount') ||
        lowerSubject.includes('sale') ||
        lowerBody.includes('buy') ||
        lowerBody.includes('shop')) {
      return 'promotion';
    }
    
    return 'work'; // Default to work
  }
}