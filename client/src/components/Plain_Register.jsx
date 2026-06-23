// src/components/Register.jsx  (plain)
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed.");

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
        type="text"
        name="name"
        placeholder="Your name"
        value={form.name}
        onChange={handleChange}
        autoComplete="name"
      />

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
        autoComplete="new-password"
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        value={form.confirmPassword}
        onChange={handleChange}
        autoComplete="new-password"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating account…" : "Create Account →"}
      </button>

      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
