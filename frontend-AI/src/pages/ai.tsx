import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import type { SaveOutputRequest } from '../utils/api';
import { fetchAIResponse, fetchProfileData, saveOutput } from '../utils/api';

const FREE_TOKEN_LIMIT = 1000; // same as backend limit

const AIPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [templateType, setTemplateType] = useState<
    'blog_post' | 'email_draft' | 'image'
  >('blog_post');
  const [details, setDetails] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

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
      console.error('Generation error:', err);
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
    <div className="min-h-screen bg-indigo-600 px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 text-black shadow-lg">
        {/* Navigation Links */}
        <div className="mb-4 flex justify-end gap-4">
          <Link href="/">
            <span className="cursor-pointer font-semibold text-indigo-700 hover:underline">
              Home
            </span>
          </Link>
          <Link href="/profile">
            <span className="cursor-pointer font-semibold text-indigo-700 hover:underline">
              Profile
            </span>
          </Link>
        </div>

        <h1 className="mb-6 text-center text-3xl font-bold">🤖 AI Assistant</h1>

        {/* Token usage display */}
        <div className="mb-6 rounded bg-indigo-200 p-3 font-semibold text-indigo-900">
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
          <label className="mb-3 block text-lg font-semibold text-gray-800">
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
          <label className="mb-1 block font-medium text-gray-700">
            Prompt / Details:
          </label>
          <textarea
            className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
          className="rounded bg-indigo-600 px-6 py-2 text-white transition duration-200 hover:bg-indigo-700"
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
                  className="mr-4 rounded bg-green-600 px-4 py-2 text-white transition duration-200 hover:bg-green-700"
                >
                  Download Image
                </button>
                <button
                  onClick={handleSave}
                  className="rounded bg-indigo-600 px-4 py-2 text-white transition duration-200 hover:bg-indigo-700"
                  disabled={saveLoading || overLimit}
                >
                  {saveLoading ? 'Saving...' : 'Save Output'}
                </button>
              </>
            ) : (
              <>
                <div className="mb-4 whitespace-pre-wrap rounded border bg-gray-100 p-4 text-sm leading-relaxed">
                  {output}
                </div>
                <button
                  onClick={handleSave}
                  className="rounded bg-indigo-600 px-4 py-2 text-white transition duration-200 hover:bg-indigo-700"
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
};

export default AIPage;
