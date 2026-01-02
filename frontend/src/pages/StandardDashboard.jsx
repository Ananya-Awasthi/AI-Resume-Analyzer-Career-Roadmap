import {
  Container,
  Typography,
  Box,
  Paper,
  LinearProgress,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function StandardDashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedSkill, setAnimatedSkill] = useState(0);

  const cardStyle = {
    p: 4,
    borderRadius: "18px",
    backgroundColor: "#020617",
    border: "1px solid #1f2937",
  };

  /* ---------------- FETCH ATS DATA ---------------- */
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const filename = localStorage.getItem("resume_filename");
        if (!filename) return;

        const res = await fetch(
          "http://127.0.0.1:5000/api/resume/analyze/standard",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename }),
          }
        );

        const data = await res.json();
        setAnalysis(data);
      } catch (err) {
        console.error("Analysis failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  /* ---------------- ANIMATIONS ---------------- */
  useEffect(() => {
    if (!analysis?.overall_score) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setAnimatedScore(i);
      if (i >= analysis.overall_score) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [analysis]);

  useEffect(() => {
    if (!analysis?.skill_match_percentage) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setAnimatedSkill(i);
      if (i >= analysis.skill_match_percentage) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [analysis]);

  if (loading || !analysis) {
    return (
      <Container sx={{ minHeight: "100vh", pt: 12, textAlign: "center" }}>
        <Typography color="#94a3b8">
          Analyzing your resume...
        </Typography>
      </Container>
    );
  }

  /* ---------------- DERIVED VALUES ---------------- */
  const missingSkillCount = analysis.missing_skills?.length || 0;

  const resumeQuality =
    analysis.overall_score >= 80
      ? "HIGH"
      : analysis.overall_score >= 60
      ? "MEDIUM"
      : "LOW";

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", pt: 8, pb: 10 }}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" color="white">
        Resume Analysis Report
      </Typography>
      <Typography sx={{ color: "#94a3b8", mb: 5 }}>
        ATS-based evaluation with structured insights
      </Typography>

      {/* ROW 1 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 3,
        }}
      >
        {/* ATS SCORE */}
        <Paper sx={cardStyle}>
          <Typography fontWeight="bold" color="#22c55e">
            🛡️ ATS Compatibility Score
          </Typography>

          <Box sx={{ mt: 4, display: "flex", gap: 4, alignItems: "center" }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: `conic-gradient(#22c55e 0% ${animatedScore}%, #1f2937 ${animatedScore}% 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  backgroundColor: "#020617",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  fontWeight: "bold",
                  color: "#22c55e",
                }}
              >
                {animatedScore}
              </Box>
            </Box>

            <Typography sx={{ color: "#94a3b8" }}>
              How well your resume passes ATS filters
            </Typography>
          </Box>
        </Paper>

        {/* MISSING SKILLS */}
        <Paper sx={cardStyle}>
          <Typography fontWeight="bold" color="#f87171">
            ❌ Missing Skills Count
          </Typography>

          <Typography
            sx={{
              mt: 4,
              fontSize: "42px",
              fontWeight: "bold",
              color: missingSkillCount === 0 ? "#22c55e" : "#f87171",
            }}
          >
            {missingSkillCount}
          </Typography>
        </Paper>
      </Box>

      {/* ROW 2 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mt: 3,
        }}
      >
        {/* SKILL MATCH */}
        <Paper sx={cardStyle}>
          <Typography fontWeight="bold" color="#22c55e">
            🎯 Skill Match Percentage
          </Typography>

          <Typography
            sx={{ mt: 3, fontSize: "26px", fontWeight: "bold", color: "#22c55e" }}
          >
            {animatedSkill}%
          </Typography>

          <LinearProgress
            variant="determinate"
            value={animatedSkill}
            sx={{
              mt: 2,
              height: 8,
              borderRadius: 5,
              backgroundColor: "#1f2937",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#22c55e",
              },
            }}
          />
        </Paper>

        {/* RESUME QUALITY */}
        <Paper sx={cardStyle}>
          <Typography fontWeight="bold" color="#38bdf8">
            ⭐ Resume Quality
          </Typography>

          <Typography
            sx={{
              mt: 4,
              fontSize: "32px",
              fontWeight: "bold",
              color:
                resumeQuality === "HIGH"
                  ? "#22c55e"
                  : resumeQuality === "MEDIUM"
                  ? "#facc15"
                  : "#f87171",
            }}
          >
            {resumeQuality}
          </Typography>

          <Typography sx={{ color: "#94a3b8" }}>
            Overall resume strength based on ATS signals
          </Typography>
        </Paper>
      </Box>

      {/* ROW 3 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3,
          mt: 3,
        }}
      >
        {/* RESUME LENGTH */}
        <Paper sx={cardStyle}>
          <Typography fontWeight="bold" color="#94a3b8">
            📄 Resume Length
          </Typography>
          <Typography
            sx={{ mt: 2, fontSize: "22px", fontWeight: "bold", color: "#94a3b8" }}
          >
            {analysis.resume_length ?? "—"} words
          </Typography>
        </Paper>

        {/* SECTIONS FOUND */}
        <Paper sx={cardStyle}>
          <Typography fontWeight="bold" color="#94a3b8">
            📂 Sections Found
          </Typography>
          <Typography
            sx={{ mt: 2, fontSize: "22px", fontWeight: "bold", color: "#94a3b8" }}
          >
            {analysis.sections_found && analysis.sections_total
              ? `${analysis.sections_found}/${analysis.sections_total}`
              : "—"}
          </Typography>
        </Paper>

        {/* FILE TYPE */}
        <Paper sx={cardStyle}>
          <Typography fontWeight="bold" color="#94a3b8">
            ⚙️ File Type
          </Typography>
          <Typography
            sx={{ mt: 2, fontSize: "22px", fontWeight: "bold", color: "#94a3b8" }}
          >
            ATS Friendly
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
