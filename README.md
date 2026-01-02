# 🧠AI-Resume-Analyzer-Career-Roadmap
---

ATS-Driven Resume Analysis with ML & Gemini AI Insights.
A full-stack resume analysis platform that allows users to upload a resume and analyze it using two modes:

**Standard Analyzer** → Rule-based + ML ATS evaluation

**AI Analyzer** → ATS signals + Gemini AI explanations, role-fit analysis, roadmap & projects

Built to simulate real Applicant Tracking System (ATS) behavior while also providing human-readable AI insights.

---

**🚀 Features Overview**

🔹 Resume Upload & Role Selection

- Upload resume (PDF / DOCX)
- Select job category and specific role
- Role-based skill matching using predefined skill maps

🔹 Standard Analyzer (ATS Engine)

- Calculates resume quality using explainable formulas + ML
- Metrics Generated:
- ATS Compatibility Score (0–100)
- Skill Match Percentage
- Missing Skills Count
- Resume Quality (LOW / MEDIUM / HIGH)
- Resume Length (word count)
- Sections Found (Experience, Education, Skills, Projects)
- File Type (ATS Friendly or Not)

📌 Uses rule-based scoring + Random Forest ML model
📌 No AI hallucination — deterministic & explainable

🔹 AI Analyzer (Gemini-Powered)

- Builds on Standard Analyzer results and explains them using AI.
- AI Insights Provided:
- Why this ATS score?
- Role Fit Analysis
- Personalized Learning Roadmap (max 5 steps)
- Resume-worthy Project Suggestions (2–3)

📌 AI does NOT recalculate scores
📌 AI only interprets ATS outputs
📌 Cached responses to reduce API usage

🔹 AI Report Export

- Download AI Resume Analysis as PDF
- Includes ATS score, explanation, role fit, roadmap & projects

---

**🧩System Architecture**

Frontend (React + MUI)
        ↓
Flask Backend (REST API)
        ↓
ATS Engine (Rules + ML)
        ↓
AI Analyzer (Gemini API)

---

**🛠️Tech Stack**

**Frontend:** React (Vite), Material UI (MUI), React Router, Fetch API

**Backend:** Python, Flask, Flask-CORS

**ATS & ML:** Custom ATS scoring formulas, RandomForestClassifier (scikit-learn), Joblib (model persistence)

**AI:** Google Gemini API, Prompt-engineered JSON output, Response caching

**Utilities:** pdfplumber (PDF parsing), python-docx (DOCX parsing), reportlab (PDF generation)

---

📊 **ATS Scoring Breakdown**

Component	Weight

Skill / Keyword Match	40%

Resume Sections	25%

Formatting	20%

Resume Length	10%

File Type	5%

Final ATS score is fully explainable and deterministic.

---

🧠 **Machine Learning Usage**

A Random Forest Classifier predicts resume quality based on:

- ATS score
- Skill match %
- Missing skills count
- Sections found ratio
- Resume word count

Output:
- Resume Quality (LOW / MEDIUM / HIGH)
- Confidence score

---

⚙️ **Local Setup Instructions**

Clone the project

```bash
  git clone https://github.com/Ananya-Awasthi/AI-Resume-Analyzer-Career-Roadmap/tree/main
```

Go to the project directory

```bash
  cd AI-Resume-Analyzer-Career-Roadmap
```

Create a Virtual Environment

```bash
  cd backend
  python -m venv venv
```

Install dependencies:

```bash
  pip install -r requirements.txt
```

Create .env file:

```env
GEMINI_API_KEY=your_api_key_here
```

Run backend
```bash
python app.py
```

Frontend setup

```bash
  cd frontend
  npm install
  npm run dev
```

Open

```bash
  http://localhost:5173
```
---

🔐 **Security & Best Practices**

- .env excluded using .gitignore
- AI responses cached to prevent API abuse
- No resume data stored permanently
- No database required

---

🧪 **Future Improvements**

- Job description upload
- Resume comparison
- Resume rewriting suggestions
- Multi-language support
- User authentication & history
