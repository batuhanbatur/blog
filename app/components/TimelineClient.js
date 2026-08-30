"use client"

import { useEffect, useState } from "react"
import { getReadIds } from "../lib/lastSeen"
import ArticleCard from "./ArticleCard"
import StatusUpdateWrapper from "./StatusUpdateWrapper"
import SwordDivider from "./SwordDivider"
import LastSeenMarker from "./LastSeenMarker"

export default function TimelineClient({ allPosts }) {
  const [firstUnreadIndex, setFirstUnreadIndex] = useState(null)
  const [activeTag, setActiveTag] = useState(null)

  useEffect(() => {
    const readIds = getReadIds()
    if (readIds.length === 0) return
    const index = allPosts.findIndex(post => !readIds.includes(post.id))
    if (index > 0) setFirstUnreadIndex(index)
  }, [allPosts])

  let statusCounter = 0

  const tags = [
    ...new Set(
      allPosts.filter(p => p.type === "status").flatMap(p => p.tags || [])
    ),
  ]

  const visiblePosts = activeTag
    ? allPosts.filter(
        p => p.type === "status" && (p.tags || []).includes(activeTag)
      )
    : allPosts

  const pillStyle = active => ({
    borderRadius: "999px",
    padding: "6px 16px",
    fontSize: "11px",
    letterSpacing: "0.08em",
    border: active ? "1px solid #1D1D0C" : "1px solid rgba(29, 29, 12, 0.25)",
    backgroundColor: active ? "#1D1D0C" : "transparent",
    color: active ? "#CCC6B8" : "#1D1D0C",
    cursor: "pointer",
    fontFamily: "Satoshi, sans-serif",
    transition: "background-color 0.15s, color 0.15s",
  })

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {tags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={() => setActiveTag(null)}
            style={{ ...pillStyle(activeTag === null), textTransform: "uppercase" }}
          >
            All
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              style={{ ...pillStyle(activeTag === tag), textTransform: "none" }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {activeTag && visiblePosts.length === 0 && (
        <p style={{ opacity: 0.4, fontSize: "13px", fontFamily: "Satoshi, sans-serif" }}>
          Nothing here yet.
        </p>
      )}

      {visiblePosts.map((post, index) => {
        const isLast = index === visiblePosts.length - 1
        let item = null

        if (post.type === "article") {
          statusCounter = 0
          item = <ArticleCard key={post.id} post={post} />
        }

        if (post.type === "status") {
          const isRight = statusCounter % 2 !== 0
          statusCounter++
          item = (
            <div
              key={post.id}
              className="tl-status-row"
              style={{ display: "flex", justifyContent: isRight ? "flex-end" : "flex-start" }}
            >
              <div className="tl-status-card" style={{ width: "60%" }}>
                <StatusUpdateWrapper post={post} />
              </div>
            </div>
          )
        }

        return (
          <div key={post.id}>
            {activeTag === null && index === firstUnreadIndex && <LastSeenMarker />}
            <div style={{ padding: "48px 0" }}>{item}</div>
            {!isLast && <SwordDivider />}
          </div>
        )
      })}
    </div>
  )
}
