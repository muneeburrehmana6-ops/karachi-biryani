import { useState } from "react";
import { cloudConfigured, compressImageToDataUrl, uploadToCloudinary } from "../cloudinary";
import { isLocalMode } from "../store";
import { cld } from "../utils";

// Admin panel mein photo ya video upload karne ka box
export default function MediaField({ label, kind = "image", value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [err, setErr] = useState("");
  const isVideo = kind === "video";
  const maxMB = isVideo ? 60 : 8;
  const localImage = !cloudConfigured && isLocalMode && !isVideo; // demo mode mein photo browser mein save hoti hai
  const canUpload = cloudConfigured || localImage;

  async function pick(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setErr("");
    if (!file.type.startsWith(isVideo ? "video/" : "image/")) {
      setErr(isVideo ? "Please choose a video file." : "Please choose a photo (JPG or PNG).");
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setErr(`That file is too large. Maximum ${maxMB} MB.`);
      return;
    }
    setBusy(true);
    setPct(0);
    try {
      onChange(cloudConfigured ? await uploadToCloudinary(file, setPct) : await compressImageToDataUrl(file));
    } catch (ex) {
      setErr(ex.message);
    }
    setBusy(false);
  }

  return (
    <div className="field media-field">
      <span>{label}</span>

      {value &&
        (isVideo ? (
          <video className="media-preview" src={cld(value, "f_auto,q_auto") + "#t=0.1"} controls playsInline preload="metadata" />
        ) : (
          <img className="media-preview" src={cld(value, "f_auto,q_auto,w_500")} alt="Preview" />
        ))}

      <div className="media-actions">
        {canUpload ? (
          <label className={"btn btn-ghost btn-sm" + (busy ? " is-busy" : "")}>
            {busy ? `Uploading ${pct}%` : value ? (isVideo ? "Change video" : "Change photo") : isVideo ? "Upload video" : "Upload photo"}
            <input type="file" accept={isVideo ? "video/*" : "image/*"} hidden onChange={pick} disabled={busy} />
          </label>
        ) : (
          <span className="note">
            {isVideo && isLocalMode
              ? "Video upload is not available in demo mode. Paste a video link instead. For real uploads, set up Cloudinary (README.md, step 6)."
              : "Uploading needs Cloudinary to be set up (README.md, step 6). Until then, paste a link below."}
          </span>
        )}
        {value && (
          <button type="button" className="link-btn danger" onClick={() => onChange("")}>
            Remove
          </button>
        )}
      </div>

      {err && <em className="err">{err}</em>}
      <input
        aria-label={`${label} link`}
        value={value && value.startsWith("data:") ? "" : value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={value && value.startsWith("data:") ? "Photo uploaded" : "Or paste a link (/images/name.jpg or https://...)"}
      />
    </div>
  );
}
