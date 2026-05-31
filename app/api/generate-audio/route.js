import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

export async function POST(request) {
  const { text, slug } = await request.json()

  if (!text || !slug) {
    return Response.json({ error: "Missing text or slug" }, { status: 400 })
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
        text,
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
