import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { RESTAURANT } from "../config";
import { fmt } from "../utils";

export default function Cart() {
  const { lines, subtotal, deliveryFee, total, setQty, remove } = useCart();
  const nav = useNavigate();
  const belowMin = subtotal < RESTAURANT.minOrder;

  if (lines.length === 0) {
    return (
      <div className="page">
        <div className="container narrow center">
          <h1 className="page-title">Your cart is empty</h1>
          <p className="note">Pick your favourite biryani or pulao from the menu.</p>
          <Link to="/menu" className="btn btn-red btn-lg">View menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container cart-layout">
        <div>
          <h1 className="page-title">Cart</h1>
          <ul className="cart-list">
            {lines.map((l) => (
              <li key={l.key} className="cart-line">
                <div className="cart-info">
                  <strong dir="auto">{l.name}</strong>
                  <span className="note"><bdi>{l.option}</bdi>, {fmt(l.price)}</span>
                </div>
                <div className="qty" role="group" aria-label={`${l.name} quantity`}>
                  <button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease quantity">−</button>
                  <span aria-live="polite">{l.qty}</span>
                  <button type="button" onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase quantity">+</button>
                </div>
                <strong className="line-total">{fmt(l.price * l.qty)}</strong>
                <button type="button" className="link-btn" onClick={() => remove(l.key)}>Remove</button>
              </li>
            ))}
          </ul>
          <Link to="/menu" className="link-btn">Add more items</Link>
        </div>

        <aside className="summary">
          <h2>Order summary</h2>
          <dl>
            <div><dt>Subtotal</dt><dd>{fmt(subtotal)}</dd></div>
            <div><dt>Delivery</dt><dd>{deliveryFee ? fmt(deliveryFee) : "Free"}</dd></div>
            <div className="sum-total"><dt>Total</dt><dd>{fmt(total)}</dd></div>
          </dl>
          {!deliveryFee && <p className="note">Delivery is free.</p>}
          {deliveryFee > 0 && (
            <p className="note">Add {fmt(RESTAURANT.freeDeliveryAbove - subtotal)} more for free delivery.</p>
          )}
          {belowMin && (
            <p className="alert">The minimum order is {fmt(RESTAURANT.minOrder)}. Add {fmt(RESTAURANT.minOrder - subtotal)} more.</p>
          )}
          <button type="button" className="btn btn-red btn-lg block" disabled={belowMin} onClick={() => nav("/checkout")}>
            Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
