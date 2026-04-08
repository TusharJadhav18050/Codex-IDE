import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">{"</>"}</span>
          <span className="brand-name">CodeX <span className="brand-accent">IDE</span></span>
        </Link>

        <div className="navbar-links">
          <Link to="/editor" className={`nav-link ${location.pathname === "/editor" ? "active" : ""}`}>
            Editor
          </Link>
          {user && (
            <Link to="/snippets" className={`nav-link ${location.pathname === "/snippets" ? "active" : ""}`}>
              My Snippets
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="nav-user">
                <span className="user-dot" />
                {user.username}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
