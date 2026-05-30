import Link from "next/link"
import { unstable_noStore as noStore } from "next/cache"
import { supabase } from "../../lib/supabase"
import ArticleBody from "../../components/ArticleBody"

export default async function ArticlePage({ params, searchParams }) {
  noStore()
  const { slug } = await params
  const shouldContinue = (await searchParams)?.continue === "1"

  const { data: post } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!post) {
    return <div>Article not found.</div>
  }

  return (
    <main
      className="article-main"
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "80px 24px",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .article-main { padding: 48px 20px !important; }
          .article-back { margin-bottom: 32px !important; }
          .article-title { font-size: 32px !important; }
          .article-meta { margin-bottom: 32px !important; }
        }
      `}</style>

      <Link
        href="/"
        className="article-back"
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
        className="article-title"
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
        {[post.language_tag, ...(post.tone_tags || [])].map(tag => (
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
        className="article-meta"
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
          {post.reading_time} read
        </span>
      </div>

      <ArticleBody content={post.content} shouldContinue={shouldContinue} postId={post.id} />
    </main>
  )
}
