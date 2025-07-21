import React, { useState } from 'react';
import StableTextDisplay from './StableTextDisplay';
import LoadingSpinner from './LoadingSpinner';

interface AdjustableOutputProps {
  initialContent: string;
  onRegenerate: (adjustments: string) => Promise<string>;
  templateType: string;
  className?: string;
}

const AdjustableOutput: React.FC<AdjustableOutputProps> = ({
  initialContent,
  onRegenerate,
  templateType,
  className = ""
}) => {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [adjustments, setAdjustments] = useState('');
  const [regenerateAttempts, setRegenerateAttempts] = useState(0);

  const handleEdit = () => {
    setIsEditing(true);
    setAdjustments('');
  };

  const handleSave = () => {
    setContent(adjustments);
    setIsEditing(false);
    setAdjustments('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAdjustments('');
  };

  const handleRegenerate = async () => {
    // Prevent multiple calls and track attempts
    if (!adjustments.trim() || isRegenerating) {
      console.log('Regenerate blocked: loading or empty adjustments');
      return;
    }
    
    setRegenerateAttempts(prev => prev + 1);
    setIsRegenerating(true);
    setNewContent(''); // Clear previous regenerated content
    
    try {
      console.log(`Regenerate attempt ${regenerateAttempts + 1}:`, adjustments);
      console.log('Original content length:', content.length);
      console.log('Template type:', templateType);
      
      const regeneratedContent = await onRegenerate(adjustments);
      
      if (!regeneratedContent || regeneratedContent.trim() === '') {
        throw new Error('Empty response received');
      }
      
      console.log('Regenerated content received:', regeneratedContent?.substring(0, 100) + '...');
      setNewContent(regeneratedContent);
      setRegenerateAttempts(0); // Reset attempts on success
    } catch (error) {
      console.error('Error regenerating content:', error);
      setNewContent(''); // Clear any partial content
      alert(`Failed to regenerate content (attempt ${regenerateAttempts + 1}). Please try again.`);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className={`p-6 bg-white rounded-lg shadow-lg output-container ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {templateType.charAt(0).toUpperCase() + templateType.slice(1).replace('_', ' ')}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded transition-colors hover:bg-blue-600"
          >
            Edit
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Current Content:
            </label>
            <div className="overflow-y-auto p-3 max-h-32 text-sm text-gray-600 bg-gray-50 rounded border">
              {content}
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              What would you like to adjust?
            </label>
            <textarea
              value={adjustments}
              onChange={(e) => setAdjustments(e.target.value)}
              placeholder="Describe the changes you want (e.g., 'Make it more formal', 'Add more details about...', 'Change the tone to...')"
              className="p-3 w-full rounded-md border border-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleRegenerate}
              disabled={!adjustments.trim() || isRegenerating}
              className="px-4 py-2 text-white bg-green-500 rounded transition-colors hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isRegenerating ? (
                <span className="flex items-center">
                  <svg className="mr-2 -ml-1 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Regenerating...
                </span>
              ) : (
                'Regenerate'
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isRegenerating}
              className="px-4 py-2 text-white bg-gray-500 rounded transition-colors hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded border">
          <div className="text-gray-800 whitespace-pre-wrap">
            {content}
          </div>
        </div>
      )}

      {isRegenerating && (
        <div className="mt-4">
          <LoadingSpinner message="Regenerating with your adjustments..." size="small" />
        </div>
      )}

      {newContent && !isRegenerating && (
        <div className="p-4 mt-4 bg-green-50 rounded border border-green-200">
          <h4 className="mb-2 text-sm font-medium text-green-800">Regenerated Content:</h4>
          <StableTextDisplay 
            text={newContent} 
            speed={10}
            className="text-green-700"
            hideCursor={true}
          />
          <div className="flex mt-3 space-x-2">
            <button
              onClick={() => {
                setContent(newContent);
                setNewContent('');
                setIsEditing(false);
              }}
              className="px-3 py-1 text-sm text-white bg-green-500 rounded transition-colors hover:bg-green-600"
            >
              Use This Version
            </button>
            <button
              onClick={() => setNewContent('')}
              className="px-3 py-1 text-sm text-white bg-gray-500 rounded transition-colors hover:bg-gray-600"
            >
              Keep Original
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdjustableOutput; 