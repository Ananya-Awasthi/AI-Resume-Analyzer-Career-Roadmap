from .keywords import keyword_score
from .sections import section_score
from .formatting import formatting_score
from .extractor import extract_text
from .utils import length_score, file_score

def calculate_ats(file_path, filename, required_skills):
    resume_text = extract_text(file_path)

    if not resume_text.strip():
        return {
            "overall_score": 0,
            "skill_match_percentage": 0,
            "missing_skills": required_skills,
            "missing_skills_count": len(required_skills),
            "resume_quality": "LOW",
            "resume_length": 0,
            "sections_found": 0,
            "sections_total": 4,
            "file_type": "Invalid"
        }

    # Keyword score
    kw = keyword_score(resume_text, required_skills)

    # Sections
    sec = section_score(resume_text)

    # Formatting
    fmt = formatting_score(resume_text)

    # Length
    length = length_score(resume_text)
    word_count = len(resume_text.split())

    # File type
    filetype = file_score(filename)

    # Total ATS score
    overall_score = round(
        kw["score"] + sec["score"] + fmt + length + filetype
    )

    # Resume quality (derived, explainable)
    if overall_score >= 80:
        quality = "HIGH"
    elif overall_score >= 60:
        quality = "MEDIUM"
    else:
        quality = "LOW"

    return {
        "overall_score": overall_score,
        "skill_match_percentage": int(kw["percentage"]),
        "missing_skills": kw["missing"],
        "missing_skills_count": len(kw["missing"]),
        "resume_quality": quality,
        "resume_length": word_count,
        "sections_found": sec["found"],
        "sections_total": sec["total"],
        "file_type": "ATS Friendly" if filetype > 0 else "Not ATS Friendly"
    }
