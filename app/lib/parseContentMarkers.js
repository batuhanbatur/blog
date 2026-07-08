export function parseContentMarkers(text) {
  const regex =
    /\[([^\]]+)\]\((gif|article|word|video|ambient|image):([^)]+)\)/g
  const segments = []
  let lastIndex = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      })
    }
    const markerType = match[2]
    const value = match[3]
    if (markerType === "gif") {
      segments.push({ type: "gif", phrase: match[1], gifUrl: value })
    } else if (markerType === "article") {
      segments.push({ type: "article", phrase: match[1], slug: value })
    } else if (markerType === "word") {
      const [explanation, phonemic] = value.split("|")
      segments.push({
        type: "word",
        phrase: match[1],
        explanation,
        phonemic: phonemic || null,
      })
    } else if (markerType === "video") {
      segments.push({
        type: "video",
        title: match[1],
        url: value,
        ambient: false,
      })
    } else if (markerType === "ambient") {
      segments.push({
        type: "video",
        title: match[1],
        url: value,
        ambient: true,
      })
    } else if (markerType === "image") {
      segments.push({ type: "image", alt: match[1], url: value })
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) })
  }
  return segments
}
