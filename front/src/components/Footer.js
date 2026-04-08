import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Footer.css";
import { UserContext } from "../context/UserContext"; // ← import UserContext

const Footer = () => {
  const { user } = useContext(UserContext); // ← accéder à l'utilisateur connecté
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault(); // prevent page reload
    if (email.trim() === "") return; // do nothing if empty
    // Navigate to /registre and pass email in state
    navigate("/registre", { state: { email } });
  };

  return (
    <footer className="footer-modern text-white mt-5 pt-5">
      <div className="container">
        <div className="row gy-4 align-items-start">

          {/* Brand & Description */}
          <div className="col-md-4">
            <h3 className="footer-logo">MyStore</h3>
            <p className="footer-desc">
              Discover unique products and enjoy a seamless shopping experience
              — fast delivery, easy checkout, and trusted service.
            </p>
            <div className="social-icons mt-3">
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-twitter"></i></a>
              <a href="#"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-md-4">
            <h5 className="footer-title">Explore</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter - afficher seulement si user n'est pas connecté */}
          {!user && (
            <div className="col-md-4">
              <h5 className="footer-title">Stay Updated</h5>
              <p className="small">
                Subscribe to get the latest deals, new arrivals, and updates.
              </p>
              <form className="footer-form d-flex" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="form-control me-2"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn btn-light px-3" type="submit">→</button>
              </form>
            </div>
          )}

        </div>

        <hr className="footer-divider" />
        <div className="text-center small text-light">
          © {new Date().getFullYear()} <span className="fw-bold">Nassim-Store</span> — All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
