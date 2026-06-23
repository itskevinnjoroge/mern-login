// src/components/Login.jsx  (plain)
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // lets the browser store the httpOnly cookie
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed.");

      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}

      <input
        type="email"
        name="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
      />

      <input
        type="password"
        name="password"
        placeholder="••••••••"
        value={form.password}
        onChange={handleChange}
        autoComplete="current-password"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Signing in…" : "Sign In →"}
      </button>

      <p>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
