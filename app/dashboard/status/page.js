"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function StatusDashboard() {
  const [content, setContent] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!content.trim()) return

    const { error } = await supabase.from("status_updates").insert([
      {
        content: content.trim(),
        date: new Date().toISOString().split("T")[0],
      },
    ])

    if (error) {
      setError(error.message)
      return
    }

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setContent("")
      setError(null)
    }, 2000)
  }

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
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <a
            href="/dashboard"
            style={{
              fontSize: "12px",
              color: "#CCC6B8",
              opacity: 0.4,
              textDecoration: "none",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            ← Back
          </a>
          <h1 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
            New Status Update
          </h1>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "rgba(255, 100, 100, 0.1)",
              border: "1px solid rgba(255, 100, 100, 0.3)",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "16px",
              fontSize: "13px",
              color: "#ff6464",
            }}
          >
            {error}
          </div>
        )}

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's on your mind?"
          style={{
            width: "100%",
            minHeight: "160px",
            backgroundColor: "rgba(204, 198, 184, 0.05)",
            border: "1px solid rgba(204, 198, 184, 0.15)",
            borderRadius: "8px",
            padding: "16px",
            color: "#CCC6B8",
            fontFamily: "monospace",
            fontSize: "15px",
            lineHeight: "1.6",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          <span style={{ fontSize: "12px", opacity: 0.3 }}>
            {content.length} characters
          </span>

          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: submitted
                ? "rgba(204, 198, 184, 0.2)"
                : "#CCC6B8",
              color: "#1D1D0C",
              border: "none",
              borderRadius: "4px",
              padding: "10px 24px",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "Satoshi, sans-serif",
              fontWeight: "600",
            }}
          >
            {submitted ? "Posted ✓" : "Post"}
          </button>
        </div>
      </div>
    </main>
  )
}
