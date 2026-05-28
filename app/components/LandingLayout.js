"use client"

import { useState, useEffect } from "react"

export default function LandingLayout({ quote, attribution }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  if (isMobile) {
    return (
      <section style={{ padding: "40px 24px 48px" }}>
        <h1
          style={{
            fontWeight: "800",
            lineHeight: "1.0",
            color: "#1D1D0C",
            margin: "0 0 24px 0",
            fontFamily: "Tanker, sans-serif",
            fontSize: "52px",
            textAlign: "center",
          }}
        >
          THINGS I COULDN&apos;T
          <br />
          KEEP TO MYSELF.
        </h1>

        <div
          style={{
            width: "200px",
            margin: "0 auto 24px auto",
            lineHeight: 0,
          }}
        >
          <img
            src="/profile.jpg"
            alt="Batuhan Batur"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "4px",
            }}
          />
        </div>

        <p
          style={{
            fontSize: "14px",
            color: "#1D1D0C",
            opacity: 0.6,
            margin: "0 0 40px 0",
            lineHeight: "1.6",
            fontFamily: "Satoshi, sans-serif",
            textAlign: "center",
          }}
        >
          Built by me. Written by me. Shaped by whatever matters to me.
        </p>

        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#1D1D0C",
              opacity: 0.4,
              margin: "0 0 8px 0",
              fontFamily: "Satoshi, sans-serif",
            }}
          >
            Daily Message
          </p>
          <div
            style={{
              width: "24px",
              height: "1px",
              backgroundColor: "#1D1D0C",
              opacity: 0.3,
              margin: "0 auto 16px auto",
            }}
          />
          <p
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1D1D0C",
              lineHeight: "1.3",
              margin: "0 0 8px 0",
              fontFamily: "Tanker, sans-serif",
            }}
          >
            &ldquo;{quote}&rdquo;
          </p>
          <p
            style={{
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#1D1D0C",
              opacity: 0.6,
              margin: 0,
              fontFamily: "Aktura, sans-serif",
            }}
          >
            — {attribution}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      style={{
        padding: "80px 64px 64px 64px",
        minHeight: "60vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "80px",
        }}
      >
        <div
          style={{
            width: "500px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "520px",
          }}
        >
          <div>
            <h1
              style={{
                fontWeight: "800",
                letterSpacing: "-0.02em",
                lineHeight: "1.0",
                color: "#1D1D0C",
                margin: "0 0 16px 0",
                fontFamily: "Tanker, sans-serif",
                fontSize: "80px",
              }}
            >
              THINGS I COULDN&apos;T
              <br />
              KEEP TO MYSELF.
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#1D1D0C",
                opacity: 0.6,
                margin: "0",
                lineHeight: "1.6",
                fontFamily: "Satoshi, sans-serif",
              }}
            >
              Built by me. Written by me. Shaped by whatever matters to me.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#1D1D0C",
                opacity: 0.4,
                margin: "0 0 8px 0",
                fontFamily: "Satoshi, sans-serif",
              }}
            >
              Daily Message
            </p>
            <div
              style={{
                width: "24px",
                height: "1px",
                backgroundColor: "#1D1D0C",
                opacity: 0.3,
                margin: "0 auto 16px auto",
              }}
            />
            <p
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1D1D0C",
                lineHeight: "1.3",
                margin: "0 0 8px 0",
                fontFamily: "Tanker, sans-serif",
              }}
            >
              &ldquo;{quote}&rdquo;
            </p>
            <p
              style={{
                fontSize: "14px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#1D1D0C",
                opacity: 0.6,
                margin: 0,
                fontFamily: "Aktura, sans-serif",
              }}
            >
              — {attribution}
            </p>
          </div>
        </div>

        <div
          style={{
            width: "340px",
            height: "520px",
            flexShrink: 0,
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <img
            src="/profile.jpg"
            alt="Batuhan Batur"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        </div>
      </div>
    </section>
  )
}
