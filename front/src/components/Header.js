import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/Header.css";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector(".navbar-modern");
      if (window.scrollY > 50) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="navbar-modern navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 text-gradient" to="/">Nassim-Store</Link>

        {/* Hamburger button pour mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto gap-lg-4">
            <li className="nav-item"><Link className={`nav-link ${isActive("/")}`} to="/">Home</Link></li>
            <li className="nav-item"><Link className={`nav-link ${isActive("/shop")}`} to="/shop">Shop</Link></li>
            <li className="nav-item"><Link className={`nav-link ${isActive("/about")}`} to="/about">About</Link></li>
            {user?.role !== "ADMIN" && (
              <li className="nav-item"><Link className={`nav-link ${isActive("/contact")}`} to="/contact">Contact</Link></li>
            )}
            {user?.role === "ADMIN" && (
              <li className="nav-item"><Link className={`nav-link ${isActive("/admin")}`} to="/admin">Admin Panel</Link></li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="user-name fw-bold me-3">{user.name}</span>
                <button onClick={handleLogout} className="btn-login">Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn-login">Login</Link>
            )}
            <Link to="/cart" className="btn-cart">Cart</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
