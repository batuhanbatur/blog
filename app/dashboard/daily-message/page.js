"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function DailyMessageDashboard() {
  const [quote, setQuote] = useState("")
  const [attribution, setAttribution] = useState("")
  const [messages, setMessages] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("daily_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setMessages(data)
  }

  const handleSubmit = async () => {
    if (!quote.trim() || !attribution.trim()) {
      setError("Quote and attribution are required.")
      return
    }

    // deactivate all
    await supabase
      .from("daily_messages")
      .update({ active: false })
      .neq("id", "00000000-0000-0000-0000-000000000000")

    // check if quote already exists
    const { data: existing } = await supabase
      .from("daily_messages")
      .select("*")
      .eq("quote", quote.trim())
      .single()

    if (existing) {
      // reactivate existing
      await supabase
        .from("daily_messages")
        .update({ active: true, date: new Date().toISOString().split("T")[0] })
        .eq("id", existing.id)
    } else {
      // insert new
      const { error } = await supabase.from("daily_messages").insert([
        {
          quote: quote.trim(),
          attribution: attribution.trim(),
          active: true,
          date: new Date().toISOString().split("T")[0],
        },
      ])
      if (error) {
        setError(error.message)
        return
      }
    }

    setSubmitted(true)
    setQuote("")
    setAttribution("")
    setError(null)
    fetchMessages()
    setTimeout(() => setSubmitted(false), 2000)
  }

  const handleActivate = async id => {
    await supabase
      .from("daily_messages")
      .update({ active: false })
      .neq("id", "00000000-0000-0000-0000-000000000000")

    await supabase.from("daily_messages").update({ active: true }).eq("id", id)

    fetchMessages()
  }

  const inputStyle = {
    width: "100%",
    backgroundColor: "rgba(204, 198, 184, 0.05)",
    border: "1px solid rgba(204, 198, 184, 0.15)",
    borderRadius: "6px",
    padding: "10px 14px",
    color: "#CCC6B8",
    fontFamily: "Satoshi, sans-serif",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  }

  const labelStyle = {
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    opacity: 0.4,
    marginBottom: "6px",
    display: "block",
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
            Daily Message
          </h1>
        </div>

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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <div>
            <label style={labelStyle}>Quote</label>
            <input
              value={quote}
              onChange={e => setQuote(e.target.value)}
              placeholder={'"You\'re gonna carry that weight."'}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Attribution</label>
            <input
              value={attribution}
              onChange={e => setAttribution(e.target.value)}
              placeholder="Cowboy Bebop"
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
              {submitted ? "Set ✓" : "Set as Today's Message"}
            </button>
          </div>
        </div>

        <div>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.3,
              marginBottom: "16px",
            }}
          >
            Archive
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  backgroundColor: msg.active
                    ? "rgba(204, 198, 184, 0.08)"
                    : "rgba(204, 198, 184, 0.03)",
                  border: `1px solid ${msg.active ? "rgba(204, 198, 184, 0.3)" : "rgba(204, 198, 184, 0.1)"}`,
                  borderRadius: "6px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div>
                  <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>
                    "{msg.quote}"
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", opacity: 0.4 }}>
                    — {msg.attribution}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexShrink: 0,
                  }}
                >
                  {msg.active && (
                    <span
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        opacity: 0.5,
                      }}
                    >
                      Active
                    </span>
                  )}
                  {!msg.active && (
                    <button
                      onClick={() => handleActivate(msg.id)}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid rgba(204, 198, 184, 0.2)",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        fontSize: "11px",
                        color: "#CCC6B8",
                        cursor: "pointer",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Activate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
