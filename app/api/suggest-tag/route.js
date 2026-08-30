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

  const systemPrompt = `You assign tags to a short blog status update. Pick the 1 or 2 best matching tags from this list: ${existingTags.join(
    ", ",
  )}. Reply with the tags comma-separated, exactly as written, nothing else. If none fit well, reply NONE.`

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
    const raw = data.choices?.[0]?.message?.content?.trim() || "NONE"
    const tags = raw
      .split(",")
      .map(t => t.trim())
      .filter(Boolean)
    return Response.json({ tags })
  } catch (err) {
    console.error("suggest-tag failed:", err)
    return Response.json({ error: "Suggestion failed" }, { status: 500 })
  }
}
