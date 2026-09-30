import { parseContentMarkers } from "./parseContentMarkers"

export function estimateReadingTime(content) {
  if (!content) return "1 min"

  const readableText = parseContentMarkers(content)
    .map(seg => {
      if (seg.type === "text") return seg.content
      if (seg.type === "gif" || seg.type === "article" || seg.type === "word")
        return seg.phrase
      return ""
    })
    .join(" ")
    .trim()

  const wordCount = readableText.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(wordCount / 200))} min`
}
