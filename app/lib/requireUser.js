import { createClient } from "@supabase/supabase-js"

// Separate from the browser client in ./supabase — this one is server-side and
// must never persist or refresh a session of its own.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

export async function requireUser(request) {
  const header = request.headers.get("authorization")
  if (!header) return null

  const token = header.startsWith("Bearer ")
    ? header.slice(7).trim()
    : header.trim()
  if (!token) return null

  try {
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) return null
    return data.user
  } catch (err) {
    console.error("requireUser failed:", err)
    return null
  }
}
