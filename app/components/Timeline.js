import ArticleCard from "./ArticleCard"
import StatusUpdate from "./StatusUpdate"
import { posts } from "../data/posts"
import SwordDivider from "./SwordDivider"

export default function Timeline() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )

  let statusCounter = 0

  return (
    <section
      style={{
        padding: "64px 80px 64px 64px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {sortedPosts.map((post, index) => {
          const isLast = index === sortedPosts.length - 1

          let item = null

          if (post.type === "article") {
            statusCounter = 0
            item = <ArticleCard key={post.id} post={post} />
          }

          if (post.type === "status") {
            const isRight = statusCounter % 2 !== 0
            statusCounter++
            item = (
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

          return (
            <div key={post.id}>
              <div style={{ padding: "48px 0" }}>{item}</div>
              {!isLast && <SwordDivider />}
            </div>
          )
        })}
      </div>
    </section>
  )
}
