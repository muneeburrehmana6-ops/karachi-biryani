import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase";

const AuthContext = createContext(null);

// Demo mode (Firebase connect na ho) ka login. Ye sirf isi browser mein chalta hai, asli database ko koi khatra nahi.
export const DEMO_EMAIL = "admin@demo.com";
export const DEMO_PASSWORD = "admin123";
const DEMO_KEY = "ksb_demo_admin";

const readDemo = () => {
  try {
    return localStorage.getItem(DEMO_KEY) === "1" ? { email: DEMO_EMAIL } : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const demo = !isFirebaseConfigured;
  const [user, setUser] = useState(() => (demo ? readDemo() : null));
  const [loading, setLoading] = useState(!demo);

  useEffect(() => {
    if (demo) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, [demo]);

  const login = (email, password) => {
    if (!demo) return signInWithEmailAndPassword(auth, email, password);
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      try { localStorage.setItem(DEMO_KEY, "1"); } catch { /* ignore */ }
      setUser({ email: DEMO_EMAIL });
      return Promise.resolve();
    }
    const err = new Error("bad credentials");
    err.code = "auth/invalid-credential";
    return Promise.reject(err);
  };

  const logout = () => {
    if (!demo) return signOut(auth);
    try { localStorage.removeItem(DEMO_KEY); } catch { /* ignore */ }
    setUser(null);
    return Promise.resolve();
  };

  return <AuthContext.Provider value={{ user, loading, login, logout, demo }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
