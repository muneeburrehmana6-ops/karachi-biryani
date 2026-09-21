import { useEffect, useMemo, useRef, useState } from "react";
import { listen, patch } from "../../store";
import { STATUS_FLOW } from "../../config";
import { beep, fmt, paymentLabel, timeAgo, toDate, waLink } from "../../utils";

const NEXT = {
  received: { to: "preparing", label: "Start preparing" },
  preparing: { to: "out_for_delivery", label: "Out for delivery" },
  out_for_delivery: { to: "delivered", label: "Mark delivered" },
};

const FILTERS = [
  ["active", "Active"],
  ["delivered", "Delivered"],
  ["cancelled", "Cancelled"],
  ["all", "All"],
];

const statusLabel = (k) => (k === "cancelled" ? "Cancelled" : STATUS_FLOW.find((s) => s.key === k)?.short || k);

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("active");
  const [fresh, setFresh] = useState(0);
  const seen = useRef(null);
  const [, tick] = useState(0);

  useEffect(() => {
    const unsub = listen(
      "orders",
      (list) => {
        if (seen.current) {
          const added = list.filter((o) => !seen.current.has(o.id)).length;
          if (added) {
            beep();
            setFresh((n) => n + added);
          }
        }
        seen.current = new Set(list.map((o) => o.id));
        setOrders(list);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Could not load orders. Check the Firestore rules and the admin email (see README.md).");
        setLoading(false);
      },
      { orderBy: "createdAt", desc: true, limit: 150 }
    );
    const t = setInterval(() => tick((n) => n + 1), 60000); // "kitni der pehle" refresh
    return () => {
      unsub();
      clearInterval(t);
    };
  }, []);

  const today = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const list = orders.filter((o) => (toDate(o.createdAt) || new Date()) >= start && o.status !== "cancelled");
    return { count: list.length, sales: list.reduce((n, o) => n + (o.total || 0), 0) };
  }, [orders]);

  const shown = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "active") return ["received", "preparing", "out_for_delivery"].includes(o.status);
    return o.status === filter;
  });

  const setStatus = (o, status) => patch("orders", o.id, { status }).catch((e) => alert("Update failed: " + e.message));
  const togglePaid = (o) =>
    patch("orders", o.id, { paymentStatus: o.paymentStatus === "paid" ? "pending" : "paid" }).catch((e) =>
      alert("Update failed: " + e.message)
    );

  return (
    <div>
      <div className="admin-head">
        <h1>Orders</h1>
        <div className="stats">
          <div><span>Today's orders</span><strong>{today.count}</strong></div>
          <div><span>Today's sales</span><strong>{fmt(today.sales)}</strong></div>
        </div>
      </div>

      {fresh > 0 && (
        <button type="button" className="new-banner" onClick={() => setFresh(0)}>
          {fresh} new order{fresh > 1 ? "s" : ""} received. Tap to dismiss.
        </button>
      )}

      <div className="tabs" role="tablist">
        {FILTERS.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={filter === k} className={"tab" + (filter === k ? " on" : "")} onClick={() => setFilter(k)}>
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="empty">Loading orders...</p>}
      {error && <p className="alert">{error}</p>}
      {!loading && !error && shown.length === 0 && <p className="empty">No orders in this section yet.</p>}

      <div className="order-list">
        {shown.map((o) => {
          const next = NEXT[o.status];
          const tel = (o.customer?.phone || "").replace(/[^\d+]/g, "");
          const waPhone = tel.startsWith("0") ? "92" + tel.slice(1) : tel;
          return (
            <article key={o.id} className={"order-card st-" + o.status}>
              <header>
                <div>
                  <strong className="order-no">{o.orderNo}</strong>
                  <span className="note"> {timeAgo(o.createdAt)}</span>
                </div>
                <span className={"pill st-" + o.status}>{statusLabel(o.status)}</span>
              </header>

              <div className="order-grid">
                <div>
                  <p className="who"><strong>{o.customer?.name}</strong></p>
                  <p>
                    <a href={`tel:${tel}`}>{o.customer?.phone}</a>{" "}
                    <a className="mini-link" href={`https://wa.me/${waPhone}`} target="_blank" rel="noreferrer">WhatsApp</a>
                  </p>
                  <p>{o.customer?.address}</p>
                  {o.customer?.notes && <p className="note-box">Note: {o.customer.notes}</p>}
                </div>
                <div>
                  <ul className="mini-list">
                    {(o.items || []).map((l, i) => (
                      <li key={i}>
                        <span>{l.qty} x <bdi>{l.name}</bdi> <small>(<bdi>{l.option}</bdi>)</small></span>
                        <span>{fmt(l.qty * l.price)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="order-total">
                    <span>Delivery {o.deliveryFee ? fmt(o.deliveryFee) : "free"}</span>
                    <strong>Total {fmt(o.total)}</strong>
                  </p>
                  <p>
                    {paymentLabel(o.paymentMethod)}{" "}
                    <span className={"pill " + (o.paymentStatus === "paid" ? "paid" : "unpaid")}>
                      {o.paymentStatus === "paid" ? "Paid" : "Payment pending"}
                    </span>
                  </p>
                </div>
              </div>

              <footer>
                {next && (
                  <button className="btn btn-green btn-sm" onClick={() => setStatus(o, next.to)}>{next.label}</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => togglePaid(o)}>
                  {o.paymentStatus === "paid" ? "Mark unpaid" : "Mark paid"}
                </button>
                {["received", "preparing", "out_for_delivery"].includes(o.status) && (
                  <button
                    className="btn btn-ghost btn-sm danger"
                    onClick={() => window.confirm(`Cancel order ${o.orderNo}?`) && setStatus(o, "cancelled")}
                  >
                    Cancel order
                  </button>
                )}
                {o.status === "cancelled" && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setStatus(o, "received")}>Restore</button>
                )}
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}
