import { unstable_noStore as noStore } from "next/cache"
import { supabase } from "../lib/supabase"
import LandingLayout from "./LandingLayout"

export default async function LandingSection() {
  noStore()

  const { data: message } = await supabase
    .from("daily_messages")
    .select("*")
    .eq("active", true)
    .single()

  const quote = message?.quote || "You're gonna carry that weight."
  const attribution = message?.attribution || "Cowboy Bebop"

  return <LandingLayout quote={quote} attribution={attribution} />
}
