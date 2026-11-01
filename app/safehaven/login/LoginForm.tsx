"use client";

import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/safehaven/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/safehaven";
      return;
    }
    setBusy(false);
    setError(res.status === 401 ? "That password doesn't match. Try again." : "Something went wrong. Please try again.");
  }

  return (
    <form onSubmit={onSubmit} className="sh-form">
      <label className="sh-field">
        <span>Password</span>
        <input type="password" name="password" autoComplete="current-password" required autoFocus />
      </label>
      {error && (
        <p className="sh-error" role="alert">
          {error}
        </p>
      )}
      <button className="sh-btn sh-btn--primary" disabled={busy}>
        {busy ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
