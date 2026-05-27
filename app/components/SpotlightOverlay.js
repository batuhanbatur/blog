"use client"

import { useState, useEffect } from "react"

export default function SpotlightOverlay() {
  const [spotlightActive, setSpotlightActive] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.scrollY < 50) {
        setSpotlightActive(true)
      }
    }, 5000)

    const handleInteraction = () => setSpotlightActive(false)

    window.addEventListener("scroll", handleInteraction)
    window.addEventListener("click", handleInteraction)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleInteraction)
      window.removeEventListener("click", handleInteraction)
    }
  }, [])

  if (!spotlightActive) return null

  return (
    <div
      onClick={() => setSpotlightActive(false)}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 50,
        animation: "fadeIn 0.8s ease forwards",
        pointerEvents: "all",
      }}
    />
  )
}
