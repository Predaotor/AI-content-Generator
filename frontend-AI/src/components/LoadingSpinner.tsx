import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  inline?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Generating content...", 
  size = 'medium',
  inline = false
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  if (inline) {
    return (
      <div className="inline-flex items-center space-x-2">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-200 border-t-blue-600`}></div>
        {message && <span className="text-sm text-gray-600">{message}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-3">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-200 border-t-blue-600`}></div>
      {message && <p className="text-gray-600 text-sm font-medium animate-pulse">{message}</p>}
    </div>
  );
};

export default LoadingSpinner; 