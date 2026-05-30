"use client"

import { useEffect, useState } from "react"
import { getReadIds } from "../lib/lastSeen"
import ArticleCard from "./ArticleCard"
import StatusUpdateWrapper from "./StatusUpdateWrapper"
import SwordDivider from "./SwordDivider"
import LastSeenMarker from "./LastSeenMarker"

export default function TimelineClient({ allPosts }) {
  const [firstUnreadIndex, setFirstUnreadIndex] = useState(null)

  useEffect(() => {
    const readIds = getReadIds()
    if (readIds.length === 0) return
    const index = allPosts.findIndex(post => !readIds.includes(post.id))
    if (index > 0) setFirstUnreadIndex(index)
  }, [allPosts])

  let statusCounter = 0

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
              className="tl-status-row"
              style={{ display: "flex", justifyContent: isRight ? "flex-end" : "flex-start" }}
            >
              <div className="tl-status-card" style={{ width: "60%" }}>
                <StatusUpdateWrapper post={post} />
              </div>
            </div>
          )
        }

        return (
          <div key={post.id}>
            {index === firstUnreadIndex && <LastSeenMarker />}
            <div style={{ padding: "48px 0" }}>{item}</div>
            {!isLast && <SwordDivider />}
          </div>
        )
      })}
    </div>
  )
}
