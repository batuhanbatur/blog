"use client"

import { useState } from "react"
import Image from "next/image"

const projects = [
  {
    id: "blog",
    name: "THE-BLOG",
    description: "A blog experience with some experimental features.",
    image: null,
    links: {
      tour: "https://batuhanbatur.com/tour",
      live: "https://batuhanbatur.com",
      github: "https://github.com/batuhanbatur/blog",
    },
  },
  {
    id: "pizza-god",
    name: "PIZZA GOD",
    description: "An imaginary pizza brand with a few unusual ideas.",
    image: "/pizza-god-logo.png",
    links: {
      tour: "https://batuhanbatur.com/tour/pizza-god",
      live: "https://pizza-god.batuhanbatur.com",
      github: "https://github.com/batuhanbatur/pizza-god",
    },
  },
]

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        backgroundColor: "#111",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "default",
        transition: "border-color 0.2s",
        borderColor: hovered
          ? "rgba(255,255,255,0.2)"
          : "rgba(255,255,255,0.08)",
      }}
    >
      {/* Card image area */}
      <div
        style={{
          height: "220px",
          backgroundColor: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name}
            width={180}
            height={180}
            style={{ objectFit: "contain", opacity: 0.9 }}
          />
        ) : (
          <Image
            src="/tour/landing.png"
            alt={project.name}
            fill
            sizes="400px"
            style={{ objectFit: "cover", objectPosition: "top", opacity: 0.85 }}
          />
        )}

        {/* Hover overlay */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "center",
              gap: "10px",
              padding: "24px",
            }}
          >
            {project.links.tour && (
              <LinkBtn href={project.links.tour}>Guided Tour</LinkBtn>
            )}
            {project.links.live && (
              <LinkBtn href={project.links.live}>Live Site</LinkBtn>
            )}
            {project.links.github && (
              <LinkBtn href={project.links.github}>GitHub</LinkBtn>
            )}
            {!project.links.live && !project.links.github && (
              <span
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.1em",
                }}
              >
                COMING SOON
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card footer */}
      <div style={{ padding: "16px 20px" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            color: "#FFFFFF",
            margin: "0 0 6px 0",
            fontFamily: "Satoshi, sans-serif",
          }}
        >
          {project.name}
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.45)",
            margin: 0,
            lineHeight: "1.5",
            fontFamily: "Satoshi, sans-serif",
          }}
        >
          {project.description}
        </p>
      </div>
    </div>
  )
}

function LinkBtn({ href, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: "10px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: hovered ? "#000000" : "#FFFFFF",
        backgroundColor: hovered ? "rgba(255,255,255,0.9)" : "transparent",
        border: "1px solid rgba(255,255,255,0.4)",
        borderRadius: "3px",
        padding: "14px 0",
        textDecoration: "none",
        fontFamily: "Satoshi, sans-serif",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
        width: "100%",
        textAlign: "center",
        display: "block",
      }}
    >
      {children}
    </a>
  )
}

export default function PortfolioPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        color: "#FFFFFF",
        fontFamily: "Satoshi, sans-serif",
        overscrollBehavior: "none",
      }}
    >
      <style>{"html, body { background: #000; }"}</style>
      <div
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          padding: "48px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <Image
          src="/BB-logo-glow.png"
          alt="BB Logo"
          width={220}
          height={220}
          style={{ marginBottom: "12px" }}
        />

        {/* Name */}
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: "0 0 12px 0",
            marginTop: "-20px",
            fontFamily: "Satoshi, sans-serif",
          }}
        >
          Batuhan Batur
        </h1>

        {/* Title */}
        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.05em",
            margin: "0 0 32px 0",
          }}
        >
          Frontend Developer focused on UI/UX and product thinking.
        </p>

        {/* Bio */}
        <p
          style={{
            fontSize: "15px",
            lineHeight: "1.8",
            color: "rgba(255,255,255,0.65)",
            maxWidth: "520px",
            margin: "0 0 48px 0",
          }}
        >
          Linguistics graduate. Seven years at Apple. Now a developer. For a
          long time, these felt like separate parts of my life. Eventually, the
          pieces started to connect.
        </p>

        {/* Projects divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            width: "100%",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Projects
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          />
        </div>

        {/* Project cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            width: "100%",
          }}
        >
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            marginTop: "48px",
            alignItems: "center",
          }}
        >
          <a
            href="/cv.pdf"
            download
            style={{
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#000000",
              backgroundColor: "#FFFFFF",
              border: "1px solid #FFFFFF",
              borderRadius: "3px",
              padding: "12px 0",
              textDecoration: "none",
              fontFamily: "Satoshi, sans-serif",
              fontWeight: "600",
              width: "160px",
              textAlign: "center",
            }}
          >
            Download CV
          </a>
          <a
            href="https://batuhanbatur.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              backgroundColor: "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "3px",
              padding: "12px 0",
              textDecoration: "none",
              fontFamily: "Satoshi, sans-serif",
              width: "160px",
              textAlign: "center",
            }}
          >
            Contact
          </a>
        </div>
      </div>
    </main>
  )
}
