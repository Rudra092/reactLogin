import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await loginUser(form);
      // save token and user info
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("user", JSON.stringify({ _id: res.data._id, name: res.data.name, email: res.data.email }));
      setMessage("Login successful — redirecting...");
      // redirect to a protected route or home
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="border p-2 w-full rounded"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="border p-2 w-full rounded"
        />
        <button disabled={loading} className="w-full p-2 bg-blue-600 text-white rounded">
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>

      <div className="mt-4 space-y-2">
        <p>
          Don't have an account? <Link to="/signup" className="text-blue-600">Sign up</Link>
        </p>
        <p>
          <Link to="/forgot-password" className="text-blue-600">Forgot password?</Link>
        </p>
      </div>

      {message && <div className="mt-4 p-2 bg-gray-100 rounded">{message}</div>}
    </div>
  );
}
