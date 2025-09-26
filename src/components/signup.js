import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await signupUser(form);
      setMessage("Signup successful! Logging you in...");
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("user", JSON.stringify({ _id: res.data._id, name: res.data.name, email: res.data.email }));
      setTimeout(() => navigate("/"), 700);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create account</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Full name"
          required
          className="border p-2 w-full rounded"
        />
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
          placeholder="Password (min 6 chars)"
          required
          className="border p-2 w-full rounded"
        />
        <button disabled={loading} className="w-full p-2 bg-green-600 text-white rounded">
          {loading ? "Creating…" : "Sign up"}
        </button>
      </form>

      <p className="mt-4">
        Already have an account? <Link to="/" className="text-blue-600">Login</Link>
      </p>

      {message && <div className="mt-4 p-2 bg-gray-100 rounded">{message}</div>}
    </div>
  );
}
