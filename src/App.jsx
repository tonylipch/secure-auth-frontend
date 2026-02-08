import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";

const isAuthed = () => Boolean(localStorage.getItem("accessToken"));

const ProtectedRoute = ({ children }) => {
  if (!isAuthed()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="app-shell min-h-screen">
      <Routes>
        <Route path="/" element={<AuthPage theme={theme} setTheme={setTheme} />} />
        <Route path="/oauth2/callback" element={<OAuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard theme={theme} setTheme={setTheme} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
