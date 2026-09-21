import { useEffect, useMemo, useState } from "react";
import { listen } from "../store";

// "Aaj ki offers": admin panel ke Offers page se live aati hain.
// all=true: admin ke liye (band wali offers bhi)
export function useOffers({ all = false } = {}) {
  const [raw, setRaw] = useState(null);

  useEffect(
    () =>
      listen("promos", setRaw, (err) => {
        console.error("Could not load offers:", err);
        setRaw([]);
      }),
    []
  );

  const offers = useMemo(() => {
    const list = (raw || []).filter((o) => all || o.active !== false);
    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || String(a.title).localeCompare(String(b.title)));
  }, [raw, all]);

  return { offers, loading: raw === null };
}
