"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.")
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  const inputStyle = {
    width: "100%",
    backgroundColor: "rgba(204, 198, 184, 0.05)",
    border: "1px solid rgba(204, 198, 184, 0.15)",
    borderRadius: "6px",
    padding: "12px 16px",
    color: "#CCC6B8",
    fontFamily: "Satoshi, sans-serif",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#1D1D0C",
        color: "#CCC6B8",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
        fontFamily: "Satoshi, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px", padding: "48px" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "600",
            margin: "0 0 32px 0",
            textAlign: "center",
          }}
        >
          Dashboard
        </h1>

        {error && (
          <div
            style={{
              backgroundColor: "rgba(255, 100, 100, 0.1)",
              border: "1px solid rgba(255, 100, 100, 0.3)",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "24px",
              fontSize: "13px",
              color: "#ff6464",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            style={inputStyle}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={inputStyle}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: "#CCC6B8",
              color: "#1D1D0C",
              border: "none",
              borderRadius: "4px",
              padding: "12px",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Satoshi, sans-serif",
              fontWeight: "600",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </main>
  )
}
