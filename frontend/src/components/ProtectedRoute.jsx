import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("/api/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // Token is invalid or expired
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setLoading(false); // Auth OK
        }
      } catch (err) {
        console.error("Auth check failed", err);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return children;
}

export default ProtectedRoute;
