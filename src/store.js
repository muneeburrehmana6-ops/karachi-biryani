// Data layer: website Firebase (Firestore) se data leti hai.
// Agar Firebase connect nahi (.env khali) to "demo mode" chalta hai: sab data isi browser ki localStorage mein rehta hai.
// Isi ki wajah se admin panel Firebase ke baghair bhi try kiya ja sakta hai.
import {
  addDoc, collection, deleteDoc, doc, limit as fbLimit, onSnapshot, orderBy as fbOrderBy,
  query, serverTimestamp, setDoc, updateDoc, writeBatch,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { SAMPLE_MENU, SAMPLE_OFFERS, DEFAULT_ANNOUNCEMENT } from "./data/sampleMenu";

export const isLocalMode = !isFirebaseConfigured;

/* ---------------- demo (local) backend ---------------- */
const KEY = "ksb_local_db_v5";
let cache = null;
const listeners = new Set();

function seed() {
  const menu = {};
  SAMPLE_MENU.forEach(({ id, ...d }) => { menu[id] = d; });
  const promos = {};
  SAMPLE_OFFERS.forEach(({ id, ...d }) => { promos[id] = d; });
  return { menu, promos, orders: {}, settings: { site: { announcement: DEFAULT_ANNOUNCEMENT } } };
}

function readDb() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) cache = JSON.parse(raw);
  } catch {
    /* ignore */
  }
  if (!cache) {
    cache = seed();
    try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* ignore */ }
  }
  return cache;
}

const notify = () => listeners.forEach((fn) => fn());

function mutate(fn) {
  const next = JSON.parse(JSON.stringify(readDb()));
  fn(next);
  const prev = cache;
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    cache = prev;
    throw new Error("Browser storage is full. Use a smaller photo or reset the demo data.");
  }
  notify();
}

if (typeof window !== "undefined") {
  // Doosre tab mein change ho to yahan bhi nazar aaye
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      cache = null;
      notify();
    }
  });
}

const newId = () => "l" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function localList(name, o) {
  let list = Object.entries(readDb()[name] || {}).map(([id, d]) => ({ id, ...d }));
  if (o.orderBy) {
    const dir = o.desc ? -1 : 1;
    list.sort((a, b) => ((a[o.orderBy] || 0) - (b[o.orderBy] || 0)) * dir);
  }
  if (o.limit) list = list.slice(0, o.limit);
  return list;
}

/* ---------------- public API (dono modes ke liye ek jaisi) ---------------- */

// Collection ko live sunna. cb(list) har tabdeeli par chalta hai. Unsubscribe function wapas milta hai.
export function listen(name, cb, err, o = {}) {
  if (isLocalMode) {
    const push = () => cb(localList(name, o));
    listeners.add(push);
    push();
    return () => listeners.delete(push);
  }
  let ref = collection(db, name);
  if (o.orderBy) {
    const parts = [fbOrderBy(o.orderBy, o.desc ? "desc" : "asc")];
    if (o.limit) parts.push(fbLimit(o.limit));
    ref = query(ref, ...parts);
  }
  return onSnapshot(ref, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), err);
}

// Ek document ko live sunna. Na mile to cb(null).
export function listenDoc(name, id, cb, err) {
  if (isLocalMode) {
    const push = () => {
      const d = (readDb()[name] || {})[id];
      cb(d ? { id, ...d } : null);
    };
    listeners.add(push);
    push();
    return () => listeners.delete(push);
  }
  return onSnapshot(doc(db, name, id), (snap) => cb(snap.exists() ? { id: snap.id, ...snap.data() } : null), err);
}

export async function create(name, data) {
  if (isLocalMode) {
    const id = newId();
    mutate((d) => { d[name] = d[name] || {}; d[name][id] = data; });
    return id;
  }
  const ref = await addDoc(collection(db, name), data);
  return ref.id;
}

export async function patch(name, id, data) {
  if (isLocalMode) {
    mutate((d) => {
      if (!d[name] || !d[name][id]) throw new Error("This item does not exist.");
      d[name][id] = { ...d[name][id], ...data };
    });
    return;
  }
  await updateDoc(doc(db, name, id), data);
}

export async function remove(name, id) {
  if (isLocalMode) {
    mutate((d) => { if (d[name]) delete d[name][id]; });
    return;
  }
  await deleteDoc(doc(db, name, id));
}

export async function put(name, id, data, opts = {}) {
  if (isLocalMode) {
    mutate((d) => {
      d[name] = d[name] || {};
      d[name][id] = opts.merge ? { ...(d[name][id] || {}), ...data } : data;
    });
    return;
  }
  await setDoc(doc(db, name, id), data, opts.merge ? { merge: true } : undefined);
}

// list: [{ col, id?, data, merge? }]
export async function putMany(list) {
  if (isLocalMode) {
    mutate((d) => {
      list.forEach(({ col, id, data, merge }) => {
        d[col] = d[col] || {};
        const key = id || newId();
        d[col][key] = merge ? { ...(d[col][key] || {}), ...data } : data;
      });
    });
    return;
  }
  const batch = writeBatch(db);
  list.forEach(({ col, id, data, merge }) => {
    const ref = id ? doc(db, col, id) : doc(collection(db, col));
    if (merge) batch.set(ref, data, { merge: true });
    else batch.set(ref, data);
  });
  await batch.commit();
}

export async function createOrder(orderNo, order) {
  if (isLocalMode) {
    mutate((d) => { d.orders = d.orders || {}; d.orders[orderNo] = { ...order, createdAt: Date.now() }; });
    return;
  }
  await setDoc(doc(db, "orders", orderNo), { ...order, createdAt: serverTimestamp() });
}

export function resetDemoData() {
  if (!isLocalMode) return;
  cache = null;
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  notify();
}
