# Email Viewer

A modern email viewer application built with Vite, React, Tailwind CSS, and shadcn/ui. This app processes email content using AI (Gemini) to extract and present information in a more readable format.

## Features

- **Email List View**: Browse emails with sorting options (date, sender, subject)
- **Email Detail View**: Read individual emails with metadata
- **AI Processing**: Use Gemini AI to process email bodies and extract key information
- **CSV Upload**: Drag-and-drop CSV file upload with validation
- **Real-time Search**: Filter across sender, subject, and body content
- **Clean UI**: Modern interface with Tailwind CSS and shadcn/ui
- **Responsive Design**: Works well on different screen sizes
- **Email Categories**: Color-coded categories (work, personal, promotion, social)
- **Attachment Indicators**: Visual indicators for emails with attachments
- **Loading States**: Professional loading animations and error handling

## CSV Upload Feature

The application now supports **dynamic CSV file upload** with:

### 📁 Upload Methods
- **Drag & Drop**: Simply drag CSV files onto the upload area
- **File Browser**: Click "Browse Files" to select CSV from your computer
- **File Validation**: Ensures only CSV files are accepted
- **Error Handling**: Graceful error messages for invalid files

### 📊 Supported CSV Format
The app expects CSV files with the following columns:
- `From`: Sender name and email
- `To`: Recipient email
- `CC`: CC recipients
- `BCC`: BCC recipients
- `Subject`: Email subject
- `Date`: Email timestamp
- `Message-ID`: Unique message identifier
- `Content-Type`: Email content type
- `Body`: Email body content
- `Attachments`: Attachment information

### 🔄 Processing Pipeline
1. **File Upload**: User selects or drops CSV file
2. **CSV Parsing**: Smart parsing with HTML sanitization
3. **Data Transformation**: Converts to email objects with metadata
4. **AI Processing**: Optional AI content extraction
5. **Display**: Shows in email list with search and filtering

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API (with mock service for development)
- **State Management**: React hooks
- **Build Tool**: Vite
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js (v16+) or Bun
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd email-viewer
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Configuration

### Gemini API Integration

To use the real Gemini AI service:

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env` file:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

3. Replace `mockGeminiService.js` with `geminiService.ts` in the imports

### Mock Service

The app includes a mock Gemini service that simulates AI processing without requiring an API key. This is perfect for development and testing.

## CSV Integration

The application supports **dynamic CSV file upload** with:

### 📁 Upload Methods
- **Drag & Drop**: Simply drag CSV files onto the upload area
- **File Browser**: Click "Browse Files" to select CSV from your computer
- **File Validation**: Ensures only CSV files are accepted
- **Error Handling**: Graceful error messages for invalid files

### 📊 Supported CSV Format
The app expects CSV files with the following columns:
- `From`: Sender name and email
- `To`: Recipient email
- `CC`: CC recipients
- `BCC`: BCC recipients
- `Subject`: Email subject
- `Date`: Email timestamp
- `Message-ID`: Unique message identifier
- `Content-Type`: Email content type
- `Body`: Email body content
- `Attachments`: Attachment information

### 🔄 Processing Pipeline
1. **File Upload**: User selects or drops CSV file
2. **CSV Parsing**: Smart parsing with HTML sanitization
3. **Data Transformation**: Converts to email objects with metadata
4. **AI Processing**: Optional AI content extraction
5. **Display**: Shows in email list with search and filtering

### 📋 Features
- **Email metadata** (sender, subject, date, attachments)
- **Cleaned email body** (HTML tags removed)
- **Automatic categorization** based on content
- **Attachment indicators** for emails with files
- **Real-time search** across all email content
- **Loading states** with progress indicators

### CSV Format

The app expects CSV files with the following columns:
- `From`: Sender name and email
- `To`: Recipient email
- `CC`: CC recipients
- `BCC`: BCC recipients
- `Subject`: Email subject
- `Date`: Email timestamp
- `Message-ID`: Unique message identifier
- `Content-Type`: Email content type
- `Body`: Email body content
- `Attachments`: Attachment information

## Usage

1. **Upload CSV**: Click "Upload CSV File" or drag-and-drop your email export file
2. **Browse Emails**: View the list of emails loaded from your CSV file
3. **Search Emails**: Use the search bar to filter emails by sender, subject, or content
4. **Sort Emails**: Click the sort buttons to organize by date, sender, or subject
5. **Select Email**: Click on any email to view its details
6. **Process with AI**: Click "Process with AI" to extract and format the email content
7. **Toggle Views**: Use "Show AI Summary" / "Show Original" to switch between processed and original content

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── EmailList.tsx  # Email list component
│   └── EmailDetail.tsx # Email detail component
├── services/
│   ├── geminiService.ts      # Real Gemini API service
│   ├── mockGeminiService.ts  # Mock service for development
│   └── emailDataService.js   # CSV data loading service
├── utils/
│   ├── csvParser.js   # CSV parsing utilities
│   └── utils.ts      # Utility functions
├── types/
│   └── email.ts      # TypeScript interfaces
├── data/
│   └── mockEmails.ts # Mock email data
├── lib/
│   └── utils.ts      # Utility functions
└── App.jsx           # Main application component
```

## Development

### Available Scripts

```bash
# Development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Linting
bun run lint
```

### Adding New Features

1. **New Email Types**: Update the CSV parser and email transformation logic
2. **New UI Components**: Add components in `components/ui/` following shadcn/ui patterns
3. **AI Processing**: Extend the Gemini service in `services/`
4. **Mock Data**: Add more CSV test data in `public/`
5. **Search Features**: Enhance search functionality in EmailList component

## Deployment

### Production Build

```bash
bun run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License

## Acknowledgments

- [Vite](https://vitejs.dev/) - Build tool
- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lucide](https://lucide.dev/) - Icon library
- [Google Gemini](https://ai.google.dev/) - AI processing