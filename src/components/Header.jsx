import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { RESTAURANT } from "../config";

const LINKS = [
  ["/", "Home"],
  ["/menu", "Menu"],
  ["/about", "About"],
  ["/track", "Track order"],
  ["/contact", "Contact"],
];

export default function Header() {
  const { count } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const firstName = user ? (user.displayName || user.email || "").split(/[\s@]/)[0] : "";
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark" aria-hidden="true">{RESTAURANT.initials}</span>
          <span className="brand-text">
            <strong>{RESTAURANT.name}</strong>
            <small>{RESTAURANT.tagline}</small>
          </span>
        </Link>

        <nav className={"nav" + (open ? " open" : "")} aria-label="Main">
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={close}>
              {label}
            </NavLink>
          ))}
          <div className="nav-auth">
            {user ? (
              <>
                <span className="hello">Hi, {firstName}</span>
                {isAdmin && <Link to="/admin" onClick={close}>Admin panel</Link>}
                <button type="button" className="link-btn" onClick={() => { close(); logout(); }}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={close}>Log in</Link>
                <Link to="/signup" onClick={close}>Sign up</Link>
              </>
            )}
          </div>
        </nav>

        <div className="header-actions">
          <div className="auth-links">
            {user ? (
              <>
                <span className="hello" title={user.email}>Hi, {firstName}</span>
                {isAdmin && <Link to="/admin" className="btn btn-yellow btn-sm">Admin panel</Link>}
                <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link to="/signup" className="btn btn-ink btn-sm">Sign up</Link>
              </>
            )}
          </div>
          <Link to="/cart" className="cart-btn" onClick={close} aria-label={`Cart, ${count} items`}>
            Cart <span className="badge">{count}</span>
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      <div className="truck-strip" aria-hidden="true" />
    </header>
  );
}
