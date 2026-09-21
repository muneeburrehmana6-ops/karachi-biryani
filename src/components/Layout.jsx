import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";
import { useCart } from "../context/CartContext";
import { waLink } from "../utils";
import { RESTAURANT } from "../config";
import { PhoneIcon, WhatsAppIcon } from "./Icons";

export default function Layout() {
  const { pathname } = useLocation();
  const { notice } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <AnnouncementBar />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />

      <div className="float-actions">
        <a className="float-btn float-call" href={`tel:${RESTAURANT.phone.replace(/[^\d+]/g, "")}`} aria-label="Call us">
          <PhoneIcon size={22} />
          <span>Call</span>
        </a>
        <a
          className="float-btn float-wa"
          href={waLink("Assalam o alaikum, mujhe order karna hai.")}
          target="_blank"
          rel="noreferrer"
          aria-label="Order on WhatsApp"
        >
          <WhatsAppIcon size={22} />
          <span>WhatsApp</span>
        </a>
      </div>

      <div className={"toast" + (notice ? " show" : "")} role="status" aria-live="polite">
        {notice}
      </div>
    </>
  );
}
