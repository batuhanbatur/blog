import ArticleCard from "./ArticleCard"
import StatusUpdate from "./StatusUpdate"
import SwordDivider from "./SwordDivider"
import { supabase } from "../lib/supabase"

export default async function Timeline() {
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")

  const { data: statusUpdates } = await supabase
    .from("status_updates")
    .select("*")

  const allPosts = [
    ...(articles || []).map(a => ({ ...a, type: "article" })),
    ...(statusUpdates || []).map(s => ({ ...s, type: "status" })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date))

  let statusCounter = 0

  return (
    <section
      style={{
        padding: "16px 80px 64px 64px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {allPosts.map((post, index) => {
          const isLast = index === allPosts.length - 1

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
