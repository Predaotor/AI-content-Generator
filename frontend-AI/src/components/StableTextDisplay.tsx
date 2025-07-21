import React, { useEffect, useRef, useState } from 'react';

interface StableTextDisplayProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  hideCursor?: boolean;
}

const StableTextDisplay: React.FC<StableTextDisplayProps> = ({ 
  text, 
  speed = 10, 
  onComplete,
  className = "",
  hideCursor = false
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const textRef = useRef<string>('');
  const isAutoScrollingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    // Cancel any ongoing typing animation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsTyping(true);
    setDisplayedText('');
    textRef.current = text;
    isAutoScrollingRef.current = true;

    const displayGradually = () => {
      let current = '';
      let index = 0;

      const animate = () => {
        // Check if animation was cancelled
        if (signal.aborted) {
          return;
        }

        if (index < textRef.current.length) {
          current += textRef.current[index];
          setDisplayedText(current);
          index++;
          
          // Smart scroll: only if user is at bottom and content overflows
          if (containerRef.current && isAutoScrollingRef.current) {
            const container = containerRef.current;
            const shouldScroll = 
              container.scrollHeight > container.clientHeight &&
              container.scrollTop + container.clientHeight >= container.scrollHeight - 100; // Only if near bottom
            
            if (shouldScroll) {
              container.scrollIntoView({ block: "end", behavior: "smooth" });
            }
          }
          
          // Use requestAnimationFrame for smoother animations
          setTimeout(() => {
            requestAnimationFrame(animate);
          }, speed);
        } else {
          // Stop auto-scrolling after animation completes
          isAutoScrollingRef.current = false;
          
          // Final scroll only if user was at bottom
          if (containerRef.current && !signal.aborted) {
            const container = containerRef.current;
            const shouldScroll = 
              container.scrollHeight > container.clientHeight &&
              container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
            
            if (shouldScroll) {
              container.scrollIntoView({ block: "end", behavior: "smooth" });
            }
          }

          if (!signal.aborted) {
            setIsTyping(false);
            isAutoScrollingRef.current = false;
            
            // Reset layout state after typing
            if (containerRef.current) {
              const container = containerRef.current;
              container.style.transform = 'none';
              container.style.transition = 'opacity 0.2s ease';
            }
            
            onComplete?.();
          }
        }
      };

      requestAnimationFrame(animate);
    };

    displayGradually();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Reset layout state on cleanup
      isAutoScrollingRef.current = false;
      if (containerRef.current) {
        const container = containerRef.current;
        container.style.transform = 'none';
        container.style.transition = 'opacity 0.2s ease';
      }
    };
  }, [text, speed, onComplete]);

  return (
    <div 
      ref={containerRef}
      className={`font-mono-smooth text-gray-800 leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-96 antialiased subpixel-antialiased ${className}`}
      style={{ 
        minHeight: '200px',
        transition: 'opacity 0.2s ease',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
      }}
    >
      {displayedText}
      {isTyping && !hideCursor && (
        <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-typing-cursor align-baseline transition-opacity"></span>
      )}
    </div>
  );
};

export default StableTextDisplay; 