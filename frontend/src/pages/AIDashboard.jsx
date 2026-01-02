import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Chip,
  Button,
  LinearProgress,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function AIDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH AI DATA ---------------- */
  useEffect(() => {
    const runAIAnalysis = async () => {
      try {
        const filename = localStorage.getItem("resume_filename");

        const res = await fetch(
          "http://127.0.0.1:5000/api/resume/analyze/ai",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename }),
          }
        );

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("AI analysis failed", err);
      } finally {
        setLoading(false);
      }
    };

    runAIAnalysis();
  }, []);

  /* ---------------- PDF DOWNLOAD ---------------- */
  const downloadPDF = async () => {
    const filename = localStorage.getItem("resume_filename");

    const res = await fetch(
      "http://127.0.0.1:5000/api/resume/export/ai-pdf",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "AI_Resume_Analysis.pdf";
    a.click();
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <Container sx={{ minHeight: "100vh", pt: 12, textAlign: "center" }}>
        <Typography color="gray">
          Running AI-powered resume analysis...
        </Typography>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container sx={{ minHeight: "100vh", pt: 12, textAlign: "center" }}>
        <Typography color="red">Failed to load AI analysis</Typography>
      </Container>
    );
  }

  const {
    explanation,
    role_fit,
    roadmap = [],
    projects = [],
    ats_score,
    skill_match,
  } = data;

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", pt: 8, pb: 10 }}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" color="white">
        AI Resume Analyzer
      </Typography>

      <Typography sx={{ color: "#9ca3af", mb: 3 }}>
        ATS score + Gemini-powered role intelligence
      </Typography>

      <Button
        onClick={downloadPDF}
        variant="outlined"
        sx={{
          mb: 5,
          color: "#38bdf8",
          borderColor: "#38bdf8",
          "&:hover": { backgroundColor: "#020617" },
        }}
      >
        Download AI Report (PDF)
      </Button>

      {/* ATS SCORE + SKILL MATCH */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
          mb: 5,
        }}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: "20px",
            backgroundColor: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <Typography color="#22c55e" fontWeight="bold">
            📊 ATS Score
          </Typography>

          <Typography variant="h3" fontWeight="bold" color="white" sx={{ mt: 1 }}>
            {ats_score}/100
          </Typography>

          <LinearProgress
            variant="determinate"
            value={ats_score}
            sx={{
              height: 10,
              borderRadius: 5,
              mt: 2,
              backgroundColor: "#1f2937",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#22c55e",
              },
            }}
          />
        </Paper>

        <Paper
          sx={{
            p: 4,
            borderRadius: "20px",
            backgroundColor: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <Typography color="#38bdf8" fontWeight="bold">
            🧩 Skill Match
          </Typography>

          <Typography variant="h3" fontWeight="bold" color="white" sx={{ mt: 1 }}>
            {skill_match}%
          </Typography>

          <LinearProgress
            variant="determinate"
            value={skill_match}
            sx={{
              height: 10,
              borderRadius: 5,
              mt: 2,
              backgroundColor: "#1f2937",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#38bdf8",
              },
            }}
          />
        </Paper>
      </Box>

      {/* EXPLANATION + ROLE FIT */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
        }}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: "20px",
            backgroundColor: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <Typography color="#38bdf8" fontWeight="bold">
            🧠 Why this ATS score?
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ color: "#d1d5db", lineHeight: 1.7 }}>
            {explanation}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 4,
            borderRadius: "20px",
            backgroundColor: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <Typography color="#06b6d4" fontWeight="bold">
            🎯 Role Fit Analysis
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ color: "#d1d5db", lineHeight: 1.7 }}>
            {role_fit}
          </Typography>
        </Paper>
      </Box>

      {/* ROADMAP */}
      <Paper
        sx={{
          mt: 5,
          p: 4,
          borderRadius: "20px",
          backgroundColor: "#020617",
          border: "1px solid #1f2937",
        }}
      >
        <Typography color="#facc15" fontWeight="bold">
          🛣️ Learning Roadmap
        </Typography>
        <Divider sx={{ my: 2 }} />

        {roadmap.length === 0 ? (
          <Typography color="gray">No roadmap available</Typography>
        ) : (
          roadmap.map((step, idx) => (
            <Typography key={idx} sx={{ color: "#e5e7eb", mb: 1 }}>
              • {step}
            </Typography>
          ))
        )}
      </Paper>

      {/* PROJECTS */}
      <Paper
        sx={{
          mt: 4,
          p: 4,
          borderRadius: "20px",
          backgroundColor: "#020617",
          border: "1px solid #1f2937",
        }}
      >
        <Typography color="#22c55e" fontWeight="bold">
          🧩 Resume-worthy Projects
        </Typography>
        <Divider sx={{ my: 2 }} />

        {projects.length === 0 ? (
          <Typography color="gray">No projects suggested</Typography>
        ) : (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {projects.map((project, idx) => (
              <Chip
                key={idx}
                label={project}
                sx={{
                  backgroundColor: "#0f172a",
                  color: "#e5e7eb",
                  border: "1px solid #1f2937",
                }}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
