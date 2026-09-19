import { createClient } from "@supabase/supabase-js"
import { requireUser } from "../../lib/requireUser"

const MAX_CONTENT_LENGTH = 20000

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

export async function POST(request) {
  const user = await requireUser(request)
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { articleId } = await request.json()

  if (!articleId) {
    return Response.json({ error: "Missing articleId" }, { status: 400 })
  }

  // Source the text from the database, never from the request body.
  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("slug, content")
    .eq("id", articleId)
    .single()

  if (articleError || !article) {
    return Response.json({ error: "Article not found" }, { status: 404 })
  }

  const { slug, content } = article

  if (typeof content !== "string" || !content.trim()) {
    return Response.json({ error: "Article has no content" }, { status: 400 })
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return Response.json(
      { error: `Content exceeds ${MAX_CONTENT_LENGTH} characters` },
      { status: 400 },
    )
  }

  if (typeof slug !== "string" || !slug.trim()) {
    return Response.json({ error: "Article has no slug" }, { status: 400 })
  }

  // 1. Call ElevenLabs
  const elevenRes = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: content,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    },
  )

  if (!elevenRes.ok) {
    const error = await elevenRes.text()
    return Response.json({ error }, { status: 500 })
  }

  // 2. Upload to Supabase Storage
  const audioBuffer = await elevenRes.arrayBuffer()
  const fileName = `${slug}.mp3`

  const { error: uploadError } = await supabase.storage
    .from("article-audio")
    .upload(fileName, audioBuffer, {
      contentType: "audio/mpeg",
      upsert: true,
    })

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 })
  }

  // 3. Get public URL
  const { data } = supabase.storage.from("article-audio").getPublicUrl(fileName)

  return Response.json({ url: data.publicUrl })
}
