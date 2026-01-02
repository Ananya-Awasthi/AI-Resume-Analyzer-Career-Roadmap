import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResumeSetup from "./pages/ResumeSetup";
import AnalyzerSelect from "./pages/AnalyzerSelect";
import StandardDashboard from "./pages/StandardDashboard";
import AIDashboard from "./pages/AIDashboard";
import LandingPage from "./pages/LandingPage";


function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          backgroundColor: "#0f172a",
          minHeight: "100vh",
        }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<ResumeSetup />} />
          <Route path="/analyzer" element={<AnalyzerSelect />} />
          <Route path="/analyze/standard" element={<StandardDashboard />} />
          <Route path="/analyze/ai" element={<AIDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
