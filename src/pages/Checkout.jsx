import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { createOrder, isLocalMode } from "../store";
import { useCart } from "../context/CartContext";
import { RESTAURANT } from "../config";
import { fmt, isValidPkMobile, makeOrderNo, normalizePhone, orderText, waLink } from "../utils";

const PAY_OPTIONS = [
  { key: "cod", label: "Cash on delivery", hint: "Pay cash when your food arrives." },
  { key: "easypaisa", label: "Easypaisa", hint: "Transfer first, then send the screenshot on WhatsApp." },
  { key: "jazzcash", label: "JazzCash", hint: "Transfer first, then send the screenshot on WhatsApp." },
  { key: "bank", label: "Bank transfer", hint: "Transfer first, then send the screenshot on WhatsApp." },
];

function saved() {
  try {
    return JSON.parse(localStorage.getItem("ksb_customer")) || {};
  } catch {
    return {};
  }
}

export default function Checkout() {
  const { lines, subtotal, deliveryFee, total, clear } = useCart();
  const nav = useNavigate();
  const placed = useRef(false);

  const [form, setForm] = useState(() => ({ name: "", phone: "", address: "", notes: "", ...saved() }));
  const [pay, setPay] = useState("cod");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");

  if (lines.length === 0 && !placed.current) return <Navigate to="/cart" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (!isValidPkMobile(form.phone)) e.phone = "Enter a valid mobile number, like 03001234567.";
    if (form.address.trim().length < 10) e.address = "Enter your full address (house number, street, area).";
    if (subtotal < RESTAURANT.minOrder) e.order = `The minimum order is ${fmt(RESTAURANT.minOrder)}.`;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev) {
    ev.preventDefault();
    setFailure("");
    if (!validate()) return;

    const orderNo = makeOrderNo();
    const order = {
      orderNo,
      items: lines.map(({ id, name, option, price, qty }) => ({ id, name, option, price, qty })),
      subtotal,
      deliveryFee,
      total,
      customer: {
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
        address: form.address.trim(),
        notes: form.notes.trim(),
      },
      paymentMethod: pay,
      paymentStatus: "pending",
      status: "received",
    };

    setBusy(true);
    try {
      await createOrder(orderNo, order);
      try {
        localStorage.setItem("ksb_customer", JSON.stringify({ ...form }));
        const recent = JSON.parse(localStorage.getItem("ksb_recent") || "[]");
        recent.unshift({ id: orderNo, total, at: Date.now() });
        localStorage.setItem("ksb_recent", JSON.stringify(recent.slice(0, 10)));
      } catch {
        /* ignore */
      }
      placed.current = true;
      nav(`/order/${orderNo}`, { replace: true });
      clear();
    } catch (err) {
      console.error(err);
      setFailure("We could not place your order. Check your internet and try again, or send your order on WhatsApp.");
      setBusy(false);
    }
  }

  const payInfo = RESTAURANT.payments[pay];
  const fallbackOrder = {
    items: lines,
    subtotal,
    deliveryFee,
    total,
    paymentMethod: pay,
    customer: { name: form.name || "-", phone: form.phone || "-", address: form.address || "-", notes: form.notes },
  };

  return (
    <div className="page">
      <div className="container cart-layout">
        <form onSubmit={submit} noValidate>
          <h1 className="page-title">Checkout</h1>

          <fieldset className="card-box">
            <legend>Delivery details</legend>

            <label className="field">
              <span>Name</span>
              <input value={form.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} />
              {errors.name && <em className="err">{errors.name}</em>}
            </label>

            <label className="field">
              <span>Mobile number</span>
              <input
                value={form.phone}
                onChange={set("phone")}
                inputMode="tel"
                autoComplete="tel"
                placeholder="03XXXXXXXXX"
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <em className="err">{errors.phone}</em>}
            </label>

            <label className="field">
              <span>Delivery address</span>
              <textarea rows={3} value={form.address} onChange={set("address")} autoComplete="street-address" aria-invalid={!!errors.address} />
              {errors.address && <em className="err">{errors.address}</em>}
            </label>

            <label className="field">
              <span>Special instructions (optional)</span>
              <textarea rows={2} value={form.notes} onChange={set("notes")} placeholder="e.g. less spicy, extra raita, Pepsi please" />
            </label>
          </fieldset>

          <fieldset className="card-box">
            <legend>Payment</legend>
            <div className="pay-list">
              {PAY_OPTIONS.map((p) => (
                <label key={p.key} className={"pay" + (pay === p.key ? " on" : "")}>
                  <input type="radio" name="pay" value={p.key} checked={pay === p.key} onChange={() => setPay(p.key)} />
                  <span>
                    <strong>{p.label}</strong>
                    <small>{p.hint}</small>
                  </span>
                </label>
              ))}
            </div>
            {pay !== "cod" && payInfo && (
              <div className="pay-info">
                <p><strong>{payInfo.title}</strong></p>
                {payInfo.bank && <p>Bank: {payInfo.bank}</p>}
                <p>Account / number: {payInfo.number}</p>
                <p>Account title: {payInfo.name}</p>
                <p className="note">After placing your order, send the payment screenshot on WhatsApp.</p>
              </div>
            )}
          </fieldset>

          {errors.order && <p className="alert">{errors.order}</p>}
          {failure && (
            <p className="alert">
              {failure}{" "}
              <a href={waLink(orderText({ ...fallbackOrder, orderNo: "" }))} target="_blank" rel="noreferrer">
                Send on WhatsApp
              </a>
            </p>
          )}
          {isLocalMode && (
            <p className="alert">Demo mode: this order is saved only in this browser. You can see it in the staff panel (/admin) in the same browser.</p>
          )}

          <button type="submit" className="btn btn-red btn-lg block" disabled={busy}>
            {busy ? "Placing your order..." : `Place order, ${fmt(total)}`}
          </button>
        </form>

        <aside className="summary">
          <h2>Your order</h2>
          <ul className="mini-list">
            {lines.map((l) => (
              <li key={l.key}>
                <span>{l.qty} x <bdi>{l.name}</bdi> <small>(<bdi>{l.option}</bdi>)</small></span>
                <span>{fmt(l.qty * l.price)}</span>
              </li>
            ))}
          </ul>
          <dl>
            <div><dt>Subtotal</dt><dd>{fmt(subtotal)}</dd></div>
            <div><dt>Delivery</dt><dd>{deliveryFee ? fmt(deliveryFee) : "Free"}</dd></div>
            <div className="sum-total"><dt>Total</dt><dd>{fmt(total)}</dd></div>
          </dl>
          <Link to="/cart" className="link-btn">Edit cart</Link>
        </aside>
      </div>
    </div>
  );
}
