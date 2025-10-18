import "../assets/icon.png";
import logo from "../styles/Banner.css";

function Banner() {
  const title = "React Project";

  return (
    <div>
      <div className="rp-banner">
        <div className="rp-banner-row">
          <img src={logo} alt="React Project" className="rp-logo" />
          <h1 className="rp-title">{title}</h1>
        </div>
      </div>
    </div>
  );
}

export default Banner;
