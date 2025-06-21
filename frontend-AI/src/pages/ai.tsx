import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import type { SaveOutputRequest } from '../utils/api';
import { fetchAIResponse, fetchProfileData, saveOutput } from '../utils/api';

const FREE_TOKEN_LIMIT = 1000;

// Enhanced typing effect component for ChatGPT-like experience
const TypingEffect = ({ text, speed = 2, className = '' }: { text: string; speed?: number; className?: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (text && !isTyping) {
      setIsTyping(true);
      setDisplayedText('');
      setCurrentIndex(0);
    }
  }, [text]);

  useEffect(() => {
    if (isTyping && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        // Adaptive chunk size based on remaining text
        let charsToAdd = 1;
        if (text.length - currentIndex > 100) {
          charsToAdd = 4; // Faster for long text
        } else if (text.length - currentIndex > 50) {
          charsToAdd = 3; // Medium speed
        } else {
          charsToAdd = 2; // Slower for short remaining text
        }
        
        charsToAdd = Math.min(charsToAdd, text.length - currentIndex);
        const nextChars = text.slice(currentIndex, currentIndex + charsToAdd);
        setDisplayedText(prev => prev + nextChars);
        setCurrentIndex(prev => prev + charsToAdd);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length) {
      setIsTyping(false);
    }
  }, [currentIndex, text, speed, isTyping]);

  return (
    <div className={`font-mono leading-relaxed ${className}`}>
      {displayedText}
      {isTyping && <span className="font-bold text-indigo-400 animate-pulse">▋</span>}
    </div>
  );
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center space-x-2">
    <div className="w-4 h-4 rounded-full border-b-2 border-white animate-spin"></div>
    <span>Generating...</span>
  </div>
);

// Progress bar component
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="mb-4 w-full h-2 bg-gray-200 rounded-full">
    <div 
      className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

