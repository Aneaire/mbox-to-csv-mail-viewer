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
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const loadEmails = async () => {
      try {
        setLoading(true);
        const emailData = await EmailDataService.loadEmailsFromCSV();
        setEmails(emailData);
      } catch (error) {
        console.error('Failed to load emails:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmails();
  }, []);

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
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
              <Upload className="mx-auto h-16 w-16 text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Upload CSV File
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload a CSV file containing email data to view and analyze
              </p>
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
            <div className="mt-6 text-center">
              <button
                onClick={handleHideUpload}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : selectedEmail ? (
        <EmailDetail
          email={selectedEmail}
          onBack={handleBackToList}
          onProcessEmail={handleProcessEmail}
        />
      ) : (
        <div className="flex w-full">
          <EmailList
            emails={emails}
            selectedEmail={selectedEmail}
            onEmailSelect={handleEmailSelect}
            onMarkAsRead={handleMarkAsRead}
            onUploadClick={handleShowUpload}
          />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Mail className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                {emails.length === 0 ? 'No Emails Found' : 'Select an Email'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                {emails.length === 0 
                  ? 'No email data could be loaded. Please check the CSV file.'
                  : 'Choose an email from the list to view its details'
                }
              </p>
              {emails.length === 0 && (
                <button
                  onClick={handleShowUpload}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV File
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;