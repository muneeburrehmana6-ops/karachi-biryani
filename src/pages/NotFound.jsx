import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page">
      <div className="container narrow center">
        <h1 className="page-title">Page not found</h1>
        <p className="note">The link may be wrong. Start your order from the menu.</p>
        <Link to="/menu" className="btn btn-red">View menu</Link>
      </div>
    </div>
  );
}
