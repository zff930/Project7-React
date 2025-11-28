import React from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import "../styles/ProfilePage.css";

function Profile() {
  const navigate = useNavigate();

  // Get user info from localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

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
  const handleDeleteAccount = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // if your API uses auth
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete account");
    }

    // Clear localStorage and redirect
    localStorage.clear();
    alert("Your account has been deleted.");
    navigate("/login");
  } catch (error) {
    console.error("Error deleting account:", error);
    alert("Failed to delete account. Please try again.");
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
