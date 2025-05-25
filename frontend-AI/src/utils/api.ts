import { AppConfig } from "./AppConfig";    

export async function registerUser(data: {username: string,email: string, password: string}){
    const res = await fetch(`${AppConfig.apiUrl}/auth/register`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Registration failed');
    }
    return res.json();
}


export async function loginUser(data: { username?: string, email?: string, password: string }) {
    const res = await fetch(`${AppConfig.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    if (!res.ok){
        throw new Error('Login failed');
    }
    
    
    
    const responseData = await res.json();  // Get the response data
    return responseData;  // Return the response data to AuthContext
  }

// API call 
export const fetchAIResponse = async (templateType: string, details: string) => {
  let url = '';
  let body: any = {};

  if (templateType === 'image') {
    url = `${AppConfig.apiUrl}/generate/generate-image-template`;
    body ={ prompt: details };  // key must be "prompt"
  } else {
    url = `${AppConfig.apiUrl}/generate/generate-template`;
    body = { template_type: templateType, details };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'AI generation failed');
  }

  return templateType === 'image' ? data.image_url : data.generated_template;
};
