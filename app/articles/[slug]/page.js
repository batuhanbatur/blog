import { posts } from "../../data/posts"
import Link from "next/link"

export default async function ArticlePage({ params }) {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)

  if (!post) {
    return <div>Article not found.</div>
  }

  return (
    <main
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "80px 24px",
      }}
    >
      <Link
        href="/"
        style={{
          display: "inline-block",
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#1D1D0C",
          opacity: 0.4,
          textDecoration: "none",
          marginBottom: "48px",
        }}
      >
        ← Back
      </Link>
      <h1
        style={{
          fontSize: "48px",
          fontWeight: "700",
          fontFamily: "Satoshi, sans-serif",
          color: "#1D1D0C",
          lineHeight: "1.1",
          margin: "0 0 16px 0",
        }}
      >
        {post.title}
      </h1>

      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {[post.tags.language, ...post.tags.tone].map(tag => (
          <span
            key={tag}
            style={{
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              backgroundColor: "#4C495A",
              padding: "2px 8px",
              clipPath:
                "polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "48px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#1D1D0C", opacity: 0.4 }}>
          {post.date}
        </span>
        <span style={{ fontSize: "12px", color: "#1D1D0C", opacity: 0.4 }}>
          {post.readingTime} read
        </span>
      </div>

      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.8",
          color: "#1D1D0C",
          fontFamily: "Satoshi, sans-serif",
        }}
      >
        {post.content.split("\n\n").map((paragraph, index) => (
          <p key={index} style={{ marginBottom: "24px" }}>
            {paragraph}
          </p>
        ))}
      </div>
    </main>
  )
}
