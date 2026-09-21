import { RESTAURANT } from "./config";

export const fmt = (n) => "Rs. " + Number(n || 0).toLocaleString("en-PK");

export function getDeliveryFee(subtotal) {
  if (subtotal <= 0) return 0;
  return subtotal >= RESTAURANT.freeDeliveryAbove ? 0 : RESTAURANT.deliveryFee;
}

export function normalizePhone(p) {
  let d = String(p || "").replace(/[^\d+]/g, "");
  if (d.startsWith("+92")) d = "0" + d.slice(3);
  else if (d.startsWith("92") && d.length === 12) d = "0" + d.slice(2);
  return d;
}

export const isValidPkMobile = (p) => /^03\d{9}$/.test(normalizePhone(p));

export function makeOrderNo() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const arr = new Uint32Array(6);
  crypto.getRandomValues(arr);
  let s = "";
  for (const n of arr) s += chars[n % chars.length];
  return "KSB-" + s;
}

export const waLink = (text) =>
  `https://wa.me/${RESTAURANT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export function orderText(o) {
  const lines = [
    `*New order ${o.orderNo || ""}*`.trim(),
    "",
    ...o.items.map((i) => `${i.qty} x ${i.name} (${i.option}) = ${fmt(i.price * i.qty)}`),
    "",
    `Subtotal: ${fmt(o.subtotal)}`,
    `Delivery: ${o.deliveryFee ? fmt(o.deliveryFee) : "Free"}`,
    `*Total: ${fmt(o.total)}*`,
    `Payment: ${paymentLabel(o.paymentMethod)}`,
    "",
    `Name: ${o.customer.name}`,
    `Phone: ${o.customer.phone}`,
    `Address: ${o.customer.address}`,
  ];
  if (o.customer.notes) lines.push(`Note: ${o.customer.notes}`);
  return lines.join("\n");
}

export function paymentLabel(m) {
  return (
    { cod: "Cash on delivery", easypaisa: "Easypaisa", jazzcash: "JazzCash", bank: "Bank transfer" }[m] || m
  );
}

export function toDate(ts) {
  if (!ts) return null;
  return typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
}

export function timeAgo(ts) {
  const d = toDate(ts);
  if (!d) return "just now";
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hr ago`;
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
}

export function formatDateTime(ts) {
  const d = toDate(ts);
  if (!d) return "";
  return d.toLocaleString("en-PK", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

// Naya order aane par admin ko halki si awaaz
export function beep() {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    const ctx = new C();
    [0, 0.25].forEach((t, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = i ? 988 : 784;
      const at = ctx.currentTime + t;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.3, at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
      o.start(at);
      o.stop(at + 0.25);
    });
  } catch {
    /* sound na chale to koi masla nahi */
  }
}

export function sortMenu(items, categories) {
  return [...items].sort((a, b) => {
    const ca = categories.indexOf(a.category);
    const cb = categories.indexOf(b.category);
    if (ca !== cb) return (ca === -1 ? 99 : ca) - (cb === -1 ? 99 : cb);
    if ((a.sortOrder || 0) !== (b.sortOrder || 0)) return (a.sortOrder || 0) - (b.sortOrder || 0);
    return String(a.name).localeCompare(String(b.name));
  });
}

export const minPrice = (item) =>
  item.options && item.options.length ? Math.min(...item.options.map((o) => o.price)) : 0;

// Cloudinary ki photo/video ko chhota aur tez karne ke liye (baaqi links ko haath nahi lagata)
export function cld(url, transform) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
}

export const mapsSearchUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const mapsEmbedUrl = (query) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
