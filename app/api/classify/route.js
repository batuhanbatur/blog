import { classifyArticle } from "../../lib/classifyArticle"
import { requireUser } from "../../lib/requireUser"

export async function POST(request) {
  const user = await requireUser(request)
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, content, existingCollections } = await request.json()

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !content.trim()
  ) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  const collections = Array.isArray(existingCollections)
    ? existingCollections.filter(c => typeof c === "string")
    : []

  try {
    const result = await classifyArticle({
      title,
      content,
      existingCollections: collections,
    })
    return Response.json(result)
  } catch (err) {
    console.error("classify failed:", err)
    return Response.json({ error: "Classification failed" }, { status: 500 })
  }
}
