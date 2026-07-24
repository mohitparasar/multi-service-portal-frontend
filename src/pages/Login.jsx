import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(loginData);
    alert("Login form submitted");
  };

  return (
    <main className="auth-page">
      <section className="auth-information">
        <span>MULTI-SERVICE PROVIDER</span>

        <h1>
          Welcome back to <strong>MSP.</strong>
        </h1>

        <p>
          Log in to manage your bookings, find professionals and access your
          account.
        </p>

        <ul>
          <li>✓ Find verified providers</li>
          <li>✓ Manage your service bookings</li>
          <li>✓ Access secure account information</li>
        </ul>
      </section>

      <section className="auth-card">
        <span className="auth-label">WELCOME BACK</span>

        <h2>Login to your account</h2>

        <p className="auth-description">
          Enter your registered email and password.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email address</label>

            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="mohit@example.com"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="login-password">Password</label>
              <a href="#forgot">Forgot password?</a>
            </div>

            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="form-button">
            Log in
          </button>
        </form>

        <p className="switch-page">
          Don&apos;t have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;