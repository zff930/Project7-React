import React from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
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
    localStorage.clear();
    navigate("/login");
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This will log you out."
    );
    if (confirmDelete) {
      localStorage.clear(); // remove all user info
      navigate("/login");
    }
  };

  return (
    <>
      <Banner />
      <div className="profile-page">
        <h2>Your Profile</h2>
        <div className="profile-card">
          <p>
            <strong>User ID:</strong> {userId}
          </p>
          {firstName && (
            <p>
              <strong>First Name:</strong> {firstName}
            </p>
          )}
          {lastName && (
            <p>
              <strong>Last Name:</strong> {lastName}
            </p>
          )}
          {email && (
            <p>
              <strong>Email:</strong> {email}
            </p>
          )}
        </div>

        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-btn">
            Log Out
          </button>
          <button onClick={handleDeleteAccount} className="delete-btn">
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;
