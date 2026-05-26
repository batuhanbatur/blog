import ArticleCard from "./ArticleCard"
import StatusUpdate from "./StatusUpdate"
import { posts } from "../data/posts"

export default function Timeline() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )

  let statusCounter = 0

  return (
    <section
      style={{
        padding: "64px 64px 64px 64px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        {sortedPosts.map(post => {
          if (post.type === "article") {
            statusCounter = 0
            return <ArticleCard key={post.id} post={post} />
          }
          if (post.type === "status") {
            const isRight = statusCounter % 2 !== 0
            statusCounter++
            return (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  justifyContent: isRight ? "flex-end" : "flex-start",
                }}
              >
                <div style={{ width: "60%" }}>
                  <StatusUpdate post={post} />
                </div>
              </div>
            )
          }
          return null
        })}
      </div>
    </section>
  )
}
