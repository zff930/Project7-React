import { Link, useNavigate } from "react-router-dom";
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
    navigate("/login"); // redirect to login page
  };

  return (
    <div>
      <div className="banner">
        <div className="banner-row">
          <div className="logo-title">
            <img src={logo} alt="React Project" className="logo" />
            <h1 className="title">{title}</h1>
          </div>

          {isLoggedIn ? (
            <>
              <Link to="/profile">
                <button>Profile</button>
              </Link>
              <button onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/signup">
                <button>Sign Up</button>
              </Link>
              <Link to="/login">
                <button>Log In</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Banner;
