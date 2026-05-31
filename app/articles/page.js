import { unstable_noStore as noStore } from "next/cache"
import { supabase } from "../lib/supabase"

export default async function ArticlesPage() {
  noStore()

  const [{ data: collections }, { data: articles }] = await Promise.all([
    supabase.from("collections").select("*"),
    supabase
      .from("articles")
      .select("id, title, slug, collection, date, reading_time")
      .eq("status", "published")
      .order("date", { ascending: false }),
  ])

  const articlesByCollection = {}
  const uncollected = []

  for (const article of articles || []) {
    if (!article.collection) {
      uncollected.push(article)
    } else {
      if (!articlesByCollection[article.collection]) {
        articlesByCollection[article.collection] = []
      }
      articlesByCollection[article.collection].push(article)
    }
  }

  const sortedCollections = (collections || [])
    .filter(c => articlesByCollection[c.name]?.length > 0)
    .sort(
      (a, b) =>
        (articlesByCollection[b.name]?.length || 0) -
        (articlesByCollection[a.name]?.length || 0),
    )

  if (uncollected.length > 0) {
    sortedCollections.push({ name: "Uncategorized", description: null })
    articlesByCollection["Uncategorized"] = uncollected
  }

  return (
    <main
      className="articles-main"
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "80px 24px",
        fontFamily: "Satoshi, sans-serif",
      }}
    >
      <style>{`
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .collection-card-wide {
          grid-column: span 2;
        }
        .article-link {
          opacity: 0.7;
          transition: opacity 0.15s ease;
        }
        .article-link:hover {
          opacity: 1;
        }
        .collection-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          cursor: default;
        }
        .collection-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          border-color: rgba(29,29,12,0.2);
        }
        @media (max-width: 768px) {
          .articles-main { padding: 48px 20px !important; }
          .articles-grid { grid-template-columns: 1fr !important; }
          .collection-card-wide { grid-column: span 1 !important; }
        }
      `}</style>

      <h1
        style={{
          fontSize: "48px",
          fontWeight: "800",
          fontFamily: "Tanker, sans-serif",
          color: "#1D1D0C",
          lineHeight: "1.0",
          margin: "0 0 16px 0",
        }}
      >
        Articles
      </h1>

      <p
        style={{
          fontSize: "14px",
          color: "#1D1D0C",
          opacity: 0.5,
          margin: "0 0 64px 0",
          lineHeight: "1.6",
        }}
      >
        Organized by theme. Not by date.
      </p>

      <div className="articles-grid">
        {sortedCollections.map(collection => {
          const collectionArticles = articlesByCollection[collection.name] || []
          const isWide = collectionArticles.length >= 3
          const shown = collectionArticles.slice(0, 3)
          const overflow = collectionArticles.length - 3

          return (
            <div
              key={collection.name}
              className={`collection-card${isWide ? " collection-card-wide" : ""}`}
              style={{
                border: "1px solid rgba(29,29,12,0.1)",
                borderRadius: "6px",
                padding: "32px",
                backgroundColor: "#BAB1A0",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <p
                style={{
                  fontSize: "22px",
                  fontFamily: "Tanker, sans-serif",
                  fontWeight: "800",
                  color: "#1D1D0C",
                  margin: 0,
                  lineHeight: "1.1",
                }}
              >
                {collection.name}
              </p>

              {collection.description && (
                <p
                  style={{
                    fontSize: "13px",
                    opacity: 0.55,
                    lineHeight: "1.6",
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  {collection.description}
                </p>
              )}

              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "rgba(29,29,12,0.08)",
                    margin: "4px 0",
                  }}
                />

                <div style={{ display: "flex", flexDirection: "column" }}>
                  {shown.map(article => (
                    <a
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="article-link"
                      style={{
                        fontSize: "14px",
                        color: "#1D1D0C",
                        textDecoration: "none",
                        display: "block",
                        padding: "4px 0",
                      }}
                    >
                      {article.title}
                    </a>
                  ))}
                  {overflow > 0 && (
                    <span
                      style={{
                        fontSize: "12px",
                        opacity: 0.4,
                        letterSpacing: "0.08em",
                        padding: "4px 0",
                      }}
                    >
                      +{overflow} more
                    </span>
                  )}
                </div>

                <p
                  style={{
                    fontSize: "11px",
                    opacity: 0.3,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {collectionArticles.length}{" "}
                  {collectionArticles.length === 1 ? "article" : "articles"}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
