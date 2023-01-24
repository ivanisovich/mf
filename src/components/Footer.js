import React from "react";
import "../styles/Footer.css";
import tmdbLogoPowered from "../assets/images/tmdb-logo-powered.png";

function Footer(props) {
  return (
    <footer className="Footer">
      <div className="Footer__content">
        <img src={tmdbLogoPowered} alt="tmdb logo" />
      </div>
    </footer>
  );
}

export default Footer;
