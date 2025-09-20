# Import necessary modules
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.prompts import PromptTemplate, ChatPromptTemplate
from dotenv import load_dotenv
import os

# Load .env
load_dotenv()

# Helper to load OpenAI key from environment
def _get_llm(model: str = "gpt-4o-mini", temperature: float = 0.6) -> ChatOpenAI:
    return ChatOpenAI(
        model=model,
        temperature=temperature,
        api_key=os.getenv("OPEN_API_KEY"),
    )

# OpenAI Images client (for image generation)
client = OpenAI(api_key=os.getenv("OPEN_API_KEY"))

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
        response = _get_llm().invoke(prompt)
        parsed = parser.parse(response.content)

        return parsed['data'].strip()  # Safe fallback to string
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LangChain error: {str(e)}")


# ---------------------------
# 1. Planner Agent
# ---------------------------
def planner_agent(user_text: str) -> str:
    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are ADHDNA Planner. Your role is to create a simple 3-step daily plan for ADHD users.\n"
         "Guidelines:\n"
         "1. Priority task: One small, specific action to start. Must be doable in 25 minutes. Suggest a timer.\n"
         "2. Secondary task: A light, supportive action (e.g., tidy 10 minutes, prep materials).\n"
         "3. Fun/reward: A short, guilt-free activity to celebrate progress.\n"
         "Tone: Empathetic, encouraging, non-judgmental. Short sentences. Keep it clear and actionable.\n"
         "Output only the plan. No extra explanations."),
        ("user", "{user_text}")
    ])
    chain = prompt | _get_llm()
    return chain.invoke({"user_text": user_text}).content


# ---------------------------
# 2. Coach Agent
# ---------------------------
def coach_agent(plan_text: str) -> str:
    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are ADHDNA Coach. Your role is to improve a 3-step plan created for ADHD users.\n"
         "Guidelines:\n"
         "- Keep the 3-step structure (priority, secondary, reward).\n"
         "- Add gentle accountability (e.g., set reminder, text a friend).\n"
         "- Normalize struggles and encourage self-kindness.\n"
         "- Use short, motivating sentences. Stay concise.\n"
         "Output only the improved plan."),
        ("user", "{plan_text}")
    ])
    chain = prompt | _get_llm(temperature=0.7)
    return chain.invoke({"plan_text": plan_text}).content


# ---------------------------
# 3. Organizer Agent
# ---------------------------
def organizer_agent(goal_text: str) -> str:
    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are ADHDNA Organizer. Break the user’s goal into 3–5 very small, concrete micro-steps.\n"
         "Guidelines:\n"
         "- Each step <10 minutes.\n"
         "- Sequential, actionable, and easy to start.\n"
         "- Format as a numbered list.\n"
         "- Avoid vague advice; every step should be specific.\n"
         "Respond only with the steps."),
        ("user", "{goal_text}")
    ])
    chain = prompt | _get_llm(temperature=0.5)
    return chain.invoke({"goal_text": goal_text}).content


# ---------------------------
# 4. Motivator Agent
# ---------------------------
def motivator_agent(context_text: str) -> str:
    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are ADHDNA Motivator. Provide a short burst of encouragement.\n"
         "Guidelines:\n"
         "- 1–2 sentences.\n"
         "- Friendly, energetic, normalize struggle.\n"
         "- End with a clear next action.\n"
         "Keep it uplifting, concise, and in plain text."),
        ("user", "{context_text}")
    ])
    chain = prompt | _get_llm(temperature=0.8)
    return chain.invoke({"context_text": context_text}).content


# ---------------------------
# 5. Orchestrator
# ---------------------------
def orchestrate_plan(user_text: str) -> str:
    draft_plan = planner_agent(user_text)
    improved_plan = coach_agent(draft_plan)
    motivation = motivator_agent(improved_plan)
    return f"{improved_plan}\n\nMotivation: {motivation}"


prompt_styles = {
    "product": "Highly detailed, realistic image of {item}. Studio lighting, product photography, 4K quality.",
    "art": "Surreal artistic illustration of {item}, soft brush strokes, pastel colors.",
    "fantasy": "Epic cinematic scene of {item}, fantasy environment, 8K, volumetric lighting.",
}

def generate_image_template(prompt: str, style: str="product") -> str:
    try:
        template = prompt_styles.get(style, prompt_styles["product"])
        enhanced_prompt = template.format(item=prompt)
        response = client.images.generate(model="dall-e-3", prompt=enhanced_prompt, n=1, size="1024x1024")
        return response.data[0].url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation error: {str(e)}")
