import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await forgotPassword({ email });
      setMessage("If that email exists, a password reset link has been sent.");
      setEmail("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Forgot password</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Your account email"
          required
          className="border p-2 w-full rounded"
        />
        <button disabled={loading} className="w-full p-2 bg-yellow-500 text-white rounded">
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-4">
        Return to <Link to="/" className="text-blue-600">Login</Link>
      </p>

      {message && <div className="mt-4 p-2 bg-gray-100 rounded">{message}</div>}
    </div>
  );
}
