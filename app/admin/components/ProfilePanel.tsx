"use client";

import React, { useEffect, useState } from "react";

export default function ProfilePanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/validate");
        if (res.ok) {
          const d = await res.json();
          setEmail(d.user?.email || "");
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (password && password !== confirm) {
      setMessage({
        type: "error",
        text: "Password confirmation does not match",
      });
      return;
    }

    setLoading(true);

    try {
      const body: any = { email };
      if (password) body.password = password;

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const d = await res.json();

      if (res.ok) setMessage({ type: "success", text: "Profile updated" });
      else
        setMessage({
          type: "error",
          text: d?.error || "Failed to update profile",
        });
    } catch (e: any) {
      setMessage({
        type: "error",
        text: e?.message || "Network error",
      });
    } finally {
      setLoading(false);
      setPassword("");
      setConfirm("");
      setTimeout(() => setMessage(null), 3500);
    }
  }

  return (
    <div className="border border-slate-200 rounded-2xl p-6 max-w-lg">
      <h2 className="text-xl font-semibold mb-6">Profil Admin</h2>

      {/* Message */}
      {message && (
        <div
          className={`mb-5 p-3 rounded-lg text-sm border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm text-slate-600 mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-slate-600 mb-1">
            New password (leave blank to keep)
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Confirm */}
        <div>
          <label className="block text-sm text-slate-600 mb-1">
            Confirm password
          </label>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
