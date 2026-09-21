import { useEffect, useState } from "react";
import { listenDoc } from "../store";

const OFF = { enabled: false, text: "" };

// Website ki sab se upar wali patti (admin ke Offers page se badalti hai)
export function useAnnouncement() {
  const [a, setA] = useState(null);

  useEffect(
    () =>
      listenDoc(
        "settings",
        "site",
        (d) => setA((d && d.announcement) || OFF),
        () => setA(OFF)
      ),
    []
  );

  return a;
}
