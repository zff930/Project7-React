import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import { API_BASE_URL } from "../config";
import "../styles/LogInPage.css"; // make sure to create this

function LogIn() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        if (response.status === 403 && data.error === "This account has been deleted.") {
          alert("Your account has been deleted and cannot log in.");
          return;
        }
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
    <>
      <Banner />
      <div className="log-in-page">
        <form onSubmit={handleSubmit} className="log-in-form">
          <h2>Log In</h2>
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
    </>
  );
}

export default LogIn;
