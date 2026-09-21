import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { user, signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Please enter your name.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirm) return setError("The two passwords do not match.");

    setBusy(true);
    try {
      await signup(form.name.trim(), form.email.trim(), form.password);
      nav("/login", { replace: true, state: { registered: true, email: form.email.trim() } });
    } catch (err) {
      const map = {
        "auth/email-already-in-use": "This email is already registered. Please log in instead.",
        "auth/weak-password": "Password is too weak. Use at least 8 characters.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/operation-not-allowed": "Sign up is not enabled yet. Turn on Email/Password in Firebase Authentication.",
      };
      setError(map[err.code] || "Could not create the account. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <form className="card-box auth-card" onSubmit={submit} noValidate>
        <h1 className="box-title">Create an account</h1>
        <p className="note">Sign up once, then log in with your email and password.</p>

        <label className="field">
          <span>Full name</span>
          <input value={form.name} onChange={set("name")} autoComplete="name" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" required />
        </label>
        <label className="field">
          <span>Password (at least 8 characters)</span>
          <input type="password" value={form.password} onChange={set("password")} autoComplete="new-password" required />
        </label>
        <label className="field">
          <span>Confirm password</span>
          <input type="password" value={form.confirm} onChange={set("confirm")} autoComplete="new-password" required />
        </label>

        {error && <p className="alert">{error}</p>}
        <button className="btn btn-red block" disabled={busy}>{busy ? "Creating account..." : "Sign up"}</button>
        <p className="auth-alt">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
