import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const navClass = ({ isActive }) => {
    return isActive
      ? "msp-nav-link msp-nav-link-active"
      : "msp-nav-link";
  };

  return (
    <header className="msp-navbar">
      <div className="msp-navbar-container">
        <Link to="/" className="msp-logo">
          <span>MSP</span>
          <i></i>
        </Link>

        <nav className="msp-navbar-links">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>

          <NavLink to="/services" className={navClass}>
            Services
          </NavLink>

          <NavLink to="/providers" className={navClass}>
            Providers
          </NavLink>

          <a href="/#about" className="msp-nav-link">
            About
          </a>
        </nav>

        <div className="msp-navbar-actions">
          <NavLink to="/login" className="msp-login-link">
            Log in
          </NavLink>

          <NavLink
            to="/register"
            className="msp-register-link"
          >
            Get started
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;