import { supabase } from "../lib/supabase"
import LandingLayout from "./LandingLayout"

export const revalidate = 0

export default async function LandingSection() {
  const { data: message } = await supabase
    .from("daily_messages")
    .select("*")
    .eq("active", true)
    .single()

  const quote = message?.quote || "You're gonna carry that weight."
  const attribution = message?.attribution || "Cowboy Bebop"

  return <LandingLayout quote={quote} attribution={attribution} />
}
