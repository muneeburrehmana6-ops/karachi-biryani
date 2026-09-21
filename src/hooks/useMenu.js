import { useEffect, useMemo, useState } from "react";
import { listen } from "../store";
import { SAMPLE_MENU } from "../data/sampleMenu";
import { CATEGORIES } from "../config";
import { sortMenu } from "../utils";

// Menu live database se aata hai. Agar database khali ho to sample menu dikhta hai (isSample = true).
export function useMenu() {
  const [raw, setRaw] = useState(null);
  const [isSample, setIsSample] = useState(false);

  useEffect(
    () =>
      listen(
        "menu",
        (list) => {
          if (list.length === 0) {
            setRaw(SAMPLE_MENU);
            setIsSample(true);
          } else {
            setRaw(list);
            setIsSample(false);
          }
        },
        (err) => {
          console.error("Could not load the menu:", err);
          setRaw(SAMPLE_MENU);
          setIsSample(true);
        }
      ),
    []
  );

  const items = useMemo(() => (raw ? sortMenu(raw, CATEGORIES) : []), [raw]);
  return { items, loading: raw === null, isSample };
}
