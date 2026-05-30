const KEY = "blog_read_ids"
const VISIT_KEY = "blog_visit_count"
const SURVEY_DONE_KEY = "blog_survey_done"
const SURVEY_DISMISSED_KEY = "blog_survey_dismissed"

export function getReadIds() {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
  } catch { return [] }
}

export function markAsRead(id) {
  if (typeof window === "undefined") return
  const ids = getReadIds()
  if (!ids.includes(id)) {
    ids.push(id)
    localStorage.setItem(KEY, JSON.stringify(ids))
  }
}

export function incrementVisitCount() {
  if (typeof window === "undefined") return
  const count = getVisitCount()
  localStorage.setItem(VISIT_KEY, String(count + 1))
}

export function getVisitCount() {
  if (typeof window === "undefined") return 0
  return parseInt(localStorage.getItem(VISIT_KEY) || "0", 10)
}

export function isSurveyDone() {
  if (typeof window === "undefined") return false
  return localStorage.getItem(SURVEY_DONE_KEY) === "true"
}

export function markSurveyDone() {
  if (typeof window === "undefined") return
  localStorage.setItem(SURVEY_DONE_KEY, "true")
}

export function isSurveyDismissed() {
  if (typeof window === "undefined") return false
  const until = localStorage.getItem(SURVEY_DISMISSED_KEY)
  if (!until) return false
  return new Date() < new Date(until)
}

export function dismissSurvey() {
  if (typeof window === "undefined") return
  const until = new Date()
  until.setDate(until.getDate() + 7)
  localStorage.setItem(SURVEY_DISMISSED_KEY, until.toISOString())
}
