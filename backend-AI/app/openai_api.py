import openai
from fastapi import HTTPException
import os
from dotenv import load_dotenv

load_dotenv()

# connect to openai 
client = openai.OpenAI(api_key=os.getenv("OPEN_API_KEY"))


# Create text generation function 

def generate_text_template(template_type: str, details: str) -> str:
  
    try:
      
        if template_type in ["blog_post", "email_draft"]:
          
          
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",  # or "gpt-4" if you have access
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": details}
                ],
                max_tokens=500 if template_type == "blog_post" else 250,
                temperature=0.7,
            )
            
            return response.choices[0].message.content.strip()
          
        else:
           raise HTTPException(status_code=400, detail="Unsupported template type")
          
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating template: {str(e)}")


def generate_image_template(prompt: str) -> str:
    try:
        response = client.images.generate(
            prompt=prompt,
            n=1,
            size="1024x1024"
        )
        return response.data[0].url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")
