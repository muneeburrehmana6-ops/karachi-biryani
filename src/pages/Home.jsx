import { Link } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { useOffers } from "../hooks/useOffers";
import ItemCard from "../components/ItemCard";
import OfferCard from "../components/OfferCard";
import { CATEGORY_EMOJI, RESTAURANT, REVIEWS } from "../config";
import { fmt, waLink } from "../utils";
import { PhoneIcon, WhatsAppIcon } from "../components/Icons";

export default function Home() {
  const { items, loading } = useMenu();
  const { offers } = useOffers();

  // Rate list: signboard ki tarah, har item ki har portion ki qeemat
  const board = items
    .filter((i) => i.available !== false)
    .flatMap((i) =>
      (i.options || []).map((o) => ({ label: `${i.name} ${o.label}`, price: o.price, oldPrice: o.oldPrice }))
    )
    .slice(0, 7);

  const popular = items.filter((i) => i.featured && i.available !== false).slice(0, 4);
  const deals = items.filter((i) => i.category === "Deals" && i.available !== false);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>Authentic Karachi Student Biryani, served hot at your door.</h1>
            <p className="lead">
              Spiced rice, tender chicken and a cool raita on the side. Want something lighter? Murgh Pulao is ready too.
            </p>
            <div className="hero-cta">
              <Link to="/menu" className="btn btn-red btn-lg">Order now</Link>
              <a
                href={waLink("Hello, I would like to place an order.")}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ink btn-lg"
              >
                <WhatsAppIcon /> Order on WhatsApp
              </a>
              <a href={`tel:${RESTAURANT.phone.replace(/[^\d+]/g, "")}`} className="btn btn-ghost btn-lg">
                <PhoneIcon /> Call now
              </a>
            </div>
            <ul className="hero-facts">
              <li><strong>{RESTAURANT.deliveryTime}</strong> delivery</li>
              <li><strong>Cash on delivery</strong> available</li>
              {RESTAURANT.minOrder > 0 && <li>Minimum order <strong>{fmt(RESTAURANT.minOrder)}</strong></li>}
            </ul>
          </div>

          <aside className="board" aria-label="Price list">
            <h2>Price list</h2>
            {loading ? (
              <p className="board-empty">Loading prices...</p>
            ) : (
              <ul>
                {board.map((r) => (
                  <li key={r.label}>
                    <span dir="auto">{r.label}</span>
                    <span className="dots" aria-hidden="true" />
                    <span className="board-price">
                      {r.oldPrice > r.price && <s className="old">{fmt(r.oldPrice)}</s>}
                      {fmt(r.price)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/menu" className="board-link">See the full menu</Link>
          </aside>
        </div>
        <div className="truck-strip" aria-hidden="true" />
      </section>

      {offers.length > 0 && (
        <section className="section section-tint">
          <div className="container">
            <h2 className="section-title">Today's offers</h2>
            <div className="offer-grid">
              {offers.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <h2 className="section-title">Two favourites from one kitchen</h2>
          <div className="dish-grid">
            <article className="dish dish-red">
              <span className="dish-emoji" aria-hidden="true">{CATEGORY_EMOJI.Biryani}</span>
              <h3>Chicken Biryani</h3>
              <p>
                Spiced Karachi-style rice with tender chicken. Order by the plate or by the kilo, always packed hot.
              </p>
              <Link to="/menu" className="btn btn-yellow">Order biryani</Link>
            </article>
            <article className="dish dish-green">
              <span className="dish-emoji" aria-hidden="true">{CATEGORY_EMOJI.Pulao}</span>
              <h3>Murgh Pulao</h3>
              <p>
                Fragrant pulao with a mild masala. Order by the plate or by the kilo, with raita and salad on the side.
              </p>
              <Link to="/menu" className="btn btn-yellow">Order pulao</Link>
            </article>
          </div>
        </div>
      </section>

      {popular.length > 0 && (
        <section className="section section-tint">
          <div className="container">
            <h2 className="section-title">Popular items</h2>
            <div className="item-grid">
              {popular.map((i) => (
                <ItemCard key={i.id} item={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {deals.length > 0 && (
        <section className="section band-yellow">
          <div className="container">
            <h2 className="section-title">Deals</h2>
            <div className="item-grid">
              {deals.map((i) => (
                <ItemCard key={i.id} item={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <h2 className="section-title">Ordering is easy</h2>
          <ol className="steps">
            <li>
              <h3>Choose from the menu</h3>
              <p>Pick a portion and add it to your cart.</p>
            </li>
            <li>
              <h3>Enter your address</h3>
              <p>Add your name, phone and address. Pay by cash, Easypaisa or JazzCash.</p>
            </li>
            <li>
              <h3>Track your order</h3>
              <p>Use your order number to see what stage your food is at.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section band-green">
        <div className="container">
          <h2 className="section-title">What our customers say</h2>
          <div className="review-grid">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="review">
                <blockquote>{r.text}</blockquote>
                <figcaption>{r.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container info-split">
          <div>
            <h2 className="section-title">Delivery areas</h2>
            <div className="chips static">
              {RESTAURANT.deliveryAreas.map((a) => (
                <span key={a} className="chip">{a}</span>
              ))}
            </div>
            <p className="note">
              The delivery charge is {fmt(RESTAURANT.deliveryFee)}. Delivery is free on orders above {fmt(RESTAURANT.freeDeliveryAbove)}.
            </p>
          </div>
          <div>
            <h2 className="section-title">Find us</h2>
            <p className="big-text">{RESTAURANT.timings}</p>
            <p className="note">{RESTAURANT.address}</p>
            <Link to="/contact" className="btn btn-ink">Map and contact</Link>
          </div>
        </div>
      </section>
    </>
  );
}
