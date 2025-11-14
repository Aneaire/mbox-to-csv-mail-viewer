import { CSVParser } from '../utils/csvParser.js';

export class EmailDataService {
  static async loadEmailsFromCSV() {
    try {
      const response = await fetch('/Email_Export_nikos_kevin_Nov_3,_2025_to_Nov_10,_2025_filtered.csv');
      const csvText = await response.text();
      
      const emails = CSVParser.parseCSV(csvText);
      console.log(`Loaded ${emails.length} emails from CSV`);
      return emails;
    } catch (error) {
      console.error('Error loading CSV:', error);
      // Fallback to mock data
      return this.loadEmailsFromMockCSV();
    }
  }

  static async loadEmailsFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvText = e.target.result;
          const emails = CSVParser.parseCSV(csvText);
          console.log(`Loaded ${emails.length} emails from uploaded file: ${file.name}`);
          resolve(emails);
        } catch (error) {
          console.error('Error parsing uploaded CSV:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }
  
  static async loadEmailsFromMockCSV() {
    // For development, we'll create mock data based on the CSV structure
    const mockCSVData = [
      {
        From: 'Zapier Alerts <alerts@mail.zapier.com>',
        To: 'lito@farahilaw.com',
        Subject: '[ALERT] Possible error on your Random Intakes Calls Analyzer Zap',
        Date: '2025-11-10T23:37:06.000Z',
        'Message-ID': '<20251110233706.96f236b554e2b1b1@mail.zapier.com>',
        'Content-Type': 'text/html; charset="utf-8"',
        Body: 'There was an error in your Zap "Random Intakes Calls Analyzer - include RC SESSION ID Zap". We tried to run the step "Create RC Session Record" but encountered an error. Please check your configuration and try again.',
        Attachments: ''
      },
      {
        From: 'John Smith <john.smith@company.com>',
        To: 'lito@farahilaw.com',
        Subject: 'Project Update - Q4 Goals',
        Date: '2025-11-09T10:30:00.000Z',
        'Message-ID': '<20251109103000.abc123@company.com>',
        'Content-Type': 'text/plain; charset="utf-8"',
        Body: `Hi Team,

I wanted to provide an update on our Q4 goals and objectives. We've made significant progress on the main project milestones this quarter.

Key accomplishments:
- Completed user authentication system
- Implemented dashboard analytics
- Deployed staging environment
- Conducted user testing sessions

For next quarter, we're focusing on:
- Mobile app development
- Performance optimization
- Additional security features

Please review the attached documents and let me know if you have any questions. We should schedule a meeting to discuss the roadmap for Q1.

Best regards,
John`,
        Attachments: 'Q4_Report.pdf'
      },
      {
        From: 'Sarah Johnson <sarah.j@newsletter.com>',
        To: 'lito@farahilaw.com',
        Subject: 'Weekly Tech Digest - Latest Trends',
        Date: '2025-11-08T09:15:00.000Z',
        'Message-ID': '<20251108091500.def456@newsletter.com>',
        'Content-Type': 'text/html; charset="utf-8"',
        Body: `Hello Subscriber,

This week's tech digest brings you the latest updates from the world of technology:

🚀 AI & Machine Learning:
- New GPT model released with improved capabilities
- TensorFlow announces major performance improvements
- OpenAI partners with major healthcare providers

💻 Web Development:
- React 19 beta released with new features
- Next.js 14 performance benchmarks
- TypeScript adoption reaches new highs

🔒 Security:
- New vulnerability discovered in popular framework
- Best practices for API security
- Zero-trust architecture gaining momentum

Read the full articles on our website. Don't forget to share with your colleagues!

Stay tech-savvy,
The Tech Digest Team`,
        Attachments: ''
      },
      {
        From: 'Mom <mom.family@email.com>',
        To: 'lito@farahilaw.com',
        Subject: 'Family Dinner This Weekend',
        Date: '2025-11-07T18:45:00.000Z',
        'Message-ID': '<20251107184500.ghi789@email.com>',
        'Content-Type': 'text/plain; charset="utf-8"',
        Body: `Hi Sweetheart,

How are you doing? I hope work is going well.

I wanted to let you know that we're having family dinner this Sunday at 6 PM. Your sister and her family will be coming over too. I'm making your favorite lasagna and garlic bread.

Could you please bring:
- A salad or appetizer
- Your famous chocolate cake (if you have time)

Also, let me know if you can make it so I can get a headcount. Looking forward to seeing you!

Love,
Mom ❤️`,
        Attachments: ''
      },
      {
        From: 'LinkedIn <messages-noreply@linkedin.com>',
        To: 'lito@farahilaw.com',
        Subject: 'You have 3 new connection requests',
        Date: '2025-11-06T14:20:00.000Z',
        'Message-ID': '<20251106142000.jkl012@linkedin.com>',
        'Content-Type': 'text/html; charset="utf-8"',
        Body: `Hi there,

You have 3 new connection requests waiting for your response:

1. Alex Chen - Software Engineer at TechCorp
2. Maria Garcia - Product Manager at StartupXYZ
3. David Wilson - Full Stack Developer at WebSolutions

Review and accept these requests to grow your professional network. You can also send personalized connection requests to people you know.

[View All Connection Requests]

Stay connected,
The LinkedIn Team

---
This is an automated message. To manage your email preferences, visit your notification settings.`,
        Attachments: ''
      }
    ];
    
    return mockCSVData.map(email => CSVParser.transformEmailData(email));
  }
}