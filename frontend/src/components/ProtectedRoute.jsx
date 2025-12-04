import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  // Mounting starts when initialize useState, before first render
  // First render starts when loading = true
  const [loading, setLoading] = useState(true);

  // The effect runs once after the first render, because navigate is stable.
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/protected`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          // Triggers re-render by loading = false -> shows protected content
          setLoading(false); // Auth OK
        }
      } catch (err) {
        console.error("Auth check failed", err);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // Conditional rendering
  // While the async request is in progress, React continues rendering the component.
  if (loading) return <div>Loading...</div>;

  return children;
}

export default ProtectedRoute;
