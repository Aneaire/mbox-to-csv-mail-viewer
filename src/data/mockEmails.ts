import { Email } from '@/types/email';

export const mockEmails: Email[] = [
  {
    id: '1',
    sender: 'John Smith',
    senderEmail: 'john.smith@company.com',
    subject: 'Project Update - Q4 Goals',
    body: `Hi Team,

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
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    category: 'work'
  },
  {
    id: '2',
    sender: 'Sarah Johnson',
    senderEmail: 'sarah.j@newsletter.com',
    subject: 'Weekly Tech Digest - Latest Trends',
    body: `Hello Subscriber,

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
    timestamp: '2024-01-15T09:15:00Z',
    read: true,
    category: 'promotion'
  },
  {
    id: '3',
    sender: 'Mom',
    senderEmail: 'mom.family@email.com',
    subject: 'Family Dinner This Weekend',
    body: `Hi Sweetheart,

How are you doing? I hope work is going well.

I wanted to let you know that we're having family dinner this Sunday at 6 PM. Your sister and her family will be coming over too. I'm making your favorite lasagna and garlic bread.

Could you please bring:
- A salad or appetizer
- Your famous chocolate cake (if you have time)

Also, let me know if you can make it so I can get a headcount. Looking forward to seeing you!

Love,
Mom ❤️`,
    timestamp: '2024-01-14T18:45:00Z',
    read: false,
    category: 'personal'
  },
  {
    id: '4',
    sender: 'LinkedIn',
    senderEmail: 'messages-noreply@linkedin.com',
    subject: 'You have 3 new connection requests',
    body: `Hi there,

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
    timestamp: '2024-01-14T14:20:00Z',
    read: true,
    category: 'social'
  },
  {
    id: '5',
    sender: 'Amazon',
    senderEmail: 'auto-confirm@amazon.com',
    subject: 'Your Amazon Order #123-4567890 has shipped',
    body: `Hello,

Great news! Your recent Amazon order has shipped and is on its way to you.

Order Details:
- Order Number: 123-4567890
- Items: 1x Wireless Bluetooth Headphones, 1x Phone Case
- Shipping Address: 123 Main St, Apt 4B, New York, NY 10001
- Estimated Delivery: January 18, 2024

You can track your package using the tracking number: 1Z999W999999999999

Thank you for shopping with Amazon!

Amazon Customer Service`,
    timestamp: '2024-01-14T11:30:00Z',
    read: false,
    category: 'promotion'
  }
];