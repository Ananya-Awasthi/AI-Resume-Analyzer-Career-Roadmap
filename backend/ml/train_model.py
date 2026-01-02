import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from joblib import dump

# ------------------------------
# 1. Create synthetic training data
# ------------------------------

data = [
    # HIGH quality resumes
    {"ats_score": 90, "skill_match_percentage": 95, "missing_skills_count": 0,
     "sections_found_ratio": 1.0, "resume_word_count": 650, "label": 2},

    {"ats_score": 85, "skill_match_percentage": 88, "missing_skills_count": 1,
     "sections_found_ratio": 1.0, "resume_word_count": 700, "label": 2},

    # MEDIUM quality resumes
    {"ats_score": 65, "skill_match_percentage": 60, "missing_skills_count": 2,
     "sections_found_ratio": 0.75, "resume_word_count": 450, "label": 1},

    {"ats_score": 58, "skill_match_percentage": 55, "missing_skills_count": 3,
     "sections_found_ratio": 0.75, "resume_word_count": 400, "label": 1},

    # LOW quality resumes
    {"ats_score": 40, "skill_match_percentage": 30, "missing_skills_count": 5,
     "sections_found_ratio": 0.5, "resume_word_count": 250, "label": 0},

    {"ats_score": 35, "skill_match_percentage": 20, "missing_skills_count": 6,
     "sections_found_ratio": 0.5, "resume_word_count": 200, "label": 0},
]

df = pd.DataFrame(data)

# ------------------------------
# 2. Split features & labels
# ------------------------------

X = df.drop("label", axis=1)
y = df["label"]

# ------------------------------
# 3. Train model
# ------------------------------

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)

# ------------------------------
# 4. Save model
# ------------------------------

dump(model, "resume_quality_model.joblib")

print("✅ Resume Quality ML model trained and saved")
