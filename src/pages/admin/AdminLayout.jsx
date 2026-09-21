import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { resetDemoData } from "../../store";

export default function AdminLayout() {
  const { user, loading, logout, demo } = useAuth();

  if (loading) return <div className="admin-center"><p className="empty">Loading...</p></div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin">
      {demo && (
        <div className="demo-banner">
          <span>Demo mode: Firebase is not connected yet. Changes are saved only in this browser.</span>
          <button
            type="button"
            className="link-btn light"
            onClick={() => window.confirm("Reset all demo data (menu, offers, orders) back to the starting state?") && resetDemoData()}
          >
            Reset demo data
          </button>
        </div>
      )}
      <header className="admin-bar">
        <strong className="admin-brand">Staff panel</strong>
        <nav aria-label="Admin">
          <NavLink to="/admin" end>Orders</NavLink>
          <NavLink to="/admin/menu">Menu</NavLink>
          <NavLink to="/admin/offers">Offers</NavLink>
        </nav>
        <div className="admin-right">
          <Link to="/" target="_blank">View website</Link>
          <button type="button" className="link-btn light" onClick={logout}>Logout</button>
        </div>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
