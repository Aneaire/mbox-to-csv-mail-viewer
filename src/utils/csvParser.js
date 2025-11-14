// CSV Parser utility
export class CSVParser {
  static parseCSV(csvText) {
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];
    
    const headers = this.parseLine(lines[0]);
    const emails = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = this.parseLine(line);
      const email = {};
      
      headers.forEach((header, index) => {
        email[header] = values[index] || '';
      });
      
      emails.push(this.transformEmailData(email));
    }
    
    return emails;
  }
  
  static parseLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
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
    
    // Remove HTML tags
    let cleaned = body.replace(/<[^>]*>/g, '');
    
    // Remove CSS styles
    cleaned = cleaned.replace(/#[a-fA-F0-9]{6}|rgb\([^)]+\)|rgba\([^)]+\)/g, '');
    cleaned = cleaned.replace(/font-family:[^;]*;?/g, '');
    cleaned = cleaned.replace(/color:[^;]*;?/g, '');
    cleaned = cleaned.replace(/background[^;]*;?/g, '');
    
    // Remove excessive whitespace
    cleaned = cleaned.replace(/\s+/g, ' ');
    cleaned = cleaned.replace(/\n\s*\n/g, '\n');
    
    // Remove common email headers/footers
    cleaned = cleaned.replace(/You received this message because.*?$/gim, '');
    cleaned = cleaned.replace(/--\s*Original Message--.*?$/gim, '');
    
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
        lowerSender.includes('zapier') ||
        lowerBody.includes('zap') ||
        lowerBody.includes('workflow')) {
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