import { useState, useEffect } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { EmailList } from './components/EmailList.js';
import { EmailDetail } from './components/EmailDetail.js';
import { CSVUploader } from './components/CSVUploader.js';
import { geminiService } from './services/mockGeminiService.js';
import { EmailDataService } from './services/emailDataService.js';

function App() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

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

  const handleCSVUpload = async (csvText, fileName) => {
    try {
      setLoading(true);
      const emailData = await EmailDataService.loadEmailsFromCSVText(csvText, fileName);
      setEmails(emailData);
      setShowUploader(false);
    } catch (error) {
      console.error('Error processing uploaded CSV:', error);
      alert('Error processing CSV file. Please check the file format.');
    } finally {
      setLoading(false);
    }
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

  if (showUploader) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <CSVUploader onCSVUpload={handleCSVUpload} isLoading={loading} />
      </div>
    );
  }

return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {selectedEmail ? (
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
          />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Mail className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                {emails.length === 0 ? 'No Emails Found' : 'Select an Email'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                {emails.length === 0 
                  ? 'No email data loaded. Upload a CSV file to get started.'
                  : 'Choose an email from list to view its details'
                }
              </p>
              {emails.length === 0 && (
                <Button 
                  onClick={() => setShowUploader(true)}
                  variant="default"
                  className="mb-4"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Upload CSV File
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;