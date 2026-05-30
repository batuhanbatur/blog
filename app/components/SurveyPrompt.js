"use client"

export default function SurveyPrompt({ onParticipate, onDismiss }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 300,
        maxWidth: "280px",
        backgroundColor: "#CCC6B8",
        border: "1px solid rgba(29,29,12,0.15)",
        borderRadius: "6px",
        padding: "24px",
        fontFamily: "Satoshi, sans-serif",
        color: "#1D1D0C",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        animation: "fadeIn 0.4s ease forwards",
      }}
    >
      <p style={{ fontSize: "13px", fontStyle: "italic", opacity: 0.6, margin: "0 0 8px 0" }}>
        Seems like you&apos;ve been visiting quite a lot.
      </p>
      <p style={{ fontSize: "13px", lineHeight: "1.6", margin: "0 0 20px 0", opacity: 0.85 }}>
        I&apos;d love to collect some feedback if you&apos;d like to participate.
      </p>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button
          onClick={onParticipate}
          style={{
            backgroundColor: "#1D1D0C",
            color: "#CCC6B8",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Participate
        </button>
        <button
          onClick={onDismiss}
          style={{
            background: "none",
            border: "none",
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.4,
            cursor: "pointer",
            color: "#1D1D0C",
          }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
