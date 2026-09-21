import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import ItemCard from "../components/ItemCard";
import { CATEGORIES } from "../config";
import { fmt } from "../utils";
import { useCart } from "../context/CartContext";

export default function Menu() {
  const { items, loading } = useMenu();
  const { count, subtotal } = useCart();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter(
      (i) =>
        (cat === "All" || i.category === cat) &&
        (!term || i.name.toLowerCase().includes(term) || (i.description || "").toLowerCase().includes(term))
    );
  }, [items, cat, q]);

  const cats = useMemo(() => CATEGORIES.filter((c) => items.some((i) => i.category === c)), [items]);
  const groups = cat === "All" ? cats : [cat];

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Menu</h1>

        <div className="menu-tools">
          <div className="tabs" role="tablist" aria-label="Menu categories">
            {["All", ...cats].map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                className={"tab" + (cat === c ? " on" : "")}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="search">
            <span className="sr-only">Search menu</span>
            <input type="search" placeholder="Search the menu" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
        </div>

        {loading && <p className="empty">Loading menu...</p>}

        {!loading && visible.length === 0 && (
          <p className="empty">No items found. Try a different search.</p>
        )}

        {!loading &&
          groups.map((g) => {
            const list = visible.filter((i) => i.category === g);
            if (!list.length) return null;
            return (
              <section key={g} className="menu-group" aria-labelledby={"g-" + g}>
                <h2 id={"g-" + g} className="group-title">{g}</h2>
                <div className="item-grid">
                  {list.map((i) => (
                    <ItemCard key={i.id} item={i} />
                  ))}
                </div>
              </section>
            );
          })}
      </div>

      {count > 0 && (
        <Link to="/cart" className="cart-bar">
          <span>{count} item{count > 1 ? "s" : ""} in cart</span>
          <strong>{fmt(subtotal)}</strong>
          <span className="cart-bar-go">View cart</span>
        </Link>
      )}
    </div>
  );
}
