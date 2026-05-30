"use client"

import { useEffect, useState } from "react"
import {
  incrementVisitCount,
  getVisitCount,
  isSurveyDone,
  isSurveyDismissed,
  dismissSurvey,
} from "../lib/lastSeen"
import SurveyPrompt from "./SurveyPrompt"
import SurveyModal from "./SurveyModal"

export default function SurveyTrigger() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)

  useEffect(() => {
    incrementVisitCount()

    if (getVisitCount() < 3 || isSurveyDone() || isSurveyDismissed()) return

    let timer = setTimeout(() => {
      setShowPrompt(true)
    }, 90000)

    const handleArticleOpened = () => {
      clearTimeout(timer)
      setShowPrompt(true)
    }

    window.addEventListener("article-opened", handleArticleOpened)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("article-opened", handleArticleOpened)
    }
  }, [])

  if (showSurvey) {
    return (
      <SurveyModal
        onClose={() => setShowSurvey(false)}
        onComplete={() => setShowSurvey(false)}
      />
    )
  }

  if (showPrompt) {
    return (
      <SurveyPrompt
        onParticipate={() => { setShowPrompt(false); setShowSurvey(true) }}
        onDismiss={() => { setShowPrompt(false); dismissSurvey() }}
      />
    )
  }

  return null
}
