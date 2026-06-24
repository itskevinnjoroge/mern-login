// src/components/Dashboard.jsx  (styled)
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Derive initials for the avatar (first letter of each word in the name, max 2)
  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("")
    : "?";

  return (
    <div className="dash-root">
      <div className="accent-block" />
      <div className="accent-block-2" />

      <div className="dash-card">
        <div className="card-corner" />
        <div className="card-corner br" />

        <header className="dash-header">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className="heading">Welcome back</h1>
          </div>
          <div className="avatar" aria-hidden="true">
            {initials}
          </div>
        </header>

        <div className="user-block">
          <div className="user-row">
            <span className="user-label">Name</span>
            <span className="user-value">{user?.name}</span>
          </div>
          <div className="divider-line" />
          <div className="user-row">
            <span className="user-label">Email</span>
            <span className="user-value">{user?.email}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          Sign Out →
        </button>
      </div>
    </div>
  );
}
