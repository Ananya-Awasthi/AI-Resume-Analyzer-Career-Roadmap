import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AnalyzerSelect() {
  const navigate = useNavigate();

  const handleSelect = async (type) => {
    try {
      await fetch("http://127.0.0.1:5000/api/analysis/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis_type: type }),
      });

      navigate(`/analyze/${type}`);
    } catch {
      alert("Backend not reachable");
    }
  };

  const cardBase = {
    height: "100%",
    p: 4,
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        pt: { xs: 8, md: 10 },
        pb: 8,
      }}
    >
      {/* Heading */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        color="white"
      >
        Choose Analysis Type
      </Typography>

      <Typography
        textAlign="center"
        sx={{ mt: 1, mb: 7, color: "gray" }}
      >
        Select how you want your resume to be analyzed
      </Typography>

      {/* Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 4,
        }}
      >
        {/* STANDARD ANALYZER */}
        <Paper
          sx={{
            ...cardBase,
            backgroundColor: "#111827",
            border: "1px solid #1f2937",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
            },
          }}
          onClick={() => handleSelect("standard")}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 ,color:"#64748b"
          }}>
            <Typography fontSize="24px">🛡️</Typography>
            <Typography variant="h6" fontWeight="bold">
              Standard Analyzer
            </Typography>
          </Box>

          <Typography sx={{ mt: 2, color: "gray", fontSize: "15px" }}>
            ATS-focused analysis that checks structure, formatting,
            and keyword relevance.
          </Typography>

          <Divider sx={{ my: 3, borderColor: "#1f2937" }} />

          {/* Features */}
          <Box sx={{ flexGrow: 1 ,color:"#64748b"}}>
            <Typography sx={{ mb: 1 }}>✔ ATS Score</Typography>
            <Typography sx={{ mb: 1 }}>✔ Format Analysis</Typography>
            <Typography>✔ Skill Match</Typography>
          </Box>

          {/* CTA */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 4,
              backgroundColor: "#334155",
              borderRadius: "12px",
              py: 1.2,
              ":hover": { backgroundColor: "#475569" },
            }}
          >
            Run Standard Analysis
          </Button>
        </Paper>

        {/* AI ANALYZER */}
        <Paper
          sx={{
            ...cardBase,
            backgroundColor: "#020617",
            border: "1px solid #06b6d4",
            boxShadow: "0 0 0 1px rgba(6,182,212,0.25)",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 0 40px rgba(6,182,212,0.4)",
            },
          }}
          onClick={() => handleSelect("ai")}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5,color:"#06b6d4" }}>
            <Typography fontSize="24px">🤖</Typography>
            <Typography variant="h6" fontWeight="bold">
              AI Analyzer
            </Typography>
          </Box>

          <Typography sx={{ mt: 2, color: "gray", fontSize: "15px" }}>
            AI-powered evaluation with role-fit insights and a
            personalized learning roadmap.
          </Typography>

          <Divider sx={{ my: 3, borderColor: "#0f766e" }} />

          {/* Features */}
          <Box sx={{ flexGrow: 1 , color:"#06b6d4"}}>
            <Typography sx={{ mb: 1 }}>✔ Resume Score</Typography>
            <Typography sx={{ mb: 1 }}>✔ Role Fit Analysis</Typography>
            <Typography>✔ Learning Roadmap</Typography>
          </Box>

          {/* CTA */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 4,
              backgroundColor: "#06b6d4",
              borderRadius: "12px",
              py: 1.2,
              ":hover": { backgroundColor: "#0e7490" },
            }}
          >
            Run AI Analysis
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

