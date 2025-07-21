import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import type { SaveOutputRequest } from '../utils/api';
import { fetchAIResponse, fetchProfileData, saveOutput, adjustContent } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TypingAnimation from '../components/TypingAnimation';
import AdjustableOutput from '../components/AdjustableOutput';

const FREE_TOKEN_LIMIT = 1000;

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
  const [showTypingAnimation, setShowTypingAnimation] = useState(false);

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
    setShowTypingAnimation(false);
    try {
      const result = await fetchAIResponse(templateType, details);
      setOutput(result);
      setShowTypingAnimation(true);
      const token = localStorage.getItem('access_token');
      if (token) {
        fetchProfileData(token).then((profile) => {
          setTokenUsage(profile.tokens_used);
        });
      }
    } catch {
      setOutput('Failed to generate content.');
    } finally {
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
    setShowTypingAnimation(false);
  };

  const overLimit = tokenUsage !== null && tokenUsage >= FREE_TOKEN_LIMIT;

  return (
    <div
      className="min-h-screen px-4 py-12 bg-center bg-cover"
      style={{ backgroundImage: "url('/assets/images/AI.png')" }}
    >
      {/* Navigation Bar */}
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
        <button
          onClick={toggleDarkMode}
          className={`px-4 py-2 font-semibold rounded transition ${
            darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-indigo-700 hover:bg-gray-300'
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
          darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
        }`}
      >
        <h1 className="mb-6 text-3xl font-bold text-center">🤖 AI Assistant</h1>

        <div
          className={`p-3 mb-6 font-semibold rounded ${
            darkMode ? 'bg-indigo-800 text-white' : 'bg-indigo-200 text-indigo-900'
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
                ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:ring-indigo-500'
                : 'bg-white text-black border-gray-300 placeholder-gray-500 focus:ring-indigo-300'
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
          className="px-6 py-2 text-white transition duration-200 bg-indigo-600 rounded hover:bg-indigo-700"
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
        {output && !loading && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-indigo-300">Generated Output:</h2>
            {templateType === 'image' ? (
              <>
                <img
                  src={output}
                  alt="Generated"
                  className="mb-4 max-h-[400px] w-full rounded border object-contain"
                />
                <button
                  onClick={downloadImage}
                  className="px-4 py-2 mr-4 text-white transition duration-200 bg-green-600 rounded hover:bg-green-700"
                >
                  Download Image
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-white transition duration-200 bg-indigo-600 rounded hover:bg-indigo-700"
                  disabled={saveLoading || overLimit}
                >
                  {saveLoading ? 'Saving...' : 'Save Output'}
                </button>
              </>
            ) : (
              <>
                {showTypingAnimation ? (
                  <div className="mb-4">
                    <TypingAnimation 
                      text={output} 
                      speed={30}
                      onComplete={() => setShowTypingAnimation(false)}
                      className={`p-4 border rounded ${
                        darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'
                      }`}
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <AdjustableOutput
                      initialContent={output}
                      onRegenerate={handleAdjustContent}
                      templateType={templateType}
                      className={darkMode ? 'bg-gray-800 text-white' : ''}
                    />
                  </div>
                )}
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-white transition duration-200 bg-indigo-600 rounded hover:bg-indigo-700"
                  disabled={saveLoading || overLimit}
                >
                  {saveLoading ? 'Saving...' : 'Save Output'}
                </button>
              </>
            )}
            {saveMessage && <p className="mt-2 text-sm text-green-400">{saveMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
