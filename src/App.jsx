import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import Track from "./pages/Track";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Admin pages alag chunk mein load hote hain, taake customer ki site halki rahe
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminMenu = lazy(() => import("./pages/admin/MenuManager"));
const AdminOffers = lazy(() => import("./pages/admin/OffersManager"));

export default function App() {
  return (
    <Suspense fallback={<p className="empty">Loading...</p>}>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/track" element={<Track />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOrders />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="offers" element={<AdminOffers />} />
      </Route>
    </Routes>
    </Suspense>
  );
}
