def keyword_score(resume_text, required_skills):
    resume_text = resume_text.lower()
    matched = [s for s in required_skills if s.lower() in resume_text]

    match_percent = len(matched) / len(required_skills)
    score = match_percent * 40  # 40%

    return {
        "score": round(score, 2),
        "matched": matched,
        "missing": list(set(required_skills) - set(matched)),
        "percentage": round(match_percent * 100, 1),
    }
