import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import type { SaveOutputRequest } from '../utils/api';
import { fetchAIResponse, fetchProfileData, saveOutput, adjustContent } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StableTextDisplay from '../components/StableTextDisplay';
import AdjustableOutput from '../components/AdjustableOutput';
import SkeletonPlaceholder from '../components/SkeletonPlaceholder';

const FREE_TOKEN_LIMIT = 1000;

export default function AIPage() {
  // TODO: Remove all transforms/animations from main container to fix zoom issue
  // TODO: Use a stable div for text output; do not remount or reset on every character
  // TODO: Prevent regenerate button from running multiple times (use loading guard)
  // TODO: Ensure spinner starts once and stops once per output, no extra loops
  // TODO: Clear output properly before starting new text display
  
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
  const [showTypingAnimation, setShowTypingAnimation] = useState(false);
  const previousOutputRef = useRef<string>('');

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
    // Prevent multiple parallel calls
    if (loading) {
      console.log('Generate blocked: already loading');
      return;
    }
    
    if (!details.trim()) {
      alert('Please enter some details before generating content.');
      return;
    }
    
    // Reset global layout state before starting
    document.body.style.overflow = 'auto';
    document.body.style.transform = 'none';
    document.body.style.transition = 'opacity 0.2s ease';
    
    // Clear previous output and set loading state
    setLoading(true);
    setOutput('');
    setSaveMessage('');
    setShowTypingAnimation(false);
    
    try {
      console.log('Starting content generation for:', templateType);
      const result = await fetchAIResponse(templateType, details);
      
      if (!result || result.trim() === '') {
        throw new Error('Empty response received from API');
      }
      
      console.log('Content generated successfully, length:', result.length);
      
      // Only trigger typing animation if output is different
      if (result !== previousOutputRef.current) {
        setOutput(result);
        setShowTypingAnimation(true);
        previousOutputRef.current = result;
      } else {
        setOutput(result);
        setShowTypingAnimation(false);
      }
      
      // Update token usage after successful generation
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const profile = await fetchProfileData(token);
          setTokenUsage(profile.tokens_used);
        } catch (tokenError) {
          console.error('Failed to update token usage:', tokenError);
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      setOutput('Failed to generate content. Please check your input and try again.');
      setShowTypingAnimation(false);
    } finally {
      // Ensure loading is set to false only once
      setLoading(false);
    }
  };

  const handleAdjustContent = async (adjustments: string): Promise<string> => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('You must be logged in to adjust content.');
    }
    console.log('handleAdjustContent called with:', { adjustments, templateType, outputLength: output.length });
    return await adjustContent(output, adjustments, templateType, token);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = memoizedOutput;
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
        content: memoizedOutput,
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
    setShowTypingAnimation(false);
  };

  const overLimit = tokenUsage !== null && tokenUsage >= FREE_TOKEN_LIMIT;
  
  // Debounced output to reduce reflows
  const [displayedOutput, setDisplayedOutput] = useState(output);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayedOutput(output);
    }, 100); // Small delay smooths transitions

    return () => clearTimeout(timeout);
  }, [output]);

  // Memoize output content to prevent unnecessary re-renders
  const memoizedOutput = useMemo(() => displayedOutput, [displayedOutput]);

  return (
    <div
      className="px-4 py-12 min-h-screen text-base"
      style={{
        backgroundImage: "url('/assets/images/AI.png')",
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        transition: 'opacity 0.2s ease',
        overflow: 'auto',
      }}
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
        className={`max-w-screen-md mx-auto p-8 shadow-lg rounded-xl backdrop-blur-sm bg-opacity-90 ${
          darkMode ? 'text-white bg-gray-900' : 'text-black bg-white'
        }`}
        style={{
          transform: 'none',
          transition: 'opacity 0.2s ease',
          willChange: 'auto',
          overflow: 'auto'
        }}
      >
        <h1 className="mb-6 text-3xl font-bold text-center">🤖 AI Assistant</h1>

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
              { type: 'blog_post', label: '📝 Blog Post' },
              { type: 'email_draft', label: '📧 Email Draft' },
              { type: 'image', label: '🖼️ Image' },
            ].map((option) => (
              <button
                key={option.type}
                onClick={() => handleTemplateTypeChange(option.type as any)}
                className={`rounded-xl border px-5 py-3 shadow-md transition duration-300 ${
                  templateType === option.type
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-2'
                    : darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-white text-gray-800 hover:bg-indigo-100'
                }`}
              >
                {option.label}
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
          className="px-6 py-2 text-white bg-indigo-600 rounded transition duration-200 hover:bg-indigo-700"
          disabled={loading || overLimit}
        >
          {loading ? (
            <LoadingSpinner 
              message="Generating..." 
              size="small" 
              inline={true} 
            />
          ) : (
            'Generate'
          )}
        </button>

        {/* Output Section */}
        <div className="mt-8 output-container transition-opacity duration-300" style={{
          minHeight: '400px',
          maxHeight: '600px',
          overflowY: 'auto',
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
        }}>
          {loading ? (
            <div className="p-4">
              <LoadingSpinner message="Generating..." size="small" />
              <SkeletonPlaceholder lines={5} className="mt-4" />
            </div>
          ) : memoizedOutput ? (
            <>
              <h2 className="mb-4 text-xl font-semibold text-indigo-300">Generated Output:</h2>
              {templateType === 'image' ? (
                <>
                  <img
                    src={memoizedOutput}
                    alt="Generated"
                    className="mb-4 max-h-[400px] w-full rounded border object-contain"
                  />
                  <button
                    onClick={downloadImage}
                    className="px-4 py-2 mr-4 text-white bg-green-600 rounded transition duration-200 hover:bg-green-700"
                  >
                    Download Image
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-white bg-indigo-600 rounded transition duration-200 hover:bg-indigo-700"
                    disabled={saveLoading || overLimit}
                  >
                    {saveLoading ? 'Saving...' : 'Save Output'}
                  </button>
                </>
              ) : (
                <>
                  {showTypingAnimation ? (
                    <div className="mb-4">
                      <StableTextDisplay 
                        text={memoizedOutput} 
                        speed={10}
                        onComplete={() => setShowTypingAnimation(false)}
                        className={`p-4 border rounded ${
                          darkMode ? 'text-white bg-gray-700' : 'text-black bg-gray-100'
                        }`}
                      />
                    </div>
                  ) : (
                    <div className="mb-4">
                      <AdjustableOutput
                        initialContent={memoizedOutput}
                        onRegenerate={handleAdjustContent}
                        templateType={templateType}
                        className={darkMode ? 'text-white bg-gray-800' : ''}
                      />
                    </div>
                  )}
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-white bg-indigo-600 rounded transition duration-200 hover:bg-indigo-700"
                    disabled={saveLoading || overLimit}
                  >
                    {saveLoading ? 'Saving...' : 'Save Output'}
                  </button>
                </>
              )}
              {saveMessage && <p className="mt-2 text-sm text-green-400">{saveMessage}</p>}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
