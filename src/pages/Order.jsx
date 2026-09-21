import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listenDoc } from "../store";
import { RESTAURANT, STATUS_FLOW } from "../config";
import { fmt, formatDateTime, orderText, paymentLabel, waLink } from "../utils";

export default function Order() {
  const { id } = useParams();
  const [order, setOrder] = useState(undefined); // undefined = loading, null = nahi mila
  const [error, setError] = useState("");

  useEffect(() => {
    setOrder(undefined);
    return listenDoc(
      "orders",
      id.toUpperCase(),
      (o) => setOrder(o),
      (err) => {
        console.error(err);
        setError("Could not load the order.");
        setOrder(null);
      }
    );
  }, [id]);

  if (order === undefined) {
    return <div className="page"><div className="container narrow center"><p className="empty">Looking up your order...</p></div></div>;
  }

  if (order === null) {
    return (
      <div className="page">
        <div className="container narrow center">
          <h1 className="page-title">Order not found</h1>
          <p className="note">{error || `We could not find an order numbered "${id}". Please check the number and try again.`}</p>
          <Link to="/track" className="btn btn-red">Search again</Link>
        </div>
      </div>
    );
  }

  const cancelled = order.status === "cancelled";
  const stepIdx = STATUS_FLOW.findIndex((s) => s.key === order.status);
  const needsPayment = order.paymentMethod !== "cod" && order.paymentStatus !== "paid" && !cancelled;
  const payInfo = RESTAURANT.payments[order.paymentMethod];

  return (
    <div className="page">
      <div className="container narrow">
        <p className="note">Thank you, {order.customer.name}!</p>
        <h1 className="page-title">Order {order.orderNo}</h1>
        <p className="note">{formatDateTime(order.createdAt)}. Save this number to track your order.</p>

        {cancelled ? (
          <p className="alert">This order has been cancelled. If something is wrong, please call {RESTAURANT.phone}.</p>
        ) : (
          <ol className="stepper" aria-label="Order status">
            {STATUS_FLOW.map((s, i) => (
              <li key={s.key} className={i < stepIdx ? "done" : i === stepIdx ? "current" : ""} aria-current={i === stepIdx ? "step" : undefined}>
                <span className="dot" aria-hidden="true">{i < stepIdx ? "✓" : i + 1}</span>
                <span>{s.short}</span>
              </li>
            ))}
          </ol>
        )}

        {!cancelled && order.status === "received" && (
          <p className="note center">We are reviewing your order and will confirm it shortly.</p>
        )}

        {needsPayment && payInfo && (
          <div className="pay-info">
            <p><strong>Payment pending: {paymentLabel(order.paymentMethod)}</strong></p>
            {payInfo.bank && <p>Bank: {payInfo.bank}</p>}
            <p>Account / number: {payInfo.number}</p>
            <p>Account title: {payInfo.name}</p>
            <a
              className="btn btn-green btn-sm"
              target="_blank"
              rel="noreferrer"
              href={waLink(`Hello, I have paid for order ${order.orderNo}. Sending the screenshot now.`)}
            >
              Send screenshot on WhatsApp
            </a>
          </div>
        )}

        <section className="card-box">
          <h2 className="box-title">Items</h2>
          <ul className="mini-list">
            {order.items.map((l, i) => (
              <li key={i}>
                <span>{l.qty} x <bdi>{l.name}</bdi> <small>(<bdi>{l.option}</bdi>)</small></span>
                <span>{fmt(l.qty * l.price)}</span>
              </li>
            ))}
          </ul>
          <dl className="totals">
            <div><dt>Subtotal</dt><dd>{fmt(order.subtotal)}</dd></div>
            <div><dt>Delivery</dt><dd>{order.deliveryFee ? fmt(order.deliveryFee) : "Free"}</dd></div>
            <div className="sum-total"><dt>Total</dt><dd>{fmt(order.total)}</dd></div>
            <div><dt>Payment</dt><dd>{paymentLabel(order.paymentMethod)}{order.paymentStatus === "paid" ? " (paid)" : ""}</dd></div>
          </dl>
        </section>

        <section className="card-box">
          <h2 className="box-title">Delivery</h2>
          <p>{order.customer.name}, {order.customer.phone}</p>
          <p>{order.customer.address}</p>
          {order.customer.notes && <p className="note">Note: {order.customer.notes}</p>}
        </section>

        <div className="actions">
          <a className="btn btn-green" target="_blank" rel="noreferrer" href={waLink(orderText(order))}>
            Send order details on WhatsApp
          </a>
          <Link to="/menu" className="btn btn-ink">Order more</Link>
        </div>
      </div>
    </div>
  );
}
