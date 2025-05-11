// pages/ai.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { fetchAIResponse } from '../utils/api';

const AIPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [templateType, setTemplateType] = useState<'blog_post' | 'email_draft' | 'image'>('blog_post');
  const [details, setDetails] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) router.replace('/signin');
  }, [user]);

  const handleGenerate = async () => {
    setLoading(true);
    setOutput('');
    try {
      const result = await fetchAIResponse(templateType, details);
      setOutput(result);
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

  return (
    <div className="min-h-screen bg-indigo-600 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white text-black rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">🤖 AI Assistant</h1>

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
                onClick={() => setTemplateType(option.type as any)}
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
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition duration-200"
          disabled={loading}
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
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
                >
                  Download Image
                </button>
              </>
            ) : (
              <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm leading-relaxed border">
                {output}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPage;
