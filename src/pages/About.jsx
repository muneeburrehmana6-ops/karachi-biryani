import { Link } from "react-router-dom";
import { ABOUT_TEXT, RESTAURANT, TEAM } from "../config";
import { mapsSearchUrl } from "../utils";

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export default function About() {
  const team = TEAM.filter((m) => m.name && m.name.trim());

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">About us</h1>
        <p className="lead-dark">{ABOUT_TEXT}</p>

        <section className="about-block" aria-labelledby="team-h">
          <h2 id="team-h" className="group-title">Our team</h2>
          {team.length === 0 ? (
            <p className="empty">Team details coming soon.</p>
          ) : (
            <div className="team-grid">
              {team.map((m) => {
                const tel = (m.phone || "").replace(/[^\d+]/g, "");
                return (
                  <article key={m.name} className="member">
                    <div className="avatar">
                      {m.photo ? <img src={m.photo} alt={m.name} /> : <span aria-hidden="true">{initials(m.name)}</span>}
                    </div>
                    <h3>{m.name}</h3>
                    {m.role && <p className="note">{m.role}</p>}
                    <div className="actions">
                      {tel && <a className="btn btn-red btn-sm" href={`tel:${tel}`}>Call</a>}
                      {m.whatsapp && (
                        <a className="btn btn-green btn-sm" href={`https://wa.me/${m.whatsapp}`} target="_blank" rel="noreferrer">
                          WhatsApp
                        </a>
                      )}
                    </div>
                    {m.phone && <p className="note">{m.phone}</p>}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="about-block card-box" aria-labelledby="loc-h">
          <h2 id="loc-h" className="box-title">Find us</h2>
          <p>{RESTAURANT.address}</p>
          <p className="note">{RESTAURANT.timings}</p>
          <div className="actions">
            <a className="btn btn-ink" href={mapsSearchUrl(RESTAURANT.mapQuery)} target="_blank" rel="noreferrer">Directions</a>
            <Link to="/contact" className="btn btn-ghost">Contact page</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
