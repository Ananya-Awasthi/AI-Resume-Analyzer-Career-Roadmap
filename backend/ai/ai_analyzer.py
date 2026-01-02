import json
import re
import os
import hashlib

DEFAULT_AI_RESPONSE = {
    "explanation": "AI analysis could not be generated. Showing ATS-based insights instead.",
    "role_fit": "Role fit analysis unavailable.",
    "roadmap": [],
    "projects": []
}

CACHE_DIR = "ai_cache"
os.makedirs(CACHE_DIR, exist_ok=True)

def extract_json_safely(text: str):
    try:
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            return None
        return json.loads(match.group())
    except Exception:
        return None

def get_cache_key(data):
    key_str = f"{data['job_category']}|{data['role']}|{data['ats_summary']}"
    return hashlib.md5(key_str.encode()).hexdigest()

def run_ai_analysis(data):
    from ai.prompt_builder import build_ai_prompt
    from ai.gemini_client import call_gemini

    cache_key = get_cache_key(data)
    cache_path = os.path.join(CACHE_DIR, f"{cache_key}.json")

    # ✅ Return cached result if exists
    if os.path.exists(cache_path):
        with open(cache_path) as f:
            return json.load(f)

    prompt = build_ai_prompt(data)

    try:
        raw_response = call_gemini(prompt)
        print("RAW GEMINI RESPONSE:\n", raw_response)

        parsed = extract_json_safely(raw_response)
        if not parsed:
            raise ValueError("Gemini did not return valid JSON")

        # ✅ Ensure required keys
        for key in ["explanation", "role_fit", "roadmap", "projects"]:
            if key not in parsed:
                parsed[key] = DEFAULT_AI_RESPONSE[key]

        # ✅ Normalize lengths
        parsed["roadmap"] = parsed.get("roadmap", [])[:5]
        parsed["projects"] = parsed.get("projects", [])[:3]

        # ✅ Cache result
        with open(cache_path, "w") as f:
            json.dump(parsed, f)

        return parsed

    except Exception as e:
        print("AI ANALYZER FALLBACK:", str(e))
        return DEFAULT_AI_RESPONSE
