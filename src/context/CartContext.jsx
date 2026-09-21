import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getDeliveryFee } from "../utils";

const CartContext = createContext(null);
const KEY = "ksb_cart_v1";

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(load);
  const [notice, setNotice] = useState("");
  const timer = useRef();

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* private mode etc. */
    }
  }, [lines]);

  const add = useCallback((item, option, qty = 1) => {
    const key = `${item.id}::${option.label}`;
    setLines((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, 50) } : l));
      return [...prev, { key, id: item.id, name: item.name, option: option.label, price: option.price, qty }];
    });
    setNotice(`${item.name} (${option.label}) added to cart`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(""), 2200);
  }, []);

  const setQty = useCallback((key, qty) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 50) } : l))
    );
  }, []);

  const remove = useCallback((key) => setLines((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
    const deliveryFee = getDeliveryFee(subtotal);
    return { lines, count, subtotal, deliveryFee, total: subtotal + deliveryFee, add, setQty, remove, clear, notice };
  }, [lines, add, setQty, remove, clear, notice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
