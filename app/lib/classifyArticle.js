export async function classifyArticle({
  title,
  content,
  existingCollections = [],
}) {
  const prompt = `You are classifying a personal blog article for a knowledge graph system.

Article title: ${title}

Article content:
${content.slice(0, 3000)}

Return ONLY a JSON object with this exact structure, no explanation, no markdown:
{
  "primaryTopics": ["topic1", "topic2"],
  "secondaryTopics": ["topic3", "topic4"],
  "collection": "Collection Name & Subtitle",
  "languageTag": "Informal",
  "toneTags": ["Reflective", "Honest"],
  "readingTime": "10 min"
}

Rules:
- primaryTopics: 2-4 specific topics directly present in the article
- secondaryTopics: 2-3 broader themes or adjacent concepts
- collection: a human, evocative name for the thematic group this article belongs to. Examples: "Gaming & Virtual Worlds", "Music That Stayed With Me", "Building Things", "Personal Reflections", "Career & Apple Years". Create a new one if none fit, or reuse an existing feel if it matches.
- Existing collections you can reuse if they fit: ${existingCollections.length > 0 ? existingCollections.join(", ") : "none yet"}. Prefer reusing an existing collection over creating a new one when the article clearly belongs to the same theme.
- languageTag: one of exactly "Formal", "Informal", "Technical", or "Mixed" — based on the writing style
- toneTags: 2-4 adjectives describing the emotional tone. Examples: Reflective, Honest, Motivational, Casual, Melancholic, Humorous, Critical
- readingTime: estimated reading time like "5 min", "10 min", "15 min" — based on content length (average reading speed ~200 words/min)
- Be specific and personal, not generic. Avoid vague terms like "Life" or "Thoughts".`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  })

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || ""
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim())
  } catch {
    throw new Error("Failed to parse classification response")
  }
}

export async function generateCollectionDescription(
  collectionName,
  sampleTitles,
) {
  const prompt = `Write a single plain sentence describing what the blog collection "${collectionName}" is about.
Sample article titles: ${sampleTitles.join(", ")}.
Keep it factual and neutral, like a library label. No metaphors, no drama, no quotes, no "journey".
Example: "Articles about the process of building software and the lessons learned along the way."
Return ONLY the sentence, no punctuation at the end, no explanation.`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  })

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ""
}
