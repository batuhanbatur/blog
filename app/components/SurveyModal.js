"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import { markSurveyDone, dismissSurvey } from "../lib/lastSeen"

const questions = {
  whatBrings: {
    label: "What brings you back here?",
    required: true,
    options: [
      "Articles",
      "Status updates",
      "Project/dev logs",
      "Design/UI ideas",
      "Personal thoughts & stories",
      "Just browsing",
      "Other",
    ],
  },
  howFound: {
    label: "How did you find this site?",
    options: [
      "LinkedIn",
      "GitHub",
      "Friend",
      "Recruiter",
      "Search engine",
      "Social media",
      "Claude / AI recommendation",
      "Other",
    ],
  },
  whoAreYou: {
    label: "Who are you visiting as?",
    options: [
      "Recruiter / Hiring Manager",
      "Developer",
      "Designer",
      "Student",
      "Friend / Acquaintance",
      "Former colleague",
      "Just passing through",
      "Prefer not to say",
    ],
  },
  wouldVisitAgain: {
    label: "Would you visit again?",
    options: ["Definitely", "Probably", "Not sure", "Probably not"],
  },
  mostUnique: {
    label: "Which part feels most unique?",
    options: [
      "Interactive article features",
      "Writing style",
      "Design/visual identity",
      "Project ideas",
      "Personal stories",
      "Not sure yet",
    ],
  },
  howLong: {
    label: "How long have you been visiting this site?",
    options: [
      "First time returning",
      "A few weeks",
      "A month or more",
      "I've lost track",
    ],
  },
}

function RadioGroup({ name, options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {options.map(opt => (
        <label
          key={opt}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            padding: "4px 0",
            cursor: "pointer",
            color: "#1D1D0C",
          }}
        >
          <span
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: value === opt ? "none" : "1.5px solid rgba(29,29,12,0.35)",
              backgroundColor: value === opt ? "#1D1D0C" : "transparent",
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            style={{ display: "none" }}
          />
          {opt}
        </label>
      ))}
    </div>
  )
}

function Question({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <p style={{
        fontSize: "13px",
        fontWeight: "600",
        letterSpacing: "0.04em",
        color: "#1D1D0C",
        margin: 0,
      }}>
        {label}{required && <span style={{ opacity: 0.4 }}> *</span>}
      </p>
      {children}
    </div>
  )
}

export default function SurveyModal({ onClose, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const set = (key, val) => setAnswers(prev => ({ ...prev, [key]: val }))

  const handleSend = async () => {
    if (!answers.whatBrings) {
      setError("Please answer the first question before sending.")
      return
    }
    setError(null)
    setSubmitting(true)

    const { error: dbError } = await supabase.from("survey_responses").insert({
      what_brings_you_back: answers.whatBrings || null,
      how_found: answers.howFound || null,
      who_are_you: answers.whoAreYou || null,
      want_more: answers.wantMore || null,
      confusing_or_annoying: answers.confusing || null,
      would_visit_again: answers.wouldVisitAgain || null,
      most_unique: answers.mostUnique || null,
      how_long_visiting: answers.howLong || null,
    })

    setSubmitting(false)

    if (dbError) {
      setError("Something went wrong. Try again?")
      return
    }

    markSurveyDone()
    onComplete()
  }

  const handleLater = () => {
    dismissSurvey()
    onClose()
  }

  const textareaStyle = {
    width: "100%",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(29,29,12,0.2)",
    padding: "8px 0",
    color: "#1D1D0C",
    fontFamily: "Satoshi, sans-serif",
    fontSize: "13px",
    outline: "none",
    resize: "none",
    boxSizing: "border-box",
    lineHeight: "1.6",
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflowY: "auto",
      }}
      onClick={e => { if (e.target === e.currentTarget) handleLater() }}
    >
      <style>{`
        .survey-card::-webkit-scrollbar { width: 6px; }
        .survey-card::-webkit-scrollbar-track { background: transparent; }
        .survey-card::-webkit-scrollbar-thumb { background: rgba(29,29,12,0.15); border-radius: 3px; }
        .survey-card::-webkit-scrollbar-thumb:hover { background: rgba(29,29,12,0.25); }
      `}</style>
      <div
        className="survey-card"
        style={{
          maxWidth: "520px",
          width: "100%",
          backgroundColor: "#CCC6B8",
          border: "1px solid rgba(29,29,12,0.15)",
          borderRadius: "8px",
          padding: "40px",
          fontFamily: "Satoshi, sans-serif",
          color: "#1D1D0C",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <div>
          <p style={{ fontSize: "13px", fontStyle: "italic", opacity: 0.6, margin: "0 0 8px 0" }}>
            Seems like you&apos;ve been visiting quite a lot.
          </p>
          <p style={{
            fontSize: "18px",
            fontFamily: "Satoshi, sans-serif",
            fontWeight: "700",
            margin: "0 0 32px 0",
          }}>
            I&apos;m curious what keeps bringing you back.
          </p>
        </div>

        <Question label={questions.whatBrings.label} required>
          <RadioGroup
            name="whatBrings"
            options={questions.whatBrings.options}
            value={answers.whatBrings}
            onChange={val => set("whatBrings", val)}
          />
        </Question>

        <Question label={questions.howFound.label}>
          <RadioGroup
            name="howFound"
            options={questions.howFound.options}
            value={answers.howFound}
            onChange={val => set("howFound", val)}
          />
        </Question>

        <Question label={questions.whoAreYou.label}>
          <RadioGroup
            name="whoAreYou"
            options={questions.whoAreYou.options}
            value={answers.whoAreYou}
            onChange={val => set("whoAreYou", val)}
          />
        </Question>

        <Question label="What would you like to see more of?">
          <textarea
            rows={3}
            value={answers.wantMore || ""}
            onChange={e => set("wantMore", e.target.value)}
            style={textareaStyle}
          />
        </Question>

        <Question label="Anything that feels confusing, slow, or annoying?">
          <textarea
            rows={3}
            value={answers.confusing || ""}
            onChange={e => set("confusing", e.target.value)}
            style={textareaStyle}
          />
        </Question>

        <Question label={questions.wouldVisitAgain.label}>
          <RadioGroup
            name="wouldVisitAgain"
            options={questions.wouldVisitAgain.options}
            value={answers.wouldVisitAgain}
            onChange={val => set("wouldVisitAgain", val)}
          />
        </Question>

        <Question label={questions.mostUnique.label}>
          <RadioGroup
            name="mostUnique"
            options={questions.mostUnique.options}
            value={answers.mostUnique}
            onChange={val => set("mostUnique", val)}
          />
        </Question>

        <Question label={questions.howLong.label}>
          <RadioGroup
            name="howLong"
            options={questions.howLong.options}
            value={answers.howLong}
            onChange={val => set("howLong", val)}
          />
        </Question>

        {error && (
          <p style={{ fontSize: "13px", color: "#c0392b", margin: 0 }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleSend}
            disabled={submitting}
            style={{
              backgroundColor: "#1D1D0C",
              color: "#CCC6B8",
              border: "none",
              borderRadius: "4px",
              padding: "12px 28px",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "Satoshi, sans-serif",
              fontWeight: "600",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Sending…" : "Send"}
          </button>
          <button
            onClick={handleLater}
            style={{
              backgroundColor: "transparent",
              color: "#1D1D0C",
              border: "1px solid rgba(29,29,12,0.2)",
              borderRadius: "4px",
              padding: "12px 28px",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "Satoshi, sans-serif",
              opacity: 0.6,
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
