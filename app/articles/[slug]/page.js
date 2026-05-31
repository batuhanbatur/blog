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

  let relatedArticles = []
  if (post.collection) {
    const { data: candidates } = await supabase
      .from("articles")
      .select("id, title, slug, collection, reading_time")
      .eq("status", "published")
      .eq("collection", post.collection)
      .neq("id", post.id)
      .limit(3)

    relatedArticles = candidates || []
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

      <ArticleBody
        content={post.content}
        shouldContinue={shouldContinue}
        postId={post.id}
      />

      {relatedArticles.length > 0 && (
        <div
          style={{
            marginTop: "64px",
            paddingTop: "32px",
            borderTop: "1px solid rgba(29,29,12,0.08)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#1D1D0C",
              opacity: 0.4,
              margin: "0 0 24px 0",
              fontFamily: "Satoshi, sans-serif",
            }}
          >
            You may also like
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {relatedArticles.map(article => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                style={{
                  textDecoration: "none",
                  color: "#1D1D0C",
                  display: "block",
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(29,29,12,0.06)",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    margin: "0 0 4px 0",
                    fontFamily: "Satoshi, sans-serif",
                  }}
                >
                  {article.title}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    opacity: 0.4,
                    margin: 0,
                    letterSpacing: "0.06em",
                  }}
                >
                  {article.collection && `${article.collection} · `}
                  {article.reading_time} read
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
