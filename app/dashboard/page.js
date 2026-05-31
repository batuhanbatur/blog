"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabase"

export default function Dashboard() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/dashboard/login")
      } else {
        setChecking(false)
      }
    }
    checkAuth()
  }, [])

  if (checking) return null

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#1D1D0C",
        color: "#CCC6B8",
        padding: "48px",
        fontFamily: "Satoshi, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "48px",
            paddingBottom: "24px",
            borderBottom: "1px solid rgba(204, 198, 184, 0.1)",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              fontFamily: "Satoshi, sans-serif",
              margin: 0,
            }}
          >
            {"Say something nice."}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                fontSize: "12px",
                opacity: 0.4,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              the-blog
            </span>
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                router.push("/dashboard/login")
              }}
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgba(204, 198, 184, 0.2)",
                borderRadius: "4px",
                padding: "6px 14px",
                fontSize: "11px",
                color: "#CCC6B8",
                cursor: "pointer",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "Satoshi, sans-serif",
                opacity: 0.6,
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(204, 198, 184, 0.05)",
              border: "1px solid rgba(204, 198, 184, 0.1)",
              borderRadius: "8px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "600",
                margin: "0 0 8px 0",
                opacity: 0.8,
              }}
            >
              Articles
            </h2>
            <p style={{ fontSize: "12px", opacity: 0.4, margin: "0 0 16px 0" }}>
              Manage your long-form content
            </p>
            <a
              href="/dashboard/articles"
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#CCC6B8",
                opacity: 0.6,
                textDecoration: "none",
              }}
            >
              Open →
            </a>
          </div>

          <div
            style={{
              backgroundColor: "rgba(204, 198, 184, 0.05)",
              border: "1px solid rgba(204, 198, 184, 0.1)",
              borderRadius: "8px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "600",
                margin: "0 0 8px 0",
                opacity: 0.8,
              }}
            >
              Status Updates
            </h2>
            <p style={{ fontSize: "12px", opacity: 0.4, margin: "0 0 16px 0" }}>
              Post quick thoughts
            </p>
            <a
              href="/dashboard/status"
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#CCC6B8",
                opacity: 0.6,
                textDecoration: "none",
              }}
            >
              Open →
            </a>
          </div>

          <div
            style={{
              backgroundColor: "rgba(204, 198, 184, 0.05)",
              border: "1px solid rgba(204, 198, 184, 0.1)",
              borderRadius: "8px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "600",
                margin: "0 0 8px 0",
                opacity: 0.8,
              }}
            >
              Daily Message
            </h2>
            <p style={{ fontSize: "12px", opacity: 0.4, margin: "0 0 16px 0" }}>
              Set today's quote
            </p>
            <a
              href="/dashboard/daily-message"
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#CCC6B8",
                opacity: 0.6,
                textDecoration: "none",
              }}
            >
              Open →
            </a>
          </div>

          <div
            style={{
              backgroundColor: "rgba(204, 198, 184, 0.05)",
              border: "1px solid rgba(204, 198, 184, 0.1)",
              borderRadius: "8px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "600",
                margin: "0 0 8px 0",
                opacity: 0.8,
              }}
            >
              Archive
            </h2>
            <p style={{ fontSize: "12px", opacity: 0.4, margin: "0 0 16px 0" }}>
              Browse all content
            </p>
            <a
              href="/dashboard/archive"
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#CCC6B8",
                opacity: 0.6,
                textDecoration: "none",
              }}
            >
              Open →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
