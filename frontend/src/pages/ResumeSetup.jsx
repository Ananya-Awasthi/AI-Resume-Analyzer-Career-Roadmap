import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  MenuItem,
  Select,
  Button,
  Paper,
} from "@mui/material";

/**
 * 6 Job Categories with LIMITED but LOGICAL roles
 */
const ROLE_OPTIONS = {
  "Software Development": [
    "Frontend Developer",
    "Backend Developer",
  ],
  "Data Science": [
    "Data Scientist",
  ],
  "Machine Learning": [
    "Machine Learning Engineer",
  ],
  "Data Engineering": [
    "Data Engineer",
  ],
  "Cloud & DevOps": [
    "DevOps Engineer",
  ],
  "Cyber Security": [
    "Cyber Security Analyst",
  ],
};

export default function ResumeSetup() {
  const [jobCategory, setJobCategory] = useState("Software Development");
  const [role, setRole] = useState(
    ROLE_OPTIONS["Software Development"][0]
  );
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!jobCategory || !role || !resume) {
      alert("Please complete all fields");
      return;
    }

    const formData = new FormData();
    formData.append("job_category", jobCategory);
    formData.append("role", role);
    formData.append("resume", resume);

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/resume/setup",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("resume_filename", data.filename);
        navigate("/analyzer");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      setLoading(false);
      alert("Backend not reachable");
    }
  };
  window.__uploadedResume = resume;


  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          p: 4,
          borderRadius: "16px",
          backgroundColor: "#111827",
          color: "white",
        }}
      >
        {/* Title */}
        <Typography variant="h5" fontWeight="bold">
          Resume Setup
        </Typography>

        <Typography sx={{ mt: 1, color: "gray" }}>
          Select your target role and upload your resume for analysis
        </Typography>

        {/* Job Category */}
        <Box sx={{ mt: 4 }}>
          <Typography sx={{ mb: 1 }}>Job Category</Typography>
          <Select
            fullWidth
            value={jobCategory}
            onChange={(e) => {
              const selectedCategory = e.target.value;
              setJobCategory(selectedCategory);
              setRole(ROLE_OPTIONS[selectedCategory][0]);
            }}
            sx={{ backgroundColor: "#1f2937", color: "white" }}
          >
            {Object.keys(ROLE_OPTIONS).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Specific Role */}
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ mb: 1 }}>Specific Role</Typography>
          <Select
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ backgroundColor: "#1f2937", color: "white" }}
          >
            {ROLE_OPTIONS[jobCategory].map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Resume Upload */}
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ mb: 1 }}>Upload Resume</Typography>

          <Box
            sx={{
              border: "1px solid #1f2937",
              boxShadow: "0 0 0 1px rgba(6,182,212,0.15)",
              borderRadius: "12px",
              p: 3,
              textAlign: "center",
              backgroundColor: "#020617",
            }}
          >
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              style={{ color: "white" }}
            />

            <Typography sx={{ mt: 1, fontSize: "14px", color: "gray" }}>
              PDF or DOCX only
            </Typography>
          </Box>
        </Box>

        {/* Continue Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 4,
            py: 1.2,
            fontSize: "16px",
            borderRadius: "10px",
            backgroundColor: "#06b6d4",
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Continue"}
        </Button>
      </Paper>
    </Container>
  );
}

