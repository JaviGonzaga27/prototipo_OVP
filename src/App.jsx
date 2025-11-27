// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import InactivityHandler from "./components/common/InactivityHandler";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Questionnaire from "./pages/Questionnaire";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import TestHistory from "./pages/TestHistory";
import TestResultDetail from "./pages/TestResultDetail";
import Settings from "./pages/Settings";
import { QuestionnaireProvider } from "./context/QuestionnaireContext";

function App() {
  return (
    <AuthProvider>
      <QuestionnaireProvider>
      <Router>
        <InactivityHandler>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questionnaire"
              element={
                <ProtectedRoute>
                  <Questionnaire />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-history"
              element={
                <ProtectedRoute>
                  <TestHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-result/:resultId"
              element={
                <ProtectedRoute>
                  <TestResultDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
          </div>
        </InactivityHandler>
      </Router>
      </QuestionnaireProvider>
    </AuthProvider>
  );
}

export default App;