export default function AIPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [templateType, setTemplateType] = useState<'blog_post' | 'email_draft' | 'image'>('blog_post');
  const [details, setDetails] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<number | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    if (!user) {
      router.replace('/signin');
      return;
    }
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfileData(token).then((profile) => {
        setTokenUsage(profile.tokens_used);
      });
    }
  }, [user]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleGenerate = async () => {
    setLoading(true);
    setOutput('');
    setSaveMessage('');
    setShowOutput(false);
    setGenerationProgress(0);
    
    // Simulate progress during generation
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 150); // Faster progress updates
    
    try {
      const result = await fetchAIResponse(templateType, details);
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // Shorter delay for faster content appearance
      setTimeout(() => {
        setOutput(result);
        setShowOutput(true);
        setGenerationProgress(0);
      }, 200); // Reduced delay for faster display
      
      const token = localStorage.getItem('access_token');
      if (token) {
        fetchProfileData(token).then((profile) => {
          setTokenUsage(profile.tokens_used);
        });
      }
    } catch {
      clearInterval(progressInterval);
      setGenerationProgress(0);
      setOutput('Failed to generate content.');
      setShowOutput(true);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = output;
    link.download = 'generated-image.png';
    link.click();
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setSaveMessage('');
    const token = localStorage.getItem('access_token');
    if (!token) {
      setSaveMessage('You must be logged in to save output.');
      setSaveLoading(false);
      return;
    }
    try {
      const data: SaveOutputRequest = {
        template_type: templateType,
        content: output,
      };
      await saveOutput(data, token);
      setSaveMessage('Output saved successfully!');
      fetchProfileData(token).then((profile) => {
        setTokenUsage(profile.tokens_used);
      });
    } catch (err: any) {
      setSaveMessage(`Error saving output: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTemplateTypeChange = (type: 'blog_post' | 'email_draft' | 'image') => {
    setTemplateType(type);
    setDetails('');
    setOutput('');
    setSaveMessage('');
  };

  const overLimit = tokenUsage !== null && tokenUsage >= FREE_TOKEN_LIMIT;

  return (
    <div
      className="px-4 py-12 min-h-screen bg-center bg-cover"
      style={{ backgroundImage: "url('/assets/images/AI.png')" }}
    >
      {/* Navigation Bar */}
      <div className="flex justify-between items-center mx-auto mb-6 max-w-5xl">
        <button
          onClick={toggleDarkMode}
          className={`px-4 py-2 font-semibold rounded transition ${
            darkMode ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-indigo-700 bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div className="flex gap-4">
          <Link href="/">
            <span className="px-3 py-1 font-semibold text-indigo-700 bg-white rounded cursor-pointer hover:underline">
              Home
            </span>
          </Link>
          <Link href="/profile">
            <span className="px-3 py-1 font-semibold text-indigo-700 bg-white rounded cursor-pointer hover:underline">
              Profile
            </span>
          </Link>
        </div>
      </div>

      {/* Chatbot UI */}
      <div
        className={`max-w-3xl mx-auto p-8 shadow-lg rounded-xl backdrop-blur-sm bg-opacity-90 ${
          darkMode ? 'text-white bg-gray-900' : 'text-black bg-white'
        }`}
      >
        <h1 className="flex justify-center items-center mb-6 text-3xl font-bold text-center">
          <span className="mr-3 animate-bounce">🤖</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            AI Assistant
          </span>
          <span className="ml-3 animate-pulse">✨</span>
        </h1>

        <div
          className={`p-3 mb-6 font-semibold rounded ${
            darkMode ? 'text-white bg-indigo-800' : 'text-indigo-900 bg-indigo-200'
          }`}
        >
          Tokens Used: {tokenUsage !== null ? tokenUsage : '...'} / {FREE_TOKEN_LIMIT}
          {overLimit && <span className="ml-4 font-bold text-red-500">Token limit reached!</span>}
        </div>

        {/* Template Selector */}
        <div className="mb-6">
          <label className={`block mb-3 text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Select Template Type:
          </label>
          <div className="flex flex-wrap gap-4">
            {[
              { type: 'blog_post', label: '📝 Blog Post', emoji: '📝' },
              { type: 'email_draft', label: '📧 Email Draft', emoji: '📧' },
              { type: 'image', label: '🖼️ Image', emoji: '🖼️' },
            ].map((option) => (
              <button
                key={option.type}
                onClick={() => handleTemplateTypeChange(option.type as any)}
                className={`rounded-xl border px-5 py-3 shadow-md transition-all duration-300 transform hover:scale-105 ${
                  templateType === option.type
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-2 ring-indigo-300 ring-offset-2 shadow-lg'
                    : darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600 hover:shadow-lg'
                      : 'bg-white text-gray-800 hover:bg-indigo-100 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{option.emoji}</span>
                  <span>{option.label.replace(option.emoji, '').trim()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Prompt / Details:
          </label>
          <textarea
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
              darkMode
                ? 'placeholder-gray-400 text-white bg-gray-700 border-gray-600 focus:ring-indigo-500'
                : 'placeholder-gray-500 text-black bg-white border-gray-300 focus:ring-indigo-300'
            }`}
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g. Create a blog post about AI in healthcare"
            disabled={overLimit}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || overLimit || !details.trim()}
          className={`px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            loading || overLimit || !details.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500 shadow-lg'
          }`}
        >
          {loading ? <LoadingSpinner /> : 'Generate Content'}
        </button>

        {/* Progress Bar */}
        {loading && generationProgress > 0 && (
          <div className="p-4 mt-4 bg-gray-100 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Generating content...</span>
              <span className="text-sm font-medium text-indigo-600">{generationProgress}%</span>
            </div>
            <ProgressBar progress={generationProgress} />
          </div>
        )}

        {/* Output Section */}
        {showOutput && output && (
          <div className="mt-8 animate-fade-in">
            <h2 className="flex items-center mb-4 text-xl font-semibold text-indigo-300">
              <span className="mr-2">✨</span>
              Generated Output:
            </h2>
            {templateType === 'image' ? (
              <>
                <div className="overflow-hidden mb-4 rounded-lg border shadow-lg">
                  <img
                    src={output}
                    alt="Generated"
                    className="w-full max-h-[400px] object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={downloadImage}
                    className="px-4 py-2 text-white bg-green-600 rounded-lg shadow-md transition-all duration-200 transform hover:bg-green-700 hover:scale-105"
                  >
                    📥 Download Image
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md transition-all duration-200 transform hover:bg-indigo-700 hover:scale-105"
                    disabled={saveLoading || overLimit}
                  >
                    {saveLoading ? '💾 Saving...' : '💾 Save Output'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`p-6 mb-4 text-sm leading-relaxed border rounded-lg shadow-lg transition-all duration-300 ${
                    darkMode 
                      ? 'text-white bg-gray-800 border-gray-600' 
                      : 'text-black bg-gray-50 border-gray-200'
                  }`}
                >
                  <TypingEffect 
                    text={output} 
                    speed={1}
                    className={`${darkMode ? 'text-white' : 'text-black'}`}
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md transition-all duration-200 transform hover:bg-indigo-700 hover:scale-105"
                  disabled={saveLoading || overLimit}
                >
                  {saveLoading ? '💾 Saving...' : '💾 Save Output'}
                </button>
              </>
            )}
            {saveMessage && (
              <div className="p-3 mt-3 text-green-700 bg-green-100 rounded-lg border border-green-400 animate-fade-in">
                {saveMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
