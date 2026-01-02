import os
import time
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "gemini-2.5-flash"

def call_gemini(prompt: str, retries: int = 2) -> str:
    for attempt in range(retries + 1):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )
            return response.text

        except Exception as e:
            if attempt == retries:
                raise e
            time.sleep(1.5)
