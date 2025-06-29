export const AppConfig = {
  site_name: 'AI Content Generator',
  title: 'AI Content Generator',
  description:
    'Generate high-quality content effortlessly with AI-powered tools for blogs, emails, ads, and more.',
  locale: 'en',

  // Backend API base URL
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
};

// Debug: Log the API URL being used
console.log('🔗 API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
