import logo from "../assets/icon.png";
import "../styles/Banner.css";
import { Link } from "react-router-dom";

function Banner() {
  const title = "GroupomaniaConnect";

  return (
    <div>
      <div className="banner">
        <div className="banner-row">
          <div className="logo-title">
            <img src={logo} alt="React Project" className="logo" />
            <h1 className="title">{title}</h1>
          </div>

          <div className="buttons">
            <Link to="/signup">
              <button>Sign Up</button>
            </Link>

            <Link to="/login">
              <button>Log In</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
