import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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
          const data = await res.json();

          // Token expired → redirect to login
          if (res.status === 401 && data.message === "Token expired") {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }

          throw new Error(data.message || "Request failed");
        }

        console.log("Protected data:", data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [navigate]);

  return <div>Protected content</div>;
}

export default ProtectedRoute;
