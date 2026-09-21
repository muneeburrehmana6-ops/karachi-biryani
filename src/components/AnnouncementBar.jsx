import { Link } from "react-router-dom";
import { useAnnouncement } from "../hooks/useAnnouncement";

export default function AnnouncementBar() {
  const a = useAnnouncement();
  if (!a || !a.enabled || !a.text) return null;
  return (
    <div className="announce" role="region" aria-label="Announcement">
      <span dir="auto">{a.text}</span>
      <Link to="/menu">Order now</Link>
    </div>
  );
}
