def build_ai_prompt(data):
    return f"""
You are an expert technical career mentor.

Analyze the resume based ONLY on the provided ATS signals.
Do NOT recalculate scores.

Context:
Role: {data['role']}
Category: {data['job_category']}

ATS Summary:
- ATS Score: {data['ats_summary']['overall_score']}
- Skill Match: {data['ats_summary']['skill_match_percentage']}%
- Resume Quality: {data['ats_summary']['resume_quality']}
- Missing Skills Count: {data['ats_summary']['missing_skills_count']}
- Resume Length: {data['ats_summary']['resume_length']} words
- Sections Found: {data['ats_summary']['sections_found']} / {data['ats_summary']['sections_total']}

Missing Skills:
{", ".join(data['missing_skills'])}

TASKS:
1. Explain clearly why the ATS score is low or high.
2. Give role-fit reasoning.
3. Create a learning roadmap (max 5 steps).
4. Suggest 2–3 resume-worthy projects for this role.

Constraints:
- Be concise
- No markdown
- No emojis
- No score recalculation
- Max 180 words total

Return response in JSON with keys:
explanation, role_fit, roadmap, projects

Return ONLY valid JSON.
Do NOT include explanations outside JSON.
Do NOT include markdown.
Do NOT include trailing text.
The response MUST be a single JSON object.
"""
