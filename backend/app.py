from flask import Flask, request, jsonify,send_file
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from ats.scorer import calculate_ats
from ml.features import extract_ml_features
from ml.predict import predict_resume_quality
from ats.extractor import extract_text
from ats.role_skills import SKILLS_BY_ROLE
from ai.ai_analyzer import run_ai_analysis
from ats.role_skills import SKILLS_BY_ROLE
from ai.pdf_generator import generate_ai_pdf
from flask import send_file



app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {"pdf", "docx"}

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ✅ Ensure uploads folder exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def index():
    return "AI Resume Analysis Backend is running." 


@app.route("/api/resume/setup", methods=["POST"])
def resume_setup():
    job_category = request.form.get("job_category")
    role = request.form.get("role")
    file = request.files.get("resume")

    if not job_category or not role:
        return jsonify({"error": "Job category and role are required"}), 400

    if not file or file.filename == "":
        return jsonify({"error": "Resume file is required"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    filename = secure_filename(file.filename)
    save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(save_path)

    # ✅ Save role context (no DB needed)
    with open("current_resume_context.txt", "w") as f:
        f.write(f"{job_category}|{role}")

    return jsonify({
        "message": "Resume uploaded successfully",
        "job_category": job_category,
        "role": role,
        "filename": filename
    }), 200



@app.route("/api/analysis/select", methods=["POST"])
def select_analysis():
    analysis_type = request.json.get("analysis_type")

    if analysis_type not in ["standard", "ai"]:
        return jsonify({"error": "Invalid analysis type"}), 400

    return jsonify({
        "message": "Analysis type selected",
        "analysis_type": analysis_type
    }), 200


@app.route("/api/resume/analyze/standard", methods=["POST"])
def standard_analysis():
    data = request.get_json()
    filename = data.get("filename")

    if not filename:
        return jsonify({"error": "Filename required"}), 400

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    # ✅ Load role context
    try:
        with open("current_resume_context.txt") as f:
            job_category, role = f.read().split("|")
    except Exception:
        return jsonify({"error": "Resume context not found"}), 400

    # ✅ Role-based skills
    required_skills = SKILLS_BY_ROLE[job_category][role]

    result = calculate_ats(
        file_path=file_path,
        filename=filename,
        required_skills=required_skills
    )

    print("ATS Result:", result)
    return jsonify(result), 200

@app.route("/api/resume/analyze/ml", methods=["POST"])
def ml_analysis():
    data = request.get_json()
    filename = data.get("filename")

    if not filename:
        return jsonify({"error": "Filename required"}), 400

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    # 1. ATS analysis (reuse existing logic)
    required_skills = ["python", "sql", "flask", "apis", "database", "git"]
    ats_result = calculate_ats(file_path, filename, required_skills)

    # 2. Resume text
    resume_text = extract_text(file_path)

    # 3. Feature extraction
    features = extract_ml_features(ats_result, resume_text)

    # 4. ML Prediction
    ml_result = predict_resume_quality(features)

    return jsonify({
        "quality": ml_result["quality"],
        "confidence": ml_result["confidence"],
        "features_used": features
    }), 200

@app.route("/api/resume/analyze/ai", methods=["POST"])
def ai_analysis():
    data = request.get_json()
    filename = data.get("filename")

    if not filename:
        return jsonify({"error": "Filename required"}), 400

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    # Load role context
    with open("current_resume_context.txt") as f:
        job_category, role = f.read().split("|")

    required_skills = SKILLS_BY_ROLE[job_category][role]

    # Run standard analyzer
    ats_result = calculate_ats(file_path, filename, required_skills)

    # Build AI input contract
    ai_input = {
        "job_category": job_category,
        "role": role,
        "ats_summary": {
            "overall_score": ats_result["overall_score"],
            "skill_match_percentage": ats_result["skill_match_percentage"],
            "missing_skills_count": ats_result["missing_skills_count"],
            "resume_quality": ats_result["resume_quality"],
            "resume_length": ats_result["resume_length"],
            "sections_found": ats_result["sections_found"],
            "sections_total": ats_result["sections_total"]
        },
        "missing_skills": ats_result["missing_skills"],
        "constraints": {
            "max_words": 180,
            "tone": "professional",
            "no_score_recalculation": True
        }
    }

    ai_result = run_ai_analysis(ai_input)

    return jsonify({
        **ai_result,
        "ats_score": ats_result["overall_score"],
        "skill_match": ats_result["skill_match_percentage"]
    }), 200


@app.route("/api/resume/export/ai-pdf", methods=["POST"])
def export_ai_pdf():
    data = request.get_json()
    filename = data.get("filename")

    if not filename:
        return jsonify({"error": "Filename required"}), 400

    # Load role context
    with open("current_resume_context.txt") as f:
        job_category, role = f.read().split("|")

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    required_skills = SKILLS_BY_ROLE[job_category][role]
    ats_result = calculate_ats(file_path, filename, required_skills)

    ai_input = {
        "job_category": job_category,
        "role": role,
        "ats_summary": {
            "overall_score": ats_result["overall_score"],
            "skill_match_percentage": ats_result["skill_match_percentage"],
            "missing_skills_count": ats_result["missing_skills_count"],
            "resume_quality": ats_result["resume_quality"],
            "resume_length": ats_result["resume_length"],
            "sections_found": ats_result["sections_found"],
            "sections_total": ats_result["sections_total"]
        },
        "missing_skills": ats_result["missing_skills"],
    }

    ai_result = run_ai_analysis(ai_input)

    pdf_data = {
        "ats_score": ats_result["overall_score"],
        "skill_match": ats_result["skill_match_percentage"],
        **ai_result
    }

    pdf_path = f"ai_report_{filename}.pdf"
    generate_ai_pdf(pdf_path, pdf_data)

    return send_file(
        pdf_path,
        as_attachment=True,
        download_name="AI_Resume_Analysis.pdf"
    )



if __name__ == "__main__":
    app.run(debug=True)

