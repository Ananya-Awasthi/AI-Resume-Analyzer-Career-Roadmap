import os
from joblib import load
import numpy as np

# Load model safely
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "resume_quality_model.joblib"
)

model = load(MODEL_PATH)

def predict_resume_quality(features_dict):
    """
    Input: feature dictionary
    Output: ML prediction + confidence
    """

    feature_vector = np.array([[
        features_dict["ats_score"],
        features_dict["skill_match_percentage"],
        features_dict["missing_skills_count"],
        features_dict["sections_found_ratio"],
        features_dict["resume_word_count"],
    ]])

    prediction = model.predict(feature_vector)[0]
    proba = model.predict_proba(feature_vector)[0]

    confidence = int(max(proba) * 100)

    quality_map = {
        0: "LOW",
        1: "MEDIUM",
        2: "HIGH"
    }

    return {
        "quality": quality_map[prediction],
        "confidence": confidence
    }
