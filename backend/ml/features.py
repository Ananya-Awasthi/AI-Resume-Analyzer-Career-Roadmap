def extract_ml_features(ats_result, resume_text):
    words = len(resume_text.split())

    return {
        "ats_score": ats_result["overall_score"],
        "skill_match_percentage": ats_result["skill_match_percentage"],
        "missing_skills_count": len(ats_result["missing_skills"]),
        "sections_found_ratio": 1.0 if ats_result["overall_score"] > 70 else 0.75,
        "resume_word_count": words
    }
