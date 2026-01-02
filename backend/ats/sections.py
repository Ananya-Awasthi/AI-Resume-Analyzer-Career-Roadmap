def section_score(resume_text):
    sections = ["experience", "education", "skills", "projects"]
    found = sum(1 for s in sections if s in resume_text.lower())

    score = (found / len(sections)) * 25  # 25%

    return {
        "score": round(score, 2),
        "found": found,
        "total": len(sections),
    }
