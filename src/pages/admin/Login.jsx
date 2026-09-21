import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { DEMO_EMAIL, DEMO_PASSWORD, useAuth } from "../../context/AuthContext";

export default function Login() {
  const { user, login, demo } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState(demo ? DEMO_EMAIL : "");
  const [password, setPassword] = useState(demo ? DEMO_PASSWORD : "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      nav("/admin", { replace: true });
    } catch (err) {
      const bad = ["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found", "auth/invalid-email"];
      setError(bad.includes(err.code) ? "Incorrect email or password." : "Could not log in. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="admin-center">
      <form className="card-box login-box" onSubmit={submit}>
        <h1 className="box-title">Staff login</h1>

        {demo && (
          <p className="pay-info">
            <strong>Demo mode</strong><br />
            Email: {DEMO_EMAIL}<br />
            Password: {DEMO_PASSWORD}<br />
            <span className="note">Changes made here are saved only in this browser.</span>
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
        <button className="btn btn-red block" disabled={busy}>{busy ? "Logging in..." : "Log in"}</button>
        <Link to="/" className="link-btn">Back to website</Link>
      </form>
    </div>
  );
}
