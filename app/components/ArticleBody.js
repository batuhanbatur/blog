"use client"

import { useEffect, useRef } from "react"
import RichText from "./RichText"
import { markAsRead } from "../lib/lastSeen"

export default function ArticleBody({ content, shouldContinue, postId }) {
  const continueRef = useRef(null)

  useEffect(() => {
    if (postId) {
      markAsRead(postId)
      window.dispatchEvent(new Event("article-opened"))
    }
  }, [postId])

  useEffect(() => {
    if (!shouldContinue || !continueRef.current) return
    continueRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    continueRef.current.style.backgroundColor = "rgba(180, 150, 100, 0.12)"
    continueRef.current.style.borderLeft = "2px solid rgba(180, 150, 100, 0.4)"
    continueRef.current.style.paddingLeft = "12px"
    continueRef.current.style.transition =
      "background-color 2s ease, border-color 2s ease, padding-left 2s ease"
    setTimeout(() => {
      if (continueRef.current) {
        continueRef.current.style.backgroundColor = "transparent"
        continueRef.current.style.borderLeft = "2px solid transparent"
        continueRef.current.style.paddingLeft = "0px"
      }
      window.history.replaceState({}, "", window.location.pathname)
    }, 2000)
  }, [shouldContinue])

  const paragraphs = content.split("\n\n")

  return (
    <div
      style={{
        fontSize: "16px",
        lineHeight: "1.8",
        color: "#1D1D0C",
        fontFamily: "Satoshi, sans-serif",
      }}
    >
      {paragraphs.map((paragraph, index) => (
        <div
          key={index}
          ref={shouldContinue && index === 1 ? continueRef : null}
          style={{ marginBottom: "24px" }}
        >
          <RichText content={paragraph} />
        </div>
      ))}
    </div>
  )
}
