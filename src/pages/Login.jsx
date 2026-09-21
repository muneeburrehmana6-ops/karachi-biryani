import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { DEMO_EMAIL, DEMO_PASSWORD, useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, isAdmin, login, resetPassword, demo } = useAuth();
  const loc = useLocation();
  const [email, setEmail] = useState((loc.state && loc.state.email) || (demo ? DEMO_EMAIL : ""));
  const [password, setPassword] = useState(demo ? DEMO_PASSWORD : "");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  // Login ho chuka hai: admin ko staff panel, baaqi ko home page
  if (user) {
    if (isAdmin === null) {
      return <div className="page"><p className="empty">Checking your account...</p></div>;
    }
    return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      const bad = ["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found", "auth/invalid-email"];
      setError(
        bad.includes(err.code)
          ? "Incorrect email or password. If you do not have an account yet, please sign up first."
          : err.code === "auth/too-many-requests"
          ? "Too many attempts. Please wait a few minutes and try again."
          : "Could not log in. Please try again."
      );
      setBusy(false);
    }
  }

  async function forgot() {
    setError("");
    setInfo("");
    if (!email.trim()) {
      setError("Type your email above first, then click 'Forgot password?'.");
      return;
    }
    try {
      await resetPassword(email.trim());
      setInfo("If this email has an account, a password reset link has been sent to it.");
    } catch (err) {
      setError(err.code === "demo/unsupported" ? "Password reset works once Firebase is connected." : "Could not send the reset email. Please try again.");
    }
  }

  return (
    <div className="page">
      <form className="card-box auth-card" onSubmit={submit}>
        <h1 className="box-title">Log in</h1>

        {loc.state && loc.state.registered && (
          <p className="pay-info">Your account is ready. Please log in with your email and password.</p>
        )}
        {demo && (
          <p className="pay-info">
            <strong>Demo mode</strong><br />
            Admin: {DEMO_EMAIL} / {DEMO_PASSWORD}<br />
            <span className="note">Changes here are saved only in this browser.</span>
          </p>
        )}

        <label className="field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>

        {error && <p className="alert">{error}</p>}
        {info && <p className="pay-info">{info}</p>}

        <button className="btn btn-red block" disabled={busy}>{busy ? "Logging in..." : "Log in"}</button>
        <p className="auth-alt">
          <button type="button" className="link-btn" onClick={forgot}>Forgot password?</button>
        </p>
        <p className="auth-alt">New here? <Link to="/signup">Create an account</Link></p>
      </form>
    </div>
  );
}
