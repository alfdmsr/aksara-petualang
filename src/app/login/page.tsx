"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    alert(error ? error.message : "Login berhasil!");
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h1>Login</h1>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 8, margin: "8px 0" }}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 8, margin: "8px 0" }}
      />
      <button onClick={signIn} style={{ width: "100%", padding: 10 }}>
        Sign In
      </button>
    </div>
  );
}
