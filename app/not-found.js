import Link from "next/link"

export const metadata = { title: "Not found" }

// Shown for unknown URLs and whenever a page calls notFound().
export default function NotFound() {
  return (
    <main
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "120px 24px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "Tanker, sans-serif",
          fontSize: "52px",
          lineHeight: "1.0",
          color: "#1D1D0C",
          margin: "0 0 16px 0",
        }}
      >
        NOTHING HERE.
      </h1>
      <p
        style={{
          fontSize: "15px",
          lineHeight: "1.6",
          color: "#1D1D0C",
          opacity: 0.7,
          margin: "0 0 32px 0",
        }}
      >
        This page doesn&apos;t exist, or it was never published.
      </p>
      <Link
        href="/"
        style={{
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#1D1D0C",
          opacity: 0.7,
        }}
      >
        ← Back to the timeline
      </Link>
    </main>
  )
}
