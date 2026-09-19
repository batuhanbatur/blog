import { generateCollectionDescription } from "../../lib/classifyArticle"
import { requireUser } from "../../lib/requireUser"

export async function POST(request) {
  const user = await requireUser(request)
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { collection, titles } = await request.json()

  if (typeof collection !== "string" || !Array.isArray(titles)) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  try {
    const description = await generateCollectionDescription(collection, titles)
    return Response.json({ description })
  } catch (err) {
    console.error("collection description failed:", err)
    return Response.json({ error: "Generation failed" }, { status: 500 })
  }
}
