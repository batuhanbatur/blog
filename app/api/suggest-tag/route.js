export async function POST(request) {
  const { content, existingTags } = await request.json()

  if (
    typeof content !== "string" ||
    !content.trim() ||
    !Array.isArray(existingTags) ||
    existingTags.length === 0
  ) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  const systemPrompt = `You assign a tag to a short blog status update. Pick the single best matching tag from this list: ${existingTags.join(
    ", ",
  )}. Reply with the tag exactly as written, nothing else. If none fit well, reply NONE.`

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: content.slice(0, 3000) },
        ],
        temperature: 0,
      }),
    })

    const data = await res.json()
    const tag = data.choices?.[0]?.message?.content?.trim() || "NONE"
    return Response.json({ tag })
  } catch (err) {
    console.error("suggest-tag failed:", err)
    return Response.json({ error: "Suggestion failed" }, { status: 500 })
  }
}
