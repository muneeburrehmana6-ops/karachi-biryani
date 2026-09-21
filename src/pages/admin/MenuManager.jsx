import { useState } from "react";
import { create, patch, putMany, remove as removeDoc } from "../../store";
import { useMenu } from "../../hooks/useMenu";
import { SAMPLE_MENU, SAMPLE_OFFERS, DEFAULT_ANNOUNCEMENT } from "../../data/sampleMenu";
import { CATEGORIES } from "../../config";
import { fmt } from "../../utils";
import MediaField from "../../components/MediaField";

const EMPTY = {
  name: "",
  category: CATEGORIES[0],
  description: "",
  badge: "",
  image: "",
  video: "",
  options: [{ label: "", price: "", oldPrice: "" }],
  available: true,
  featured: false,
  sortOrder: 0,
};

export default function MenuManager() {
  const { items, loading, isSample } = useMenu();
  const [form, setForm] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const fail = (e) => alert("Something went wrong: " + e.message);

  async function loadSample() {
    if (!window.confirm("Add the sample menu, offer and announcement to the database? You can change everything afterwards.")) return;
    setBusy(true);
    try {
      await putMany([
        ...SAMPLE_MENU.map(({ id, ...data }) => ({ col: "menu", data })),
        ...SAMPLE_OFFERS.map(({ id, ...data }) => ({ col: "promos", data })),
        { col: "settings", id: "site", data: { announcement: DEFAULT_ANNOUNCEMENT }, merge: true },
      ]);
    } catch (e) {
      fail(e);
    }
    setBusy(false);
  }

  const openNew = () => {
    setErr("");
    setForm({ ...EMPTY, options: EMPTY.options.map((o) => ({ ...o })) });
  };
  const openEdit = (i) => {
    setErr("");
    setForm({
      id: i.id,
      name: i.name,
      category: i.category,
      description: i.description || "",
      badge: i.badge || "",
      image: i.image || "",
      video: i.video || "",
      options: (i.options || []).map((o) => ({ label: o.label, price: String(o.price), oldPrice: o.oldPrice ? String(o.oldPrice) : "" })),
      available: i.available !== false,
      featured: !!i.featured,
      sortOrder: i.sortOrder || 0,
    });
  };

  const setOpt = (idx, key, val) =>
    setForm((f) => ({ ...f, options: f.options.map((o, i) => (i === idx ? { ...o, [key]: val } : o)) }));

  async function save(e) {
    e.preventDefault();
    const options = form.options
      .filter((o) => o.label.trim() && Number(o.price) > 0)
      .map((o) => {
        const opt = { label: o.label.trim(), price: Number(o.price) };
        if (Number(o.oldPrice) > opt.price) opt.oldPrice = Number(o.oldPrice);
        return opt;
      });

    const data = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      badge: form.badge.trim(),
      image: form.image.trim(),
      video: form.video.trim(),
      options,
      available: !!form.available,
      featured: !!form.featured,
      sortOrder: Number(form.sortOrder) || 0,
    };
    if (!data.name) return setErr("Enter the item name.");
    if (!options.length) return setErr("Add at least one portion with a price.");

    setBusy(true);
    try {
      if (form.id) await patch("menu", form.id, data);
      else await create("menu", data);
      setForm(null);
    } catch (e2) {
      setErr("Could not save: " + e2.message);
    }
    setBusy(false);
  }

  const toggle = (i) => patch("menu", i.id, { available: i.available === false }).catch(fail);
  const remove = (i) => window.confirm(`Remove "${i.name}" from the menu?`) && removeDoc("menu", i.id).catch(fail);

  return (
    <div>
      <div className="admin-head">
        <h1>Menu and deals</h1>
        {!isSample && <button className="btn btn-red" onClick={openNew}>Add new item</button>}
      </div>
      <p className="note">
        Add today's deal here as an item in the "Deals" category so customers can order it. To show only a poster or video, use the "Offers" tab.
      </p>

      {loading && <p className="empty">Loading...</p>}

      {isSample && !loading && (
        <div className="card-box">
          <h2 className="box-title">The menu is empty</h2>
          <p>The website is showing demo items. Load the sample menu into the database, then edit every item's price, photo and description. Or start a new menu yourself.</p>
          <div className="actions">
            <button className="btn btn-green" onClick={loadSample} disabled={busy}>Load sample menu</button>
            <button className="btn btn-ghost" onClick={openNew}>Add new item</button>
          </div>
        </div>
      )}

      {!isSample &&
        CATEGORIES.map((c) => {
          const list = items.filter((i) => i.category === c);
          if (!list.length) return null;
          return (
            <section key={c} className="menu-group">
              <h2 className="group-title">{c}</h2>
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Item</th><th>Portions</th><th>Available</th><th></th></tr>
                  </thead>
                  <tbody>
                    {list.map((i) => (
                      <tr key={i.id} className={i.available === false ? "off" : ""}>
                        <td>
                          <strong dir="auto">{i.name}</strong>
                          {i.featured && <span className="pill paid">Popular</span>}
                          {i.badge && <span className="pill unpaid">{i.badge}</span>}
                          {(i.image || i.video) && (
                            <span className="note"> {i.image ? "photo" : ""}{i.image && i.video ? " + " : ""}{i.video ? "video" : ""}</span>
                          )}
                        </td>
                        <td>
                          {(i.options || [])
                            .map((o) => `${o.label} ${fmt(o.price)}${o.oldPrice ? ` (was ${fmt(o.oldPrice)})` : ""}`)
                            .join(", ")}
                        </td>
                        <td>
                          <label className="switch">
                            <input type="checkbox" checked={i.available !== false} onChange={() => toggle(i)} />
                            <span>{i.available === false ? "Sold out" : "Available"}</span>
                          </label>
                        </td>
                        <td className="row-actions">
                          <button className="link-btn" onClick={() => openEdit(i)}>Edit</button>
                          <button className="link-btn danger" onClick={() => remove(i)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

      {form && (
        <div className="modal-back" role="dialog" aria-modal="true" aria-label={form.id ? "Edit item" : "New item"}>
          <form className="modal" onSubmit={save}>
            <h2 className="box-title">{form.id ? "Edit item" : "New item"}</h2>

            <label className="field">
              <span>Name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>

            <label className="field">
              <span>Category (choose "Deals" for a deal)</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>

            <label className="field">
              <span>Description</span>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>

            <label className="field">
              <span>Tag (optional), e.g. "Opening offer" or "Deal of the day"</span>
              <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} maxLength={30} />
            </label>

            <MediaField label="Photo" kind="image" value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v }))} />
            <MediaField label="Video (optional)" kind="video" value={form.video} onChange={(v) => setForm((f) => ({ ...f, video: v }))} />

            <div className="field">
              <span>Portions and prices</span>
              <p className="note">Fill in "Old price" to show a crossed-out price, like Rs. 660 next to Rs. 550.</p>
              {form.options.map((o, i) => (
                <div className="opt-row" key={i}>
                  <input aria-label="Portion name" value={o.label} onChange={(e) => setOpt(i, "label", e.target.value)} placeholder="1 kg (4 pcs)" />
                  <input aria-label="Price" type="number" min="1" value={o.price} onChange={(e) => setOpt(i, "price", e.target.value)} placeholder="Price 550" />
                  <input aria-label="Old price" type="number" min="1" value={o.oldPrice} onChange={(e) => setOpt(i, "oldPrice", e.target.value)} placeholder="Old price 660" />
                  {form.options.length > 1 && (
                    <button type="button" className="link-btn danger" onClick={() => setForm({ ...form, options: form.options.filter((_, k) => k !== i) })}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="link-btn" onClick={() => setForm({ ...form, options: [...form.options, { label: "", price: "", oldPrice: "" }] })}>
                Add portion
              </button>
            </div>

            <div className="check-row">
              <label><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> Available</label>
              <label><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Show in Popular</label>
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
