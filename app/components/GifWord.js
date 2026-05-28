"use client"

import { useState } from "react"

export default function GifWord({ phrase, gifUrl }) {
  const [visible, setVisible] = useState(false)

  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span style={{ fontStyle: "italic", cursor: "default" }}>{phrase}</span>
      <span
        style={{
          display: "block",
          position: "absolute",
          bottom: "calc(100% + 24px)",
          left: "0%",
          backgroundColor: "#BAB1A0",
          border: "1px solid rgba(29,29,12,0.15)",
          borderRadius: "4px",
          padding: "6px",
          zIndex: 100,
          pointerEvents: "none",
          width: "280px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <img
          src={gifUrl}
          style={{
            display: "block",
            borderRadius: "2px",
            width: "100%",
            height: "auto",
          }}
          alt={phrase}
        />

        <svg
          style={{
            position: "absolute",
            top: "100%",
            left: "8px",
            overflow: "visible",
            pointerEvents: "none",
          }}
          width="10"
          height="24"
        >
          <line
            x1="5"
            y1="0"
            x2="5"
            y2="20"
            stroke="rgba(29,29,12,0.25)"
            strokeWidth="0.75"
          />
          <circle
            cx="5"
            cy="23"
            r="2"
            fill="none"
            stroke="rgba(29,29,12,0.25)"
            strokeWidth="0.75"
          />
        </svg>
      </span>
    </span>
  )
}
