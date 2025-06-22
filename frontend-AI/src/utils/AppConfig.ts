export const AppConfig = {
  site_name: 'AI Content Generator',
  title: 'AI Content Generator',
  description:
    'Generate high-quality content effortlessly with AI-powered tools for blogs, emails, ads, and more.',
  locale: 'en',

  // Backend API base URL
  // Set NEXT_PUBLIC_API_URL in Railway environment variables
  // Example: https://your-backend-app.railway.app
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://backend-ai-production-f1fa.up.railway.app/',
};
