"use client"

import { useState, useEffect } from "react"

const links = [
  { href: "/", label: "Home" },
  { href: "/#timeline", label: "Articles" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setMenuOpen(false)
      setScrolled(window.scrollY > 20)
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setMenuOpen(false)
    }

    handleResize()
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
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
          zIndex: 200,
          opacity: menuOpen ? 1 : scrolled ? 0.85 : 1,
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

        {!isMobile && (
          <ul
            style={{
              display: "flex",
              gap: "32px",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "13px",
                    letterSpacing: "0.1em",
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {isMobile && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {menuOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <line x1="3" y1="3" x2="19" y2="19" />
                <line x1="19" y1="3" x2="3" y2="19" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <line x1="2" y1="6" x2="20" y2="6" />
                <line x1="2" y1="11" x2="20" y2="11" />
                <line x1="2" y1="16" x2="20" y2="16" />
              </svg>
            )}
          </button>
        )}
      </nav>

      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "55px",
            left: 0,
            right: 0,
            backgroundColor: "#1D1D0C",
            zIndex: 199,
            animation: "fadeIn 0.15s ease forwards",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
            {links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    color: "white",
                    textDecoration: "none",
                    fontSize: "13px",
                    letterSpacing: "0.1em",
                    padding: "12px 24px",
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
