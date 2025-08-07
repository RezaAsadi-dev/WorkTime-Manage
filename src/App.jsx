import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import Detail from "./pages/deatail/Detail";
import Layout from "./layout";
import Login from "./pages/login";
import { useEffect } from "react";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const token = localStorage.getItem("platintoken");
    if (!token && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [navigate, location.pathname]);

  const token = localStorage.getItem("platintoken");
  
  if (!token) {
    return null; // Don't render anything while redirecting
  }

  return children;
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("platintoken");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="font-vazir">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/detail" 
          element={
            <ProtectedRoute>
              <Detail />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
