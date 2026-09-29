"use client"

import { useState } from "react"
import { useNearViewport } from "../lib/useNearViewport"

function getPosterUrl(url) {
  return url.replace(/\.[^./]+$/, ".jpg")
}

export default function VideoEmbed({ title, url, ambient }) {
  const [containerRef, isNear] = useNearViewport({ rootMargin: "200px" })
  const [posterFailed, setPosterFailed] = useState(false)
  const posterUrl = getPosterUrl(url)

  if (!ambient) {
    return (
      <div
        style={{
          marginTop: "12px",
          marginBottom: "4px",
          borderRadius: "6px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <video
          src={url}
          poster={posterUrl}
          preload="none"
          controls
          controlsList="nodownload"
          style={{
            display: "block",
            maxHeight: "400px",
            borderRadius: "6px",
          }}
          aria-label={title}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        marginTop: "12px",
        marginBottom: "4px",
        borderRadius: "6px",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "711px",
          maxHeight: "400px",
          aspectRatio: "16 / 9",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        {isNear ? (
          <video
            src={url}
            autoPlay
            loop
            muted
            playsInline
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "6px",
            }}
            aria-label={title}
          />
        ) : posterFailed ? (
          <div
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              borderRadius: "6px",
              backgroundColor: "rgba(29, 29, 12, 0.08)",
            }}
          />
        ) : (
          <img
            src={posterUrl}
            alt={title || ""}
            onError={() => setPosterFailed(true)}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
        )}
      </div>
    </div>
  )
}
