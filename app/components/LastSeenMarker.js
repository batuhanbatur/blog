"use client"

export default function LastSeenMarker() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "32px 0",
      opacity: 0.55,
    }}>
      <div style={{ flex: 1, height: "1px", backgroundColor: "#1D1D0C", opacity: 0.2 }} />
      <span style={{
        fontSize: "12px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontFamily: "Satoshi, sans-serif",
        color: "#1D1D0C",
        whiteSpace: "nowrap",
      }}>
        Where you left off
      </span>
      <div style={{ flex: 1, height: "1px", backgroundColor: "#1D1D0C", opacity: 0.2 }} />
    </div>
  )
}
