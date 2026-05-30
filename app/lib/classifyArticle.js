export async function classifyArticle({ title, content }) {
  const prompt = `You are classifying a personal blog article for a knowledge graph system.

Article title: ${title}

Article content:
${content.slice(0, 3000)}

Return ONLY a JSON object with this exact structure, no explanation, no markdown:
{
  "primaryTopics": ["topic1", "topic2"],
  "secondaryTopics": ["topic3", "topic4"],
  "collection": "Collection Name & Subtitle"
}

Rules:
- primaryTopics: 2-4 specific topics directly present in the article
- secondaryTopics: 2-3 broader themes or adjacent concepts
- collection: a human, evocative name for the thematic group this article belongs to. Examples: "Gaming & Virtual Worlds", "Music That Stayed With Me", "Building Things", "Personal Reflections", "Career & Apple Years". Create a new one if none fit, or reuse an existing feel if it matches.
- Be specific and personal, not generic. Avoid vague terms like "Life" or "Thoughts".`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
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

export async function generateCollectionDescription(collectionName, sampleTitles) {
  const prompt = `Write a single evocative sentence describing a collection of blog articles called "${collectionName}".
Sample article titles from this collection: ${sampleTitles.join(", ")}.
The sentence should feel personal and inviting, like an author describing their own writing.
Example: "Stories about games, characters, competition, and the memories attached to them."
Return ONLY the sentence, no quotes, no explanation.`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  })

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ""
}
