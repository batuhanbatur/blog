"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import RichText from "./RichText"
import TagWithTooltip from "../components/TagWithTooltip"

export default function ArticleCard({ post }) {
  const [buttonState, setButtonState] = useState("default")

  const buttonLabels = {
    default: "Keep Reading ↓",
    hover: "Yes, you should ↓",
    clicked: "There you go ↓",
  }

  const router = useRouter()

  const handleClick = () => {
    setButtonState("clicked")
    setTimeout(() => {
      router.push(`/articles/${post.slug}?continue=1`)
    }, 30)
  }
  return (
    <div
      style={{
        paddingBottom: "32px",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontFamily: "Satoshi, sans-serif",
          fontWeight: "900",
          color: "#1D1D0C",
          margin: "0 0 8px 0",
          lineHeight: "1.2",
          cursor: "pointer",
        }}
      >
        {post.title}
      </h2>

      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "12px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {[
          { value: post.language_tag, label: "Language" },
          ...(post.tone_tags || []).map(t => ({ value: t, label: "Tone" })),
        ].map(({ value, label }) => (
          <TagWithTooltip key={`${label}:${value}`} value={value} label={label} />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#1D1D0C", opacity: 0.4 }}>
          {post.date}
        </span>
        <span style={{ fontSize: "12px", color: "#1D1D0C", opacity: 0.4 }}>
          {post.reading_time} read
        </span>
      </div>

      <div
        style={{
          fontSize: "15px",
          lineHeight: "1.7",
          color: "#1D1D0C",
          opacity: 0.7,
          margin: "0 0 24px 0",
        }}
      >
        <RichText content={post.content.split("\n\n")[0]} />
      </div>
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <span
          onClick={handleClick}
          onMouseEnter={() => {
            if (buttonState !== "clicked") setButtonState("hover")
          }}
          onMouseLeave={() => {
            if (buttonState !== "clicked") setButtonState("default")
          }}
          style={{
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#1D1D0C",
            opacity: 0.5,
            cursor: "pointer",
          }}
        >
          {buttonLabels[buttonState]}
        </span>
      </div>
    </div>
  )
}
