"use client"

import { useState } from "react"

const inputStyle = {
  width: "100%",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(29, 29, 12, 0.2)",
  padding: "12px 0",
  color: "#1D1D0C",
  fontFamily: "monospace",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
}

const labelStyle = {
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#1D1D0C",
  opacity: 0.4,
  display: "block",
  marginBottom: "4px",
}

const directLinkStyle = {
  fontSize: "12px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#1D1D0C",
  opacity: 0.4,
  textDecoration: "none",
}

const topics = [
  { value: "general", label: "General" },
  {
    value: "article-tattoo",
    label: "Article — How did my tattoo become one of my worst regrets?",
  },
]

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [topic, setTopic] = useState("general")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Name, email and message are required.")
      return
    }

    const res = await fetch("https://formspree.io/f/xykvlyzg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, topic, message }),
    })

    if (res.ok) {
      setSubmitted(true)
      setName("")
      setEmail("")
      setTopic("general")
      setMessage("")
      setError(null)
    } else {
      setError("Something went wrong. Try emailing directly.")
    }
  }

  return (
    <main
      className="contact-main"
      style={{
        maxWidth: "580px",
        margin: "0 auto",
        padding: "80px 24px",
        fontFamily: "Satoshi, sans-serif",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .contact-main { padding: 48px 20px !important; }
          .contact-title { font-size: 36px !important; }
          .contact-card { padding: 20px !important; }
          .contact-actions { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <h1
        className="contact-title"
        style={{
          fontSize: "48px",
          fontWeight: "800",
          fontFamily: "Tanker, sans-serif",
          color: "#1D1D0C",
          lineHeight: "1.0",
          margin: "0 0 16px 0",
        }}
      >
        CONTACT
      </h1>

      <p
        style={{
          fontSize: "14px",
          color: "#1D1D0C",
          opacity: 0.5,
          margin: "0 0 48px 0",
          lineHeight: "1.6",
        }}
      >
        {"You've got something to say? This is the place."}
      </p>

      {submitted ? (
        <div
          style={{
            backgroundColor: "#CFCDD2",
            borderRadius: "8px",
            padding: "24px",
            fontFamily: "monospace",
          }}
        >
          <p style={{ fontSize: "16px", color: "#1D1D0C", margin: 0 }}>
            {
              "Message received. Thank you for your time. I'll see if I can respond to that."
            }
          </p>
        </div>
      ) : (
        <div
          className="contact-card"
          style={{
            backgroundColor: "#CFCDD2",
            borderRadius: "8px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          {error && (
            <p style={{ fontSize: "13px", color: "#c0392b", margin: 0 }}>
              {error}
            </p>
          )}

          <div>
            <label style={labelStyle}>Name or nickname (required)</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Excalibur666"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email (required)</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="reachMe@ifNeeded.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Topic</label>
            <select
              value={topic}
              onChange={e => setTopic(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {topics.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              style={{ ...inputStyle, resize: "none", lineHeight: "1.7" }}
            />
          </div>

          <div
            className="contact-actions"
            style={{ display: "flex", alignItems: "center", gap: "24px" }}
          >
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#1D1D0C",
                color: "#CCC6B8",
                border: "none",
                borderRadius: "4px",
                padding: "12px 32px",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "Satoshi, sans-serif",
                fontWeight: "600",
              }}
            >
              Send
            </button>
            <a href="mailto:batu@batuhanbatur.com" style={directLinkStyle}>
              or email directly →
            </a>
          </div>
        </div>
      )}
    </main>
  )
}
