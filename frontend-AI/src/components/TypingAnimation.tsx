import React, { useEffect, useRef, useState } from 'react';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
  text, 
  speed = 50, 
  onComplete,
  className = ""
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!text) return;

    setIsTyping(true);
    setDisplayedText('');

    // Split text into lines
    const lines = text.split('\n');
    let currentLineIndex = 0;

    const interval = setInterval(() => {
      if (currentLineIndex < lines.length) {
        // Show 3-4 lines at a time
        if (currentLineIndex < lines.length - 1) {
          const nextLines = lines.slice(currentLineIndex, currentLineIndex + 3);
          setDisplayedText(prev => {
            const newText = prev + nextLines.join('\n') + '\n';
            // Auto-scroll to bottom
            if (containerRef.current) {
              containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
              });
            }
            return newText;
          });
          currentLineIndex += 3;
        } else {
          // Handle the last line or remaining lines
          const remainingLines = lines.slice(currentLineIndex);
          setDisplayedText(prev => {
            const newText = prev + remainingLines.join('\n');
            // Auto-scroll to bottom
            if (containerRef.current) {
              containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
              });
            }
            return newText;
          });
          currentLineIndex = lines.length;
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div 
      ref={containerRef}
      className={`font-mono-smooth text-gray-800 leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-96 antialiased subpixel-antialiased transition-all duration-300 ease-in-out animate-smooth-fade ${className}`}
    >
      {displayedText}
      {isTyping && (
        <span className="inline-block w-2 h-6 bg-blue-500 ml-1 animate-typing-cursor transition-opacity duration-200 ease-in-out"></span>
      )}
    </div>
  );
};

export default TypingAnimation; 