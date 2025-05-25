# Import necessary modules
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import os

# Load .env
load_dotenv()

client= OpenAI(api_key=os.getenv("OPEN_API_KEY"))

# Init LangChain LLM
llm = ChatOpenAI(model="gpt-3.5-turbo", api_key=os.getenv("OPEN_API_KEY"))

# Define the Expected Output Structure (for LangChain)
response_schemas = [
    ResponseSchema(name="type", description="Type of content e.g. blog_post, email_draft"),
    ResponseSchema(name="data", description="The generated content itself as text"),
]

parser = StructuredOutputParser.from_response_schemas(response_schemas)
format_instructions = parser.get_format_instructions()

# Create PromptTemplate with format instructions
prompt_template = PromptTemplate(
    template=(
        "You are a professional AI content writer.\n"
        "Generate a {template_type} based on the following details:\n"
        "{details}\n\n"
        "{format_instructions}"
    ),
    input_variables=["template_type", "details"],
    partial_variables={"format_instructions": format_instructions}
)


# Generate Text Template using LangChain LLM
def generate_text_template(template_type: str, details: str) -> str:
    try:
        prompt = prompt_template.format(template_type=template_type, details=details)
        response = llm.invoke(prompt)
        parsed = parser.parse(response.content)

        return parsed['data'].strip()  # Safe fallback to string
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LangChain error: {str(e)}")



prompt_styles= {
    "product": "Highly detailed, realistic image of {item}. Studio lighting, product photography, 4K quality.",
    "art": "Surreal artistic illustration of {item}, soft brush strokes, pastel colors.",
    "fantasy": "Epic cinematic scene of {item}, fantasy environment, 8K, volumetric lighting.",
}
def generate_image_template(prompt: str, style: str="product") -> str:
    try:
        template= prompt_styles.get(style, prompt_styles["product"])
        enhanced_prompt=template.format(item=prompt)
        response = client.images.generate(model="dall-e-3", prompt=enhanced_prompt, n=1, size="1024x1024")
        return  response.data[0].url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation error: {str(e)}")
