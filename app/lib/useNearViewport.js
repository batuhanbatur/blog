"use client"

import { useEffect, useRef, useState } from "react"

export function useNearViewport({ rootMargin = "200px" } = {}) {
  const ref = useRef(null)
  const [isNear, setIsNear] = useState(false)

  useEffect(() => {
    if (isNear) return
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [isNear, rootMargin])

  return [ref, isNear]
}
