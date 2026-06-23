// src/components/Dashboard.jsx
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>{user?.email}</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
