import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fmt, formatDateTime } from "../utils";

export default function Track() {
  const nav = useNavigate();
  const [code, setCode] = useState("");
  let recent = [];
  try {
    recent = JSON.parse(localStorage.getItem("ksb_recent") || "[]");
  } catch {
    recent = [];
  }

  function go(e) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (c) nav(`/order/${encodeURIComponent(c)}`);
  }

  return (
    <div className="page">
      <div className="container narrow">
        <h1 className="page-title">Track your order</h1>
        <form onSubmit={go} className="track-form">
          <label className="field">
            <span>Order number</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="KSB-XXXXXX" autoCapitalize="characters" />
          </label>
          <button className="btn btn-red" type="submit">Track order</button>
        </form>

        {recent.length > 0 && (
          <section className="card-box">
            <h2 className="box-title">Your recent orders</h2>
            <ul className="mini-list">
              {recent.map((r) => (
                <li key={r.id}>
                  <Link to={`/order/${r.id}`}>{r.id}</Link>
                  <span>{fmt(r.total)} <small>{formatDateTime(r.at)}</small></span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
