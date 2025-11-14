import { GeminiService } from './geminiService.js';

// Mock Gemini service for development without API key
export class MockGeminiService extends GeminiService {
  constructor() {
    super();
  }

  async processEmailBody(email) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockProcessedContent = this.generateMockProcessedContent(email);
    
    return {
      ...email,
      processedBody: mockProcessedContent
    };
  }

  private generateMockProcessedContent(email) {
    const subject = email.subject.toLowerCase();
    const body = email.body.toLowerCase();

    if (subject.includes('project') || subject.includes('update') || body.includes('team')) {
      return `
**Project Update - Q4 Goals**

**Main Purpose:**
- Provide update on Q4 goals and objectives progress
- Review accomplishments and plan for next quarter

**Key Accomplishments:**
✅ Completed user authentication system
✅ Implemented dashboard analytics  
✅ Deployed staging environment
✅ Conducted user testing sessions

**Next Quarter Focus:**
📱 Mobile app development
⚡ Performance optimization
🔒 Additional security features

**Action Required:**
- Review attached documents
- Schedule meeting to discuss Q1 roadmap
- Provide feedback on current progress

**Overall Context:**
This is a work-related project update requiring team coordination and planning for future development phases.
      `.trim();
    }

    if (subject.includes('tech digest') || subject.includes('newsletter')) {
      return `
**Weekly Tech Digest - Latest Trends**

**Main Purpose:**
- Share latest technology updates and trends
- Provide curated tech news for professionals

**This Week's Highlights:**

🚀 **AI & Machine Learning:**
- New GPT model released with improved capabilities
- TensorFlow announces major performance improvements
- OpenAI partners with major healthcare providers

💻 **Web Development:**
- React 19 beta released with new features
- Next.js 14 performance benchmarks published
- TypeScript adoption reaches new industry highs

🔒 **Security:**
- New vulnerability discovered in popular framework
- Best practices for API security documented
- Zero-trust architecture gaining momentum

**Call to Action:**
- Read full articles on the website
- Share with colleagues
- Stay updated on emerging technologies

**Context:**
Educational newsletter aimed at keeping tech professionals informed about industry developments.
      `.trim();
    }

    if (subject.includes('family dinner') || body.includes('mom') || body.includes('family')) {
      return `
**Family Dinner This Weekend**

**Main Purpose:**
- Organize family dinner for this Sunday
- Coordinate attendance and contributions

**Event Details:**
📅 **When:** Sunday at 6:00 PM
🏠 **Location:** Home
👥 **Attendees:** You, sister, and her family

**Menu:**
- Main dish: Lasagna (host)
- Side dishes: Salad/appetizers (guests)
- Dessert: Chocolate cake (optional)

**Action Items:**
📋 **Bring:** Salad or appetizer, chocolate cake (if possible)
📞 **RSVP:** Confirm attendance for headcount
🎯 **Goal:** Family gathering and quality time together

**Context:**
Personal family event planning with warm, friendly tone focused on togetherness and shared meal.
      `.trim();
    }

    if (subject.includes('connection') || subject.includes('linkedin')) {
      return `
**LinkedIn Connection Requests**

**Main Purpose:**
- Notify about new professional connection requests
- Encourage network growth and engagement

**New Connection Requests (3):**

1. **Alex Chen** - Software Engineer at TechCorp
2. **Maria Garcia** - Product Manager at StartupXYZ  
3. **David Wilson** - Full Stack Developer at WebSolutions

**Available Actions:**
- Review and accept connection requests
- Send personalized connection requests
- Manage notification preferences

**Context:**
Professional networking opportunity through LinkedIn platform, encouraging career connections and industry relationships.
      `.trim();
    }

    if (subject.includes('amazon') || subject.includes('order') || body.includes('shipped')) {
      return `
**Amazon Order Shipped**

**Main Purpose:**
- Confirm order shipment and provide tracking information
- Update on delivery timeline

**Order Details:**
📦 **Order Number:** 123-4567890
📱 **Items:** Wireless Bluetooth Headphones, Phone Case
📍 **Destination:** 123 Main St, Apt 4B, New York, NY 10001
🚚 **Estimated Delivery:** January 18, 2024

**Tracking Information:**
🔍 **Tracking Number:** 1Z999W999999999999
📊 **Status:** In transit

**Next Steps:**
- Monitor package progress
- Prepare for delivery
- Contact customer service if issues arise

**Context:**
E-commerce order fulfillment notification with tracking details and delivery expectations.
      `.trim();
    }

    // Default processing for unknown emails
    return `
**Email Summary**

**Main Purpose:**
- ${email.subject}

**Key Information:**
- From: ${email.sender}
- Date: ${new Date(email.timestamp).toLocaleDateString()}
- Category: General communication

**Content:**
${email.body.substring(0, 200)}...

**Note:**
This is a general email that may contain important information requiring attention.
      `.trim();
  }
}

// Export singleton instance
export const geminiService = new MockGeminiService();