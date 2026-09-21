import { useState } from "react";
import { useCart } from "../context/CartContext";
import { CATEGORY_EMOJI } from "../config";
import { cld, fmt } from "../utils";

export default function ItemCard({ item }) {
  const { add } = useCart();
  const [idx, setIdx] = useState(0);
  const [broken, setBroken] = useState(false);
  const [playing, setPlaying] = useState(false);

  const opts = item.options && item.options.length ? item.options : [{ label: "Regular", price: 0 }];
  const opt = opts[Math.min(idx, opts.length - 1)];
  const soldOut = item.available === false;
  const hasOld = opt.oldPrice && opt.oldPrice > opt.price;

  return (
    <article className={"item" + (soldOut ? " soldout" : "")}>
      <div className={"item-img cat-" + String(item.category || "").toLowerCase()}>
        {playing && item.video ? (
          <video src={cld(item.video, "f_auto,q_auto")} controls autoPlay playsInline />
        ) : item.image && !broken ? (
          <img src={cld(item.image, "f_auto,q_auto,w_700")} alt={item.name} loading="lazy" onError={() => setBroken(true)} />
        ) : (
          <span className="emoji" aria-hidden="true">{CATEGORY_EMOJI[item.category] || "🍽️"}</span>
        )}

        {soldOut ? (
          <span className="soldout-tag">Sold out</span>
        ) : (
          item.badge && <span className="item-tag" dir="auto">{item.badge}</span>
        )}

        {item.video && !playing && (
          <button type="button" className="play-btn" onClick={() => setPlaying(true)} aria-label={`Play ${item.name} video`}>
            ▶ Video
          </button>
        )}
      </div>

      <div className="item-body">
        <h3 dir="auto">{item.name}</h3>
        {item.description && <p className="item-desc" dir="auto">{item.description}</p>}

        {opts.length > 1 && (
          <div className="chips" role="radiogroup" aria-label={`${item.name} portion`}>
            {opts.map((o, i) => (
              <button
                key={o.label}
                type="button"
                role="radio"
                aria-checked={i === idx}
                className={"chip" + (i === idx ? " on" : "")}
                onClick={() => setIdx(i)}
              >
                <bdi>{o.label}</bdi>
              </button>
            ))}
          </div>
        )}
        {opts.length === 1 && <p className="portion" dir="auto">{opt.label}</p>}

        <div className="item-foot">
          <span className="price">
            {fmt(opt.price)}
            {hasOld && <s className="old" aria-label={`was ${fmt(opt.oldPrice)}`}>{fmt(opt.oldPrice)}</s>}
          </span>
          <button type="button" className="btn btn-red btn-sm" disabled={soldOut} onClick={() => add(item, opt)}>
            {soldOut ? "Sold out" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
