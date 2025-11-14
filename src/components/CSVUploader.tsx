import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '../components/ui/button.js';
import { Card, CardContent, CardHeader } from '../components/ui/card.js';

export function CSVUploader({ onCSVUpload, isLoading }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      processCSVFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      processCSVFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const processCSVFile = async (file) => {
    try {
      const text = await file.text();
      onCSVUpload(text, file.name);
    } catch (error) {
      console.error('Error reading CSV file:', error);
      alert('Error reading CSV file. Please check the file format.');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-500" />
            Upload CSV File
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openFileDialog}
            disabled={isLoading}
          >
            Choose File
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />
          
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
            
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {isLoading ? 'Processing...' : 'Drop CSV file here'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                Upload your email export CSV file to view and process emails with AI.
                Supports standard CSV format with From, To, Subject, Date, and Body columns.
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                variant="default" 
                onClick={openFileDialog}
                disabled={isLoading}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              
              {isLoading && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-blue-600">Processing CSV file...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}