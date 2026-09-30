"use client"

import { useEffect, useRef, useState } from "react"
import { getReadIds } from "../lib/lastSeen"
import ArticleCard from "./ArticleCard"
import StatusUpdateWrapper from "./StatusUpdateWrapper"
import SwordDivider from "./SwordDivider"
import LastSeenMarker from "./LastSeenMarker"

export default function TimelineClient({ allPosts }) {
  const [firstUnreadIndex, setFirstUnreadIndex] = useState(null)
  const [activeTag, setActiveTag] = useState(null)
  const [allArticlesRead, setAllArticlesRead] = useState(false)
  const [spotlightMode, setSpotlightMode] = useState(null)
  const spotlightRef = useRef(null)
  const cueRef = useRef(null)
  const timerRef = useRef(null)
  const modeRef = useRef(null)
  const doneRef = useRef(false)

  useEffect(() => {
    const readIds = getReadIds()
    if (readIds.length === 0) return
    const index = allPosts.findIndex(post => !readIds.includes(post.id))
    if (index > 0) setFirstUnreadIndex(index)

    const articles = allPosts.filter(post => post.type === "article")
    if (
      articles.length > 0 &&
      articles.every(post => readIds.includes(post.id))
    ) {
      setAllArticlesRead(true)
    }
  }, [allPosts])

  useEffect(() => {
    if (!spotlightRef.current) return

    const setMode = mode => {
      modeRef.current = mode
      setSpotlightMode(mode)
    }
    const stop = () => {
      clearTimeout(timerRef.current)
      doneRef.current = true
      setMode(null)
    }

    timerRef.current = setTimeout(() => {
      const target = spotlightRef.current
      if (doneRef.current || !target || window.scrollY >= 50) return
      const focused = document.activeElement
      const focusElsewhere =
        focused && focused !== document.body && !target.contains(focused)
      if (focusElsewhere) return
      const rect = target.getBoundingClientRect()
      setMode(rect.top < window.innerHeight ? "spotlight" : "cue")
    }, 5000)

    const onKeyDown = e => {
      if (!modeRef.current || e.key === "Escape") stop()
    }
    const onFocusIn = e => {
      if (!modeRef.current) return stop()
      const inside =
        spotlightRef.current?.contains(e.target) ||
        cueRef.current?.contains(e.target)
      if (!inside) stop()
    }

    window.addEventListener("scroll", stop)
    window.addEventListener("click", stop)
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("focusin", onFocusIn)
    return () => {
      clearTimeout(timerRef.current)
      window.removeEventListener("scroll", stop)
      window.removeEventListener("click", stop)
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("focusin", onFocusIn)
    }
  }, [])

  const handleCueClick = () => {
    clearTimeout(timerRef.current)
    doneRef.current = true
    modeRef.current = null
    setSpotlightMode(null)
    spotlightRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

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

  const renderSpotlight = (children, withBackdrop) => (
    <div
      ref={spotlightRef}
      style={{
        position: "relative",
        zIndex: spotlightMode === "spotlight" ? 41 : "auto",
      }}
    >
      {withBackdrop && spotlightMode === "spotlight" && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-16px",
            backgroundColor: "#CCC6B8",
            borderRadius: "8px",
            zIndex: -1,
          }}
        />
      )}
      {children}
    </div>
  )

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

      {spotlightMode === "spotlight" && activeTag === null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 40,
            animation: "fadeIn 0.8s ease forwards",
          }}
        />
      )}

      {spotlightMode === "cue" && activeTag === null && (
        <button
          ref={cueRef}
          onClick={handleCueClick}
          style={{
            ...pillStyle(true),
            textTransform: "uppercase",
            position: "fixed",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 42,
            whiteSpace: "nowrap",
            animation: "fadeIn 0.8s ease forwards",
          }}
        >
          Explore the posts ↓
        </button>
      )}

      {visiblePosts.map((post, index) => {
        const isLast = index === visiblePosts.length - 1
        const isSpotlit = index === 0 && activeTag === null
        let item = null

        if (post.type === "article") {
          statusCounter = 0
          const card = <ArticleCard key={post.id} post={post} />
          item = isSpotlit ? renderSpotlight(card, true) : card
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
                {isSpotlit ? (
                  renderSpotlight(<StatusUpdateWrapper post={post} />, false)
                ) : (
                  <StatusUpdateWrapper post={post} />
                )}
              </div>
            </div>
          )
        }

        return (
          <div key={post.id}>
            {activeTag === null && index === firstUnreadIndex && <LastSeenMarker />}
            <div style={{ padding: "24px 0" }}>{item}</div>
            {!isLast && <SwordDivider />}
          </div>
        )
      })}

      {activeTag === null && allArticlesRead && (
        <p
          style={{
            opacity: 0.5,
            fontSize: "13px",
            fontStyle: "italic",
            fontFamily: "Satoshi, sans-serif",
            textAlign: "center",
            padding: "32px 0 0 0",
          }}
        >
          There&apos;s nothing left to read. Thank you.
        </p>
      )}
    </div>
  )
}
