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
      setMessage("✅ If that email exists, a password reset link has been sent.");
      setEmail("");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Enter your email address and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                         focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 px-4 bg-yellow-500 text-white font-semibold rounded-lg 
                       shadow-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 
                       transition disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Remember your password?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>

        {message && (
          <div
            className={`mt-6 p-3 text-center rounded-lg text-sm ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
