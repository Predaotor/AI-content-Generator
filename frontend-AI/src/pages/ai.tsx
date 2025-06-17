import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import type { SaveOutputRequest } from '../utils/api';
import { fetchAIResponse, fetchProfileData, saveOutput } from '../utils/api';

const FREE_TOKEN_LIMIT = 1000; // same as backend limit

export default function AIPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [templateType, setTemplateType] = useState<
    'blog_post' | 'email_draft' | 'image'
  >('blog_post');
  const [details, setDetails] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Use tokenUsage state for tokens used
  const [tokenUsage, setTokenUsage] = useState<number | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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

  const handleGenerate = async () => {
    setLoading(true);
    setOutput('');
    setSaveMessage('');
    try {
      const result = await fetchAIResponse(templateType, details);
      setOutput(result);
      // Optionally, refresh token usage after generation if backend updates it
      const token = localStorage.getItem('access_token');
      if (token) {
        fetchProfileData(token).then((profile) => {
          setTokenUsage(profile.tokens_used);
        });
      }
    } catch (err) {
      setOutput('Failed to generate content.');
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
      // Optionally, refresh token usage after saving
      fetchProfileData(token).then((profile) => {
        setTokenUsage(profile.tokens_used);
      });
    } catch (err: any) {
      setSaveMessage(`Error saving output: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTemplateTypeChange = (
    type: 'blog_post' | 'email_draft' | 'image',
  ) => {
    setTemplateType(type);
    setDetails('');
    setOutput('');
    setSaveMessage('');
  };

  const overLimit = tokenUsage !== null && tokenUsage >= FREE_TOKEN_LIMIT;

  return (
    <div
      className="flex items-center justify-center w-full min-h-screen bg-center bg-cover"
      style={{
        backgroundImage: "url('/assets/images/AI.png')",
      }}
    >
      {/* AI Chat Container */}
      <div
        className={`relative w-full max-w-2xl mx-auto rounded-xl shadow-lg p-8 transition-colors duration-300 ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Dark/Light Mode Toggle Button */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="absolute z-10 px-3 py-1 text-white bg-indigo-600 rounded top-4 right-4"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        <h1 className="mb-6 text-3xl font-bold text-center">🤖 AI Assistant</h1>

        {/* Token usage display */}
        <div className="p-3 mb-6 font-semibold text-indigo-900 bg-indigo-200 rounded">
          Tokens Used: {tokenUsage !== null ? tokenUsage : '...'} /{' '}
          {FREE_TOKEN_LIMIT}
          {overLimit && (
            <span className="ml-4 font-bold text-red-600">
              Token limit reached!
            </span>
          )}
        </div>

        {/* Template Selector */}
        <div className="mb-6">
          <label className="block mb-3 text-lg font-semibold text-gray-800">
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
                    : 'bg-white text-gray-800 hover:bg-indigo-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="mb-6">
          <label
            className={`block mb-1 font-medium ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            Prompt / Details:
          </label>
          <textarea
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors duration-300 ${
              darkMode
                ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-400'
                : 'bg-white text-black border-gray-300 placeholder-gray-500'
            }`}
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g. Create a blog post about AI in healthcare"
            disabled={overLimit}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="px-6 py-2 text-white transition duration-200 bg-indigo-600 rounded hover:bg-indigo-700"
          disabled={loading || overLimit}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {/* Output */}
        {output && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-indigo-700">
              Generated Output:
            </h2>
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
                <div className="p-4 mb-4 text-sm leading-relaxed whitespace-pre-wrap bg-gray-100 border rounded">
                  {output}
                </div>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-white transition duration-200 bg-indigo-600 rounded hover:bg-indigo-700"
                  disabled={saveLoading || overLimit}
                >
                  {saveLoading ? 'Saving...' : 'Save Output'}
                </button>
              </>
            )}
            {saveMessage && (
              <p className="mt-2 text-sm text-green-600">{saveMessage}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
