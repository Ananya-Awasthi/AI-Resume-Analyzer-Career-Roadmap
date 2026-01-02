def formatting_score(resume_text):
    bullets = resume_text.count("•") + resume_text.count("-")
    paragraphs = resume_text.count("\n")

    score = 20

    if bullets < 5:
        score -= 5
    if paragraphs < 10:
        score -= 5

    return max(score, 0)
def length_score(resume_text):
    words = len(resume_text.split())

    if 300 <= words <= 900:
        return 10
    elif 200 <= words <= 1200:
        return 7
    else:
        return 4


def file_score(filename):
    return 5 if filename.endswith((".pdf", ".docx")) else 0
