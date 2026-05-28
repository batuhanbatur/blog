"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import RichText from "./RichText"

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
        {[post.language_tag, ...(post.tone_tags || [])].map(tag => (
          <span
            key={tag}
            style={{
              fontSize: "9px",
              marginTop: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              backgroundColor: "#4C495A",
              padding: "2px 8px",
              clipPath:
                "polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)",
            }}
          >
            {tag}
          </span>
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

      <p
        style={{
          fontSize: "15px",
          lineHeight: "1.7",
          color: "#1D1D0C",
          opacity: 0.7,
          margin: "0 0 24px 0",
        }}
      >
        <RichText content={post.content.split("\n\n")[0]} />
      </p>
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
