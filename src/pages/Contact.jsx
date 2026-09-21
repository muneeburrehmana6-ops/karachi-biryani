import { RESTAURANT } from "../config";
import { PhoneIcon, WhatsAppIcon } from "../components/Icons";
import { mapsEmbedUrl, mapsSearchUrl, waLink } from "../utils";

export default function Contact() {
  const tel = RESTAURANT.phone.replace(/[^\d+]/g, "");
  const embed = RESTAURANT.mapEmbedUrl || mapsEmbedUrl(RESTAURANT.mapQuery);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Contact</h1>
        <div className="contact-grid">
          <div className="card-box">
            <h2 className="box-title">Get in touch</h2>
            <p><strong>Call / home delivery:</strong> <a href={`tel:${tel}`}>{RESTAURANT.phone}</a></p>
            <p><strong>WhatsApp:</strong> <a href={waLink()} target="_blank" rel="noreferrer">{RESTAURANT.whatsappDisplay}</a></p>
            <p><strong>Second number (call and WhatsApp):</strong> <a href={`tel:${RESTAURANT.altPhone.tel}`}>{RESTAURANT.altPhone.display}</a></p>
            <p><strong>Address:</strong> {RESTAURANT.address}</p>
            <p><strong>Timings:</strong> {RESTAURANT.timings}</p>
            <div className="actions">
              <a className="btn btn-red" href={`tel:${tel}`}>Call us</a>
              <a className="btn btn-green" href={waLink("Hello")} target="_blank" rel="noreferrer">WhatsApp</a>
              <a className="btn btn-ghost" href={mapsSearchUrl(RESTAURANT.mapQuery)} target="_blank" rel="noreferrer">Directions</a>
            </div>
            <div className="actions">
              <a className="btn btn-red" href={`tel:${RESTAURANT.altPhone.tel}`}><PhoneIcon /> Call {RESTAURANT.altPhone.display}</a>
              <a className="btn btn-green" href={`https://wa.me/${RESTAURANT.altPhone.whatsapp}`} target="_blank" rel="noreferrer"><WhatsAppIcon /> WhatsApp {RESTAURANT.altPhone.display}</a>
            </div>
            <div className="socials">
              {RESTAURANT.facebook && <a href={RESTAURANT.facebook} target="_blank" rel="noreferrer">Facebook</a>}
              {RESTAURANT.instagram && <a href={RESTAURANT.instagram} target="_blank" rel="noreferrer">Instagram</a>}
            </div>
          </div>
          <div className="map-box">
            <iframe title="Restaurant location" src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
      </div>
    </div>
  );
}
