import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="msp-navbar">
      <div className="msp-navbar-container">
        <Link to="/" className="msp-logo">
          <span>MSP</span>
          <i></i>
        </Link>

        <nav className="msp-navbar-links">
          <Link to="/">Home</Link>
          <a href="/#services">Services</a>
          <a href="/#providers">Providers</a>
          <a href="/#about">About</a>
        </nav>

        <div className="msp-navbar-actions">
          <NavLink to="/login" className="msp-login-link">
            Log in
          </NavLink>

          <NavLink to="/register" className="msp-register-link">
            Get started
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;