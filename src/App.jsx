import { useState, useEffect } from 'react';
import { Mail, Upload } from 'lucide-react';
import { EmailList } from './components/EmailList.js';
import { EmailDetail } from './components/EmailDetail.js';
import { FileUpload } from './components/FileUpload.jsx';
import { geminiService } from './services/mockGeminiService.js';
import { EmailDataService } from './services/emailDataService.js';

function App() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(true);

  useEffect(() => {
    // Don't auto-load emails on startup - wait for user upload
  }, []);

  const handleEmailSelect = async (email) => {
    setSelectedEmail(email);
    
    // Auto-process with AI if not already processed
    if (email && !email.processedBody) {
      try {
        const processed = await geminiService.processEmailBody(email);
        setSelectedEmail(prev => prev?.id === email.id ? { ...prev, ...processed } : prev);
        
        // Also update the email in the emails list to mark it as processed
        setEmails(prevEmails =>
          prevEmails.map(e =>
            e.id === email.id ? { ...e, ...processed } : e
          )
        );
      } catch (error) {
        console.error('Auto-processing email failed:', error);
      }
    }
  };

  const handleMarkAsRead = (emailId) => {
    setEmails(prevEmails =>
      prevEmails.map(email =>
        email.id === emailId ? { ...email, read: true } : email
      )
    );
  };

  const handleProcessEmail = async (email) => {
    return await geminiService.processEmailBody(email);
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
  };

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;
    
    try {
      setLoading(true);
      const file = files[0]; // Take the first file
      const emailData = await EmailDataService.loadEmailsFromFile(file);
      setEmails(emailData);
      setShowUpload(false);
    } catch (error) {
      console.error('Failed to load emails from file:', error);
      alert('Failed to load CSV file. Please check the file format.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowUpload = () => {
    setShowUpload(true);
    setSelectedEmail(null);
  };

  const handleHideUpload = () => {
    setShowUpload(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Loading Emails</h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">Please wait while we load your email data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {showUpload ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <Upload className="mx-auto h-20 w-20 text-blue-500 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Email Viewer
              </h1>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Upload CSV File to Get Started
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Upload a CSV file containing your email data to view, search, and analyze your emails with AI-powered insights.
              </p>
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supported format: CSV files with email data
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-screen">
          <div className="sticky top-0 h-screen w-80 flex-shrink-0">
            <EmailList
              emails={emails}
              selectedEmail={selectedEmail}
              onEmailSelect={handleEmailSelect}
              onMarkAsRead={handleMarkAsRead}
              onUploadClick={handleShowUpload}
            />
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
            {selectedEmail ? (
              <EmailDetail
                email={selectedEmail}
                onBack={handleBackToList}
                onProcessEmail={handleProcessEmail}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Mail className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Select an Email
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Choose an email from the list to view its details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;