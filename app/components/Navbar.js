"use client"

import { useState, useEffect } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      style={{
        backgroundColor: "#1D1D0C",
        height: "56px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "24px",
        paddingRight: "24px",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        opacity: scrolled ? 0.85 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <div style={{ width: "32px", height: "32px", flexShrink: 0 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <defs>
            <filter id="g" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g
            filter="url(#g)"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="square"
            strokeLinejoin="miter"
            fill="none"
          >
            <line x1="14.5" y1="3" x2="14.5" y2="29" />
            <line x1="17.5" y1="3" x2="17.5" y2="29" />
            <path d="M14.5 3 L5 11 L14.5 16" />
            <path d="M14.5 16 L5 24 L14.5 29" />
            <path d="M17.5 3 L27 11 L17.5 16" />
            <path d="M17.5 16 L27 24 L17.5 29" />
          </g>
        </svg>
      </div>

      <ul
        style={{
          display: "flex",
          gap: "32px",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <a
            href="#"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "13px",
              letterSpacing: "0.1em",
            }}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "13px",
              letterSpacing: "0.1em",
            }}
          >
            Articles
          </a>
        </li>
        <li>
          <a
            href="#"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "13px",
              letterSpacing: "0.1em",
            }}
          >
            Archive
          </a>
        </li>
        <li>
          <a
            href="/about"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "13px",
              letterSpacing: "0.1em",
            }}
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "13px",
              letterSpacing: "0.1em",
            }}
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  )
}
