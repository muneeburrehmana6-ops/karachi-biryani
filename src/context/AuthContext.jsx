import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail,
  signInWithEmailAndPassword, signOut, updateProfile,
} from "firebase/auth";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../firebase";

const AuthContext = createContext(null);

/*
  Do tarah ke users:
  - Admin: wo account jis ki UID Firestore rules (firestore.rules) mein likhi hai.
  - Customer: koi bhi jo Sign up kar ke account banaye.
  Admin ki pehchan yahan code mein nahi likhi. Login ke baad ek chhota sa check hota hai: jo user orders ki list
  parh sakta hai (rules ki ijazat se) wahi admin hai. Is tarah admin ki asli fehrist sirf rules mein rehti hai.
*/

// Demo mode (Firebase connect na ho): sab kuch isi browser mein. Asli database ko koi khatra nahi.
export const DEMO_EMAIL = "admin@demo.com";
export const DEMO_PASSWORD = "admin123";
const USERS_KEY = "ksb_demo_users";
const SESSION_KEY = "ksb_demo_session";

const readUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
};
const findDemoUser = (email) =>
  email === DEMO_EMAIL
    ? { email: DEMO_EMAIL, displayName: "Admin", password: DEMO_PASSWORD }
    : readUsers().find((u) => u.email === email);
const readDemoSession = () => {
  try {
    const email = localStorage.getItem(SESSION_KEY);
    const u = email && findDemoUser(email);
    return u ? { email: u.email, displayName: u.displayName } : null;
  } catch {
    return null;
  }
};
const authError = (code) => Object.assign(new Error(code), { code });

export function AuthProvider({ children }) {
  const demo = !isFirebaseConfigured;
  const [user, setUser] = useState(() => (demo ? readDemoSession() : null));
  const [loading, setLoading] = useState(!demo);
  // isAdmin: null = abhi check ho raha hai, true / false = nateeja
  const [isAdmin, setIsAdmin] = useState(() => (demo ? readDemoSession()?.email === DEMO_EMAIL : false));
  const probe = useRef(0);

  useEffect(() => {
    if (demo) return;
    return onAuthStateChanged(auth, async (u) => {
      const id = ++probe.current;
      setUser(u);
      if (!u) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(null);
      setLoading(false);
      try {
        await getDocs(query(collection(db, "orders"), limit(1)));
        if (id === probe.current) setIsAdmin(true);
      } catch {
        if (id === probe.current) setIsAdmin(false);
      }
    });
  }, [demo]);

  const login = (email, password) => {
    if (!demo) return signInWithEmailAndPassword(auth, email, password);
    const e = email.trim().toLowerCase();
    const u = findDemoUser(e);
    if (u && u.password === password) {
      try { localStorage.setItem(SESSION_KEY, e); } catch { /* ignore */ }
      setUser({ email: u.email, displayName: u.displayName });
      setIsAdmin(u.email === DEMO_EMAIL);
      return Promise.resolve();
    }
    return Promise.reject(authError("auth/invalid-credential"));
  };

  // Account banata hai aur foran logout kar deta hai, taake user "register phir login" ke tareeqe se aaye
  const signup = async (name, email, password) => {
    if (demo) {
      const e = email.trim().toLowerCase();
      if (findDemoUser(e)) throw authError("auth/email-already-in-use");
      localStorage.setItem(USERS_KEY, JSON.stringify([...readUsers(), { email: e, displayName: name, password }]));
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    try { await updateProfile(cred.user, { displayName: name }); } catch { /* naam na bhi bane to koi masla nahi */ }
    await signOut(auth);
  };

  const logout = () => {
    if (!demo) return signOut(auth);
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    setUser(null);
    setIsAdmin(false);
    return Promise.resolve();
  };

  const resetPassword = (email) => {
    if (demo) return Promise.reject(authError("demo/unsupported"));
    return sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, signup, logout, resetPassword, demo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
