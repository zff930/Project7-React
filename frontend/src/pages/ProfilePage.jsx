import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

function Profile() {
  const navigate = useNavigate();

  // Get user info from localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email"); // if you stored email on login/signup
  const firstName = localStorage.getItem("firstName"); // optional
  const lastName = localStorage.getItem("lastName"); // optional

  // Redirect to login if not logged in
  if (!token) {
    navigate("/login");
    return null;
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      <div className="profile-card">
        <p><strong>User ID:</strong> {userId}</p>
        {firstName && <p><strong>First Name:</strong> {firstName}</p>}
        {lastName && <p><strong>Last Name:</strong> {lastName}</p>}
        {email && <p><strong>Email:</strong> {email}</p>}
      </div>
      <button onClick={handleLogout} className="logout-btn">
        Log Out
      </button>
    </div>
  );
}

export default Profile;
