import { AppConfig } from './AppConfig';

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${AppConfig.apiUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Registration failed');
  }
  return res.json();
}

export async function loginUser(data: {
  username?: string;
  email?: string;
  password: string;
}) {
  const res = await fetch(`${AppConfig.apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Login failed');
  }

  const responseData = await res.json(); // Get the response data
  localStorage.setItem('access_token', responseData.access_token); // Store the token in localStorage
  return responseData; // Return the response data to AuthContext
}

// API call
export const fetchAIResponse = async (
  templateType: string,
  details: string,
) => {
  let url = '';
  let body: any = {};

  if (templateType === 'image') {
    url = `${AppConfig.apiUrl}/generate/generate-image-template`;
    body = { prompt: details }; // key must be "prompt"
  } else {
    url = `${AppConfig.apiUrl}/generate/generate-template`;
    body = { template_type: templateType, details };
  }
  const token = localStorage.getItem('access_token');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'AI generation failed');
  }

  return templateType === 'image' ? data.image_url : data.generated_template;
};

export async function fetchProfileData(token?: string) {
  if (!token) {
    throw new Error('No token provided');
  }

  const res = await fetch(`${AppConfig.apiUrl}/auth/profile`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch profile data');
  }

  const data = await res.json();
  return data;
}

// SaveOutputRequest interface defines the expected structure for saving generated content.
// - template_type: Specifies the type of content ("blog_post", "email_draft", or "image").
// - content: The actual content to be saved.
export interface SaveOutputRequest {
  template_type: 'blog_post' | 'email_draft' | 'image';
  content: string;
}

/**
 * Saves generated output to the backend.
 *
 * @param data - The output data to save (type and content).
 * @param token - The user's JWT access token for authentication.
 * @returns A promise resolving to an object with a success message and the output ID.
 * @throws Error if the request fails or the backend returns an error.
 */
export async function saveOutput(
  data: SaveOutputRequest,
  token: string,
): Promise<{ message: string; output_id: number }> {
  const res = await fetch(`${AppConfig.apiUrl}/save/save-output`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  // If the response is not OK, try to extract the error message and throw.
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to save output');
  }

  // On success, return the parsed JSON response.
  return res.json();
}
