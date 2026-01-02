from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4

def generate_ai_pdf(filepath, data):
    doc = SimpleDocTemplate(filepath, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    def add_heading(text):
        elements.append(Paragraph(f"<b>{text}</b>", styles["Heading2"]))
        elements.append(Spacer(1, 12))

    def add_text(text):
        elements.append(Paragraph(text, styles["Normal"]))
        elements.append(Spacer(1, 10))

    add_heading("AI Resume Analysis Report")

    add_text(f"<b>ATS Score:</b> {data['ats_score']}/100")
    add_text(f"<b>Skill Match:</b> {data['skill_match']}%")

    add_heading("Why This ATS Score?")
    add_text(data["explanation"])

    add_heading("Role Fit Analysis")
    add_text(data["role_fit"])

    add_heading("Learning Roadmap")
    for step in data.get("roadmap", []):
        add_text(f"- {step}")

    add_heading("Recommended Projects")
    for project in data.get("projects", []):
        add_text(f"- {project}")

    doc.build(elements)
