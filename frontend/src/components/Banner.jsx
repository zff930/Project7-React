import { Link, useNavigate } from "react-router-dom"; // Link component to navigate between pages without reloading the page
import logo from "../assets/icon.png";
import "../styles/Banner.css";

function Banner() {
  const title = "GroupomaniaConnect";
  const navigate = useNavigate();

  // Check login status
  const isLoggedIn = !!localStorage.getItem("token");

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    navigate("/login"); // redirect to login page
  };

  return (
    <header className="banner">
      <div className="banner-container">
        <div className="logo-title">
          <img src={logo} alt="React Project" className="logo" />
          <h1 className="title">{title}</h1>
        </div>

        <nav className="nav-bar">
          <Link to="/" className="nav-item">
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="nav-item">
                Profile
              </Link>
              <Link onClick={handleLogout} className="nav-item">
                Log Out
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup" className="nav-item">
                Sign Up
              </Link>
              <Link to="/login" className="nav-item">
                Log In
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Banner;
