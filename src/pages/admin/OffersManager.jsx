import { useEffect, useState } from "react";
import { create, listenDoc, patch, put, remove as removeDoc } from "../../store";
import { useOffers } from "../../hooks/useOffers";
import MediaField from "../../components/MediaField";

const EMPTY = { title: "", text: "", image: "", video: "", active: true, sortOrder: 0 };

export default function OffersManager() {
  const { offers, loading } = useOffers({ all: true });
  const [form, setForm] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // Sab se upar wali patti
  const [bar, setBar] = useState({ enabled: false, text: "" });
  const [barMsg, setBarMsg] = useState("");
  useEffect(
    () =>
      listenDoc("settings", "site", (d) => {
        const a = d && d.announcement;
        if (a) setBar({ enabled: !!a.enabled, text: a.text || "" });
      }),
    []
  );

  async function saveBar(e) {
    e.preventDefault();
    setBarMsg("");
    try {
      await put("settings", "site", { announcement: { enabled: bar.enabled, text: bar.text.trim() } }, { merge: true });
      setBarMsg("Saved. It is now live on the website.");
    } catch (ex) {
      setBarMsg("Could not save: " + ex.message);
    }
  }

  const fail = (e) => alert("Something went wrong: " + e.message);
  const openNew = () => { setErr(""); setForm({ ...EMPTY }); };
  const openEdit = (o) => {
    setErr("");
    setForm({ id: o.id, title: o.title || "", text: o.text || "", image: o.image || "", video: o.video || "", active: o.active !== false, sortOrder: o.sortOrder || 0 });
  };

  async function save(e) {
    e.preventDefault();
    const data = {
      title: form.title.trim(),
      text: form.text.trim(),
      image: form.image.trim(),
      video: form.video.trim(),
      active: !!form.active,
      sortOrder: Number(form.sortOrder) || 0,
    };
    if (!data.title) return setErr("Enter the offer title.");
    setBusy(true);
    try {
      if (form.id) await patch("promos", form.id, data);
      else await create("promos", data);
      setForm(null);
    } catch (ex) {
      setErr("Could not save: " + ex.message);
    }
    setBusy(false);
  }

  const toggle = (o) => patch("promos", o.id, { active: o.active === false }).catch(fail);
  const remove = (o) => window.confirm(`Remove "${o.title}"?`) && removeDoc("promos", o.id).catch(fail);

  return (
    <div>
      <div className="admin-head">
        <h1>Offers</h1>
        <button className="btn btn-red" onClick={openNew}>Add new offer</button>
      </div>
      <p className="note">
        Add today's offer poster (photo) or video here. It appears on the website's Home page under "Today's offers".
        You can make posters in Canva or on your phone and upload them.
      </p>

      <form className="card-box" onSubmit={saveBar}>
        <h2 className="box-title">Announcement bar (top of the site)</h2>
        <label className="field">
          <span>Bar text</span>
          <input value={bar.text} onChange={(e) => setBar({ ...bar, text: e.target.value })} maxLength={160} placeholder="e.g. Today's deal: 2 biryani + drink for only Rs. 1000" />
        </label>
        <div className="check-row">
          <label><input type="checkbox" checked={bar.enabled} onChange={(e) => setBar({ ...bar, enabled: e.target.checked })} /> Show on website</label>
        </div>
        <div className="actions">
          <button className="btn btn-green btn-sm">Save bar</button>
        </div>
        {barMsg && <p className="note">{barMsg}</p>}
      </form>

      {loading && <p className="empty">Loading...</p>}
      {!loading && offers.length === 0 && <p className="empty">No offers yet. Click "Add new offer".</p>}

      <div className="offer-admin-list">
        {offers.map((o) => (
          <article key={o.id} className={"card-box offer-row" + (o.active === false ? " off" : "")}>
            <div className="offer-thumb">
              {o.image ? <img src={o.image} alt="" /> : o.video ? <span>Video</span> : <span>Text</span>}
            </div>
            <div className="offer-info">
              <strong>{o.title}</strong>
              {o.text && <p className="note">{o.text}</p>}
            </div>
            <div className="row-actions">
              <label className="switch">
                <input type="checkbox" checked={o.active !== false} onChange={() => toggle(o)} />
                <span>{o.active === false ? "Off" : "Live"}</span>
              </label>
              <button className="link-btn" onClick={() => openEdit(o)}>Edit</button>
              <button className="link-btn danger" onClick={() => remove(o)}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      {form && (
        <div className="modal-back" role="dialog" aria-modal="true" aria-label={form.id ? "Edit offer" : "New offer"}>
          <form className="modal" onSubmit={save}>
            <h2 className="box-title">{form.id ? "Edit offer" : "New offer"}</h2>

            <label className="field">
              <span>Title</span>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={80} />
            </label>

            <label className="field">
              <span>Details (price, what is included, until when)</span>
              <textarea rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
            </label>

            <MediaField label="Poster / photo" kind="image" value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v }))} />
            <MediaField label="Video (optional; if added, it replaces the photo)" kind="video" value={form.video} onChange={(v) => setForm((f) => ({ ...f, video: v }))} />

            <div className="check-row">
              <label><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Show on website</label>
            </div>

            <label className="field">
              <span>Sort order (lower numbers appear first)</span>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </label>

            {err && <p className="alert">{err}</p>}
            <div className="actions">
              <button className="btn btn-red" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
