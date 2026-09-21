import { Link } from "react-router-dom";
import { RESTAURANT } from "../config";
import { waLink } from "../utils";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="truck-strip" aria-hidden="true" />
      <div className="container footer-grid">
        <div>
          <h3>{RESTAURANT.name}</h3>
          <p>{RESTAURANT.tagline}</p>
          <p className="muted-on-dark">Hot food, delivered to your door.</p>
        </div>
        <div>
          <h4>Order</h4>
          <ul>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/track">Track your order</Link></li>
            <li><Link to="/about">About us</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href={`tel:${RESTAURANT.phone.replace(/[^\d+]/g, "")}`}>{RESTAURANT.phone}</a></li>
            <li>WhatsApp: <a href={waLink()} target="_blank" rel="noreferrer">{RESTAURANT.whatsappDisplay}</a></li>
            <li>{RESTAURANT.address}</li>
            <li>{RESTAURANT.timings}</li>
            {RESTAURANT.facebook && <li><a href={RESTAURANT.facebook} target="_blank" rel="noreferrer">Facebook</a></li>}
            {RESTAURANT.instagram && <li><a href={RESTAURANT.instagram} target="_blank" rel="noreferrer">Instagram</a></li>}
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {RESTAURANT.name}</span>
        <Link to="/admin" className="admin-link">Staff login</Link>
      </div>
    </footer>
  );
}
