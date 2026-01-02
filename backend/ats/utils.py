def length_score(resume_text):
    words = len(resume_text.split())

    if 300 <= words <= 900:
        return 10
    elif 200 <= words <= 1200:
        return 7
    else:
        return 4


def file_score(filename):
    if filename.lower().endswith((".pdf", ".docx")):
        return 5
    return 0
