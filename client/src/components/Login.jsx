// src/components/Login.jsx  (styled)
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/auth.css";

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
        credentials: "include",
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
    <div className="login-root">
      <div className="accent-block" />
      <div className="accent-block-2" />

      <div className="card">
        <div className="card-corner" />
        <div className="card-corner br" />

        <p className="eyebrow">Welcome back</p>
        <h1 className="heading">Sign In</h1>

        {error && <div className="error-banner">{error}</div>}

        <div className="field">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>

        <div className="field">
          <div className="field-row">
            <label>Password</label>
            <button
              className="forgot-link"
              onClick={() => alert("Reset flow here")}
            >
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" /> Signing in…
            </>
          ) : (
            "Sign In →"
          )}
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <p className="footer-text">
          Don't have an account?{" "}
          {/* Link replaces the old <a onClick={() => alert(...)}> */}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
