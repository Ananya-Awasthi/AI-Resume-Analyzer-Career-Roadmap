import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 45%)",
        display: "flex",
        alignItems: "center",
        py: { xs: 8, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        {/* HERO */}
        <Box
          sx={{
            textAlign: "center",
            mb: 10,
          }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              color: "white",
              mb: 2,
              fontSize: { xs: "2.2rem", md: "3.2rem" },
            }}
          >
            AI Resume Analyzer
          </Typography>

          <Typography
            sx={{
              color: "#94a3b8",
              maxWidth: 700,
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}
          >
            A smart resume analysis platform combining ATS evaluation and
            AI-driven career insights to help you land your next role faster.
          </Typography>

          {/* CTA BUTTONS */}
          <Box
            sx={{
              mt: 5,
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              size="large"
              onClick={() => navigate("/setup")}
              sx={{
                px: 4,
                py: 1.4,
                fontWeight: "bold",
                background:
                  "linear-gradient(90deg, #22c55e, #16a34a)",
                color: "#020617",
                borderRadius: "30px",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(34,197,94,0.3)",
                },
                transition: "0.3s",
              }}
            >
              Get Started
            </Button>

          </Box>
        </Box>

        {/* FEATURES */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {[
            {
              title: "ATS Compatibility",
              color: "#22c55e",
              desc:
                "Analyze how well your resume passes real ATS filters using keywords, skills, and structure.",
            },
            {
              title: "AI Career Insights",
              color: "#38bdf8",
              desc:
                "Understand your ATS score, role fit, and improvement areas with AI explanations.",
            },
            {
              title: "Learning Roadmap",
              color: "#facc15",
              desc:
                "Receive a personalized roadmap and resume-worthy project ideas.",
            },
          ].map((item, i) => (
            <Paper
              key={i}
              sx={{
                p: 4,
                borderRadius: "18px",
                backgroundColor: "#020617",
                border: "1px solid #1f2937",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                },
              }}
            >
              <Typography
                fontWeight="bold"
                sx={{ color: item.color, mb: 1 }}
              >
                {item.title}
              </Typography>

              <Typography sx={{ color: "#94a3b8" }}>
                {item.desc}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
