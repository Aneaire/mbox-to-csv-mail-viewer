import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';
import { ArrowLeft, Mail, User, Calendar, Tag } from 'lucide-react';

interface ProcessedEmail {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  category?: string;
  hasAttachments: boolean;
  processedBody?: string;
}

interface EmailDetailProps {
  email: any | null;
  onBack: () => void;
  onProcessEmail: (email) => Promise<any>;
}

export function EmailDetail({ email, onBack, onProcessEmail }: EmailDetailProps) {
  const [processedEmail, setProcessedEmail] = useState<ProcessedEmail | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    if (email) {
      setProcessedEmail({ ...email });
    }
  }, [email]);

  const handleProcessEmail = async () => {
    if (!email || processedEmail?.processedBody) return;
    
    setIsProcessing(true);
    try {
      const processed = await onProcessEmail(email);
      setProcessedEmail(processed);
    } catch (error) {
      console.error('Error processing email:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'work': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-green-100 text-green-800';
      case 'promotion': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Select an email to view</p>
        </div>
      </div>
    );
  }

  const cleanBody = (body: string) => {
    if (!body) return '';
    
    // Decode HTML entities
    let cleaned = body.replace(/&nbsp;/g, ' ')
                      .replace(/&amp;/g, '&')
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&quot;/g, '"')
                      .replace(/&#39;/g, "'")
                      .replace(/&apos;/g, "'");
    
    // Remove any remaining HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    
    // Clean up whitespace
    cleaned = cleaned.replace(/\s+/g, ' ')
                      .replace(/\n\s*\n/g, '\n')
                      .trim();
    
    return cleaned;
  };

  const displayBody = showOriginal ? cleanBody(email.body) : (processedEmail?.processedBody || cleanBody(email.body));

  const isValidBody = (body: string) => {
    if (!body || body.trim().length === 0) return false;
    
    // Check if body contains mostly readable characters (not just symbols)
    const readableChars = body.replace(/[^\w\s@.,!?;:'"-]/g, '').length;
    const totalChars = body.length;
    const readableRatio = readableChars / totalChars;
    
    return readableRatio > 0.3; // At least 30% readable characters
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Email Details</h1>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{email.subject}</h2>
                {email.category && (
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(email.category)}`}>
                    {email.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{email.sender}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{email.senderEmail}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(email.timestamp)}</span>
                </div>
              </div>
            </CardHeader>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleProcessEmail} 
              disabled={isProcessing || !!processedEmail?.processedBody}
              size="sm"
            >
              {isProcessing ? 'Processing...' : 'Process with AI'}
            </Button>
            {processedEmail?.processedBody && (
              <Button 
                variant="outline" 
                onClick={() => setShowOriginal(!showOriginal)}
                size="sm"
              >
                {showOriginal ? 'Show AI Summary' : 'Show Original'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <Card className="shadow-lg">
          <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Tag className="h-5 w-5 text-blue-500" />
              {showOriginal ? 'Original Email' : 'AI Processed Content'}
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white dark:bg-gray-800">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-white p-4">
                {isValidBody(displayBody) ? displayBody : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      Email body content is not available or contains unreadable data.
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      This might be due to encoding issues or the email containing only HTML/CSS content.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {processedEmail?.processedBody && !showOriginal && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  AI Processing Summary
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  This email has been processed by AI to extract the main message and present it in a more readable format. 
                  The AI has identified key points and organized the content for better comprehension.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}