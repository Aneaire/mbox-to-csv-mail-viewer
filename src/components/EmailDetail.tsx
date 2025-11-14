import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';
import { Mail, User, Calendar, Tag, Reply, Forward, Star, Archive, Trash2, Clock, Paperclip, Eye, EyeOff, Brain, Sparkles } from 'lucide-react';

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
  const [isAutoProcessing, setIsAutoProcessing] = useState(true); // Start with loading state

  useEffect(() => {
    if (email) {
      // Check if email is already processed
      if (email.processedBody) {
        setProcessedEmail(email);
        setIsAutoProcessing(false);
      } else {
        // Set loading state immediately before setting the email
        setIsAutoProcessing(true);
        setProcessedEmail({ ...email });
      }
    } else {
      setIsAutoProcessing(false);
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
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 2) return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays <= 7) return `${diffDays - 1} days ago at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleString();
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
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header with actions */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-500" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Email Details</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Reply">
              <Reply className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Forward">
              <Forward className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Star">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Archive">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" title="Delete">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Email subject and metadata */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex-1">{email.subject}</h2>
            {email.category && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(email.category)}`}>
                {email.category}
              </span>
            )}
            {email.hasAttachments && (
              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                <Paperclip className="h-4 w-4" />
                <span className="text-xs font-medium">Has attachments</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {email.sender.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{email.sender}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{email.senderEmail}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{formatDate(email.timestamp)}</span>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <Button 
            onClick={handleProcessEmail} 
            disabled={isProcessing || !!processedEmail?.processedBody}
            size="sm"
            className="flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Process with AI
              </>
            )}
          </Button>
          
          {processedEmail?.processedBody && (
            <Button 
              variant="outline" 
              onClick={() => setShowOriginal(!showOriginal)}
              size="sm"
              className="flex items-center gap-2"
            >
              {showOriginal ? (
                <>
                  <Eye className="h-4 w-4" />
                  Show AI Summary
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4" />
                  Show Original
                </>
              )}
            </Button>
          )}
          
          {processedEmail?.processedBody && (
            <div className="flex items-center gap-1 ml-auto">
              <Sparkles className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">AI Processed</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  {showOriginal ? (
                    <Eye className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-blue-500" />
                  )}
                  {showOriginal ? 'Original Email Content' : 'AI Processed Content'}
                </div>
                {processedEmail?.processedBody && !showOriginal && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full font-medium">
                    Enhanced by AI
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white dark:bg-gray-800">
              {isAutoProcessing ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <Brain className="absolute inset-0 m-auto h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      AI is processing this email...
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Extracting key information and organizing content
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <span>{displayBody.length} characters</span>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none">
                      <div className={`whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-white p-6 rounded-lg ${
                        showOriginal 
                          ? 'bg-gray-50 dark:bg-gray-900/50 font-mono text-xs' 
                          : 'bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10'
                      }`}>
                        {isValidBody(displayBody) ? displayBody : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Mail className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 italic mb-2">
                              Email body content is not available or contains unreadable data.
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                              This might be due to encoding issues or email containing only HTML/CSS content.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {processedEmail?.processedBody && !showOriginal && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            AI Processing Summary
                          </h4>
                          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed mb-3">
                            This email has been processed by AI to extract the main message and present it in a more readable format. 
                            The AI has identified key points and organized the content for better comprehension.
                          </p>
                          <div className="flex items-center gap-4 text-xs text-blue-700 dark:text-blue-300">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              Content extracted
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              Formatted for readability
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                              Key points identified
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}