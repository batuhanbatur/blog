"use client"

import { useState, useRef, useEffect } from "react"
import { supabase } from "../lib/supabase"

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

export default function ArticleWord({ phrase, slug }) {
  const [visible, setVisible] = useState(false)
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(false)
  const leaveTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
    }
  }, [])

  const clearLeaveTimer = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }

  const scheduleClose = () => {
    clearLeaveTimer()
    leaveTimer.current = setTimeout(() => setVisible(false), 100)
  }

  const handleMouseEnter = async () => {
    clearLeaveTimer()
    setVisible(true)
    if (!article && !loading) {
      setLoading(true)
      const { data } = await supabase
        .from("articles")
        .select("title, excerpt, hover_description")
        .eq("slug", slug)
        .single()
      setArticle(data || null)
      setLoading(false)
    }
  }

  const displayText =
    article?.hover_description ||
    (article?.excerpt
      ? article.excerpt.slice(0, 100) +
        (article.excerpt.length > 100 ? "..." : "")
      : null)

  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={scheduleClose}
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
          width: "280px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
        onMouseEnter={clearLeaveTimer}
        onMouseLeave={scheduleClose}
      >
        {loading || !article ? (
          <span
            style={{
              display: "block",
              height: "12px",
              backgroundColor: "rgba(29,29,12,0.1)",
              borderRadius: "2px",
              width: "60%",
            }}
          />
        ) : (
          <>
            <span
              style={{
                display: "block",
                fontFamily: "Tanker, sans-serif",
                fontSize: "16px",
                color: "#1D1D0C",
                margin: "0 0 8px 0",
              }}
            >
              {article.title}
            </span>
            {displayText && (
              <span
                style={{
                  display: "block",
                  fontFamily: "Satoshi, sans-serif",
                  fontSize: "12px",
                  color: "#1D1D0C",
                  opacity: 0.7,
                  margin: "0 0 16px 0",
                  lineHeight: "1.5",
                }}
              >
                {displayText}
              </span>
            )}
            <span style={{ display: "flex", gap: "8px" }}>
              <a
                href={`/articles/${slug}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#1D1D0C",
                  border: "1px solid rgba(29,29,12,0.25)",
                  borderRadius: "3px",
                  padding: "5px 10px",
                  textDecoration: "none",
                  fontFamily: "Satoshi, sans-serif",
                }}
              >
                Check it out
              </a>
              <button
                onClick={() => setVisible(false)}
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#1D1D0C",
                  border: "1px solid rgba(29,29,12,0.25)",
                  borderRadius: "3px",
                  padding: "5px 10px",
                  background: "none",
                  cursor: "pointer",
                  fontFamily: "Satoshi, sans-serif",
                }}
              >
                No thanks
              </button>
            </span>
          </>
        )}
        {svgConnector}
      </span>
    </span>
  )
}
