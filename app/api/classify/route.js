import { classifyArticle } from "../../lib/classifyArticle"

export async function POST(request) {
  const { title, content } = await request.json()

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !content.trim()
  ) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  try {
    const result = await classifyArticle({ title, content })
    return Response.json(result)
  } catch (err) {
    console.error("classify failed:", err)
    return Response.json({ error: "Classification failed" }, { status: 500 })
  }
}
