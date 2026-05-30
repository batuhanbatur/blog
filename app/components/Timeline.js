import { supabase } from "../lib/supabase"
import { unstable_noStore as noStore } from "next/cache"
import TimelineClient from "./TimelineClient"

export default async function Timeline() {
  noStore()
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
  ].sort((a, b) => {
    const dateA = new Date(b.date)
    const dateB = new Date(a.date)
    if (dateA - dateB !== 0) return dateA - dateB
    return new Date(b.created_at) - new Date(a.created_at)
  })

  return (
    <section
      className="tl-section"
      style={{
        padding: "16px 80px 64px 64px",
      }}
    >
      <TimelineClient allPosts={allPosts} />

      <style>{`
        @media (max-width: 768px) {
          .tl-section { padding: 16px 24px 48px 24px !important; }
          .tl-status-row { justify-content: flex-start !important; }
          .tl-status-card { width: 100% !important; }
        }
      `}</style>
    </section>
  )
}
