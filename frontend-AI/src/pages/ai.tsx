import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { fetchAIResponse, saveOutput, SaveOutputRequest, fetchProfileData } from '../utils/api';
import Link from 'next/link';

const FREE_TOKEN_LIMIT = 1000; // same as backend limit

const AIPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [templateType, setTemplateType] = useState<'blog_post' | 'email_draft' | 'image'>('blog_post');
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
      fetchProfileData(token).then(profile => {
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
        fetchProfileData(token).then(profile => {
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
      fetchProfileData(token).then(profile => {
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
    <div className="min-h-screen bg-indigo-600 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white text-black rounded-xl p-8 shadow-lg">
        {/* Navigation Links */}
        <div className="flex justify-end gap-4 mb-4">
          <Link href="/">
            <span className="text-indigo-700 hover:underline font-semibold cursor-pointer">Home</span>
          </Link>
          <Link href="/profile">
            <span className="text-indigo-700 hover:underline font-semibold cursor-pointer">Profile</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">🤖 AI Assistant</h1>

        {/* Token usage display */}
        <div className="mb-6 p-3 rounded bg-indigo-200 text-indigo-900 font-semibold">
          Tokens Used: {tokenUsage !== null ? tokenUsage : '...'} / {FREE_TOKEN_LIMIT}
          {overLimit && (
            <span className="ml-4 text-red-600 font-bold">Token limit reached!</span>
          )}
        </div>

        {/* Template Selector */}
        <div className="mb-6">
          <label className="block font-semibold text-lg mb-3 text-gray-800">
            Select Template Type:
          </label>
          <div className="flex gap-4 flex-wrap">
            {[
              { type: 'blog_post', label: '📝 Blog Post' },
              { type: 'email_draft', label: '📧 Email Draft' },
              { type: 'image', label: '🖼️ Image' },
            ].map((option) => (
              <button
                key={option.type}
                onClick={() => handleTemplateTypeChange(option.type as any)}
                className={`px-5 py-3 rounded-xl border transition duration-300 shadow-md ${
                  templateType === option.type
                    ? 'bg-indigo-600 text-white ring-2 ring-offset-2 ring-indigo-300'
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
          <label className="block font-medium mb-1 text-gray-700">Prompt / Details:</label>
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
          className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition duration-200"
          disabled={loading || overLimit}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {/* Output */}
        {output && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Generated Output:</h2>
            {templateType === 'image' ? (
              <>
                <img
                  src={output}
                  alt="Generated"
                  className="w-full max-h-[400px] object-contain border rounded mb-4"
                />
                <button
                  onClick={downloadImage}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 mr-4"
                >
                  Download Image
                </button>
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
                  disabled={saveLoading || overLimit}
                >
                  {saveLoading ? 'Saving...' : 'Save Output'}
                </button>
              </>
            ) : (
              <>
                <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm leading-relaxed border mb-4">
                  {output}
                </div>
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
                  disabled={saveLoading || overLimit}
                >
                  {saveLoading ? 'Saving...' : 'Save Output'}
                </button>
              </>
            )}
            {saveMessage && <p className="mt-2 text-sm text-green-600">{saveMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPage;