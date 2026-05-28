"use client"

import { useState } from "react"

const svgConnector = (
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
)

export default function WordCard({ phrase, explanation, phonemic }) {
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
          padding: "16px",
          zIndex: 100,
          pointerEvents: "none",
          width: "260px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "Satoshi, sans-serif",
            fontSize: "14px",
            fontWeight: "600",
            color: "#1D1D0C",
            margin: "0 0 4px 0",
          }}
        >
          {phrase}
        </span>
        {phonemic && (
          <span
            style={{
              display: "block",
              fontFamily: "monospace",
              fontSize: "12px",
              color: "#1D1D0C",
              opacity: 0.5,
              margin: "0 0 10px 0",
            }}
          >
            {phonemic}
          </span>
        )}
        <span
          style={{
            display: "block",
            borderTop: "1px solid rgba(29,29,12,0.1)",
            margin: "0 0 10px 0",
          }}
        />
        <span
          style={{
            display: "block",
            fontFamily: "Satoshi, sans-serif",
            fontSize: "13px",
            color: "#1D1D0C",
            opacity: 0.8,
            lineHeight: "1.6",
          }}
        >
          {explanation}
        </span>
        {svgConnector}
      </span>
    </span>
  )
}
