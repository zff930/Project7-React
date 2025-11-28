import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function LogIn() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // call hook

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        // Soft-deleted user
        if (response.status === 403 && data.error === "This account has been deleted.") {
          alert("Your account has been deleted and cannot log in.");
          return; // prevent login
        }

        // Generic login failure
        alert(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("firstName", data.firstName);
      localStorage.setItem("lastName", data.lastName);
      localStorage.setItem("email", data.email);

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="log-in-page">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit} className="log-in-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LogIn;
