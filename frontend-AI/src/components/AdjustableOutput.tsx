import React, { useState } from 'react';
import TypingAnimation from './TypingAnimation';
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
    if (!adjustments.trim()) return;
    
    setIsRegenerating(true);
    try {
      console.log('Regenerating content with adjustments:', adjustments);
      console.log('Original content length:', content.length);
      console.log('Template type:', templateType);
      const regeneratedContent = await onRegenerate(adjustments);
      console.log('Regenerated content received:', regeneratedContent?.substring(0, 100) + '...');
      setNewContent(regeneratedContent);
    } catch (error) {
      console.error('Error regenerating content:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {templateType.charAt(0).toUpperCase() + templateType.slice(1).replace('_', ' ')}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Content:
            </label>
            <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600 max-h-32 overflow-y-auto">
              {content}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to adjust?
            </label>
            <textarea
              value={adjustments}
              onChange={(e) => setAdjustments(e.target.value)}
              placeholder="Describe the changes you want (e.g., 'Make it more formal', 'Add more details about...', 'Change the tone to...')"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleRegenerate}
              disabled={!adjustments.trim() || isRegenerating}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded border">
          <TypingAnimation 
            text={content} 
            speed={30}
            className="text-gray-800"
          />
        </div>
      )}

      {isRegenerating && (
        <div className="mt-4">
          <LoadingSpinner message="Regenerating with your adjustments..." size="small" />
        </div>
      )}

      {newContent && !isRegenerating && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h4 className="text-sm font-medium text-green-800 mb-2">Regenerated Content:</h4>
          <TypingAnimation 
            text={newContent} 
            speed={30}
            className="text-green-700"
          />
          <div className="mt-3 flex space-x-2">
            <button
              onClick={() => {
                setContent(newContent);
                setNewContent('');
                setIsEditing(false);
              }}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Use This Version
            </button>
            <button
              onClick={() => setNewContent('')}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
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