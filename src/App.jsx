// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Questionnaire from "./pages/Questionnaire";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import { QuestionnaireProvider } from "./context/QuestionnaireContext";

function App() {
  return (
    <AuthProvider>
      <QuestionnaireProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
        {console.log('App rendering')}
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
          </Routes>
        </div>
      </Router>
      </QuestionnaireProvider>
    </AuthProvider>
  );
}

export default App;