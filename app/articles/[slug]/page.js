import { cache } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { unstable_noStore as noStore } from "next/cache"
import { supabase } from "../../lib/supabase"
import ArticleBody from "../../components/ArticleBody"
import TagWithTooltip from "../../components/TagWithTooltip"

// cache() lets generateMetadata and the page share one query per request.
// Only published articles are public, so a draft slug gives a 404.
const getArticle = cache(async slug => {
  const { data: post } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  return post
})

// First paragraph as plain text: inline markers become their visible phrase,
// block embeds (video, image) are dropped.
function getExcerpt(content) {
  const firstParagraph = (content || "").split("\n\n")[0]
  const text = firstParagraph
    .replace(/\[[^\]]+\]\((?:video|ambient|image):[^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\((?:gif|article|word):[^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > 160 ? `${text.slice(0, 157)}...` : text
}

export async function generateMetadata({ params }) {
  noStore()
  const { slug } = await params
  const post = await getArticle(slug)
  if (!post) return { title: "Not found" }

  const description = getExcerpt(post.content)
  return {
    title: post.title,
    description,
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/articles/${post.slug}`,
      publishedTime: post.date,
      // A page's openGraph replaces the root one, so the image is repeated.
      images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    },
  }
}

export default async function ArticlePage({ params, searchParams }) {
  noStore()
  const { slug } = await params
  const shouldContinue = (await searchParams)?.continue === "1"

  const post = await getArticle(slug)
  if (!post) notFound()

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
          opacity: 0.7,
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
        {[
          { value: post.language_tag, label: "Language" },
          ...(post.tone_tags || [])
            .filter(t => t !== post.language_tag)
            .map(t => ({ value: t, label: "Tone" })),
        ].map(({ value, label }) => (
          <TagWithTooltip key={value} value={value} label={label} />
        ))}
      </div>

      <div
        className="article-meta"
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: post.audio_url ? "24px" : "48px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#1D1D0C", opacity: 0.7 }}>
          {post.date}
        </span>
        <span style={{ fontSize: "12px", color: "#1D1D0C", opacity: 0.7 }}>
          {post.reading_time} read
        </span>
      </div>

      {post.audio_url && (
        <div style={{ marginBottom: "48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#1D1D0C",
                opacity: 0.7,
                fontFamily: "Satoshi, sans-serif",
              }}
            >
              Listen to this article
            </span>
          </div>
          <audio
            controls
            src={post.audio_url}
            style={{
              width: "100%",
              height: "36px",
              opacity: 0.7,
            }}
          />
        </div>
      )}

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
              opacity: 0.7,
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
                    opacity: 0.7,
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
