"use client"

import { useEffect, useRef } from "react"
import { markAsRead } from "../lib/lastSeen"
import StatusUpdate from "./StatusUpdate"

export default function StatusUpdateWrapper({ post }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markAsRead(post.id)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [post.id])

  return <div ref={ref}><StatusUpdate post={post} /></div>
}
