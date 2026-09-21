import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
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
        </nav>

        <div className="header-actions">
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
