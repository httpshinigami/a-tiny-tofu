"use client";

import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <p className="text-ink-muted">
        Supabase is not configured. Copy <code>.env.example</code> to{" "}
        <code>.env.local</code> and add your project keys, then restart the dev
        server. You can still browse the public site with demo data at{" "}
        <Link href="/" className="text-coral underline">
          home
        </Link>
        .
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4">
      <div>
        <label className="kawaii-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="kawaii-input"
        />
      </div>
      <div>
        <label className="kawaii-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="kawaii-input"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <KawaiiButton type="submit" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </KawaiiButton>
    </form>
  );
}
