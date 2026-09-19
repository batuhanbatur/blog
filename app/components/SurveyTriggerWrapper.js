"use client"

import { usePathname } from "next/navigation"
import SurveyTrigger from "./SurveyTrigger"

export default function SurveyTriggerWrapper() {
  const pathname = usePathname()
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/tour") || pathname.startsWith("/portfolio")) return null
  return <SurveyTrigger />
}
