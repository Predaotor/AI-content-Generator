import React from 'react';

interface SkeletonPlaceholderProps {
  className?: string;
  lines?: number;
}

const SkeletonPlaceholder: React.FC<SkeletonPlaceholderProps> = ({ 
  className = "", 
  lines = 3 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-300 rounded mb-2"
          style={{
            width: `${Math.random() * 40 + 60}%`, // Random width between 60-100%
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonPlaceholder; 