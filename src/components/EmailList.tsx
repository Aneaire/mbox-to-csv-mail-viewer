import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';
import { Mail, Star, Archive, Trash2, Search, Upload, Brain } from 'lucide-react';

interface EmailListProps {
  emails: any[];
  selectedEmail: any | null;
  onEmailSelect: (email) => void;
  onMarkAsRead: (emailId: string) => void;
  onUploadClick?: () => void;
}

export function EmailList({ emails, selectedEmail, onEmailSelect, onMarkAsRead, onUploadClick }: EmailListProps) {
  const [sortBy, setSortBy] = useState<'date' | 'sender' | 'subject'>('date');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmails = emails.filter(email => {
    const searchLower = searchTerm.toLowerCase();
    return (
      email.sender.toLowerCase().includes(searchLower) ||
      email.subject.toLowerCase().includes(searchLower) ||
      email.body.toLowerCase().includes(searchLower)
    );
  });

  const sortedEmails = [...filteredEmails].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (sortBy === 'sender') {
      return a.sender.localeCompare(b.sender);
    } else {
      return a.subject.localeCompare(b.subject);
    }
  });

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
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full max-w-md border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col m-0">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            Inbox ({filteredEmails.length}/{emails.length})
          </h2>
          {onUploadClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onUploadClick}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={sortBy === 'date' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSortBy('date')}
          >
            Date
          </Button>
          <Button 
            variant={sortBy === 'sender' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSortBy('sender')}
          >
            Sender
          </Button>
          <Button 
            variant={sortBy === 'subject' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSortBy('subject')}
          >
            Subject
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0">
        {sortedEmails.map((email) => (
          <Card 
            key={email.id}
            className={`cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md ${
              selectedEmail?.id === email.id ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-l-blue-500' : ''
            } ${!email.read ? 'border-l-4 border-l-blue-500' : ''}`}
            onClick={() => {
              onEmailSelect(email);
              if (!email.read) {
                onMarkAsRead(email.id);
              }
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold truncate text-gray-900 dark:text-white">{email.sender}</h3>
                    {email.category && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(email.category)}`}>
                        {email.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
                    {email.subject}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {email.hasAttachments && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-1" title="Has attachments"></div>
                  )}
                  {email.processedBody && (
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" title="AI processed">
                      <Brain className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                {email.body.substring(0, 150)}...
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">{formatDate(email.timestamp)}</span>
                {!email.read && (
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full font-medium">
                    New
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}