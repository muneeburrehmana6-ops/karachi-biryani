import { Link } from "react-router-dom";
import { cld } from "../utils";

export default function OfferCard({ offer }) {
  return (
    <article className="offer">
      {offer.video ? (
        <video
          className="offer-media"
          src={cld(offer.video, "f_auto,q_auto") + "#t=0.1"}
          controls
          playsInline
          preload="metadata"
        />
      ) : offer.image ? (
        <img className="offer-media" src={cld(offer.image, "f_auto,q_auto,w_900")} alt={offer.title} loading="lazy" />
      ) : null}
      <div className="offer-body">
        <h3 dir="auto">{offer.title}</h3>
        {offer.text && <p dir="auto">{offer.text}</p>}
        <Link to="/menu" className="btn btn-red btn-sm">Order now</Link>
      </div>
    </article>
  );
}
