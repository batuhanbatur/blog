"use client"

import { useState } from "react"

export default function TagWithTooltip({ value, label }) {
  const [hovered, setHovered] = useState(false)

  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#1D1D0C",
            color: "#CCC6B8",
            fontSize: "9px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: "3px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            opacity: 0.85,
          }}
        >
          {label}
        </span>
      )}
      <span
        style={{
          fontSize: "9px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#FFFFFF",
          backgroundColor: "#4C495A",
          padding: "2px 8px",
          clipPath:
            "polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)",
          display: "inline-block",
        }}
      >
        {value}
      </span>
    </span>
  )
}
