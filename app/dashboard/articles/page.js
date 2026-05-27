"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function ArticlesDashboard() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [readingTime, setReadingTime] = useState("")
  const [languageTag, setLanguageTag] = useState("Mixed")
  const [toneTags, setToneTags] = useState("")
  const [topicTags, setTopicTags] = useState("")
  const [status, setStatus] = useState("draft")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleTitleChange = value => {
    setTitle(value)
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    )
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !slug.trim()) {
      setError("Title, slug and content are required.")
      return
    }

    const { error } = await supabase.from("articles").insert([
      {
        title: title.trim(),
        slug: slug.trim(),
        content: content.trim(),
        excerpt:
          excerpt.trim() || content.trim().split("\n\n")[0].slice(0, 200),
        date,
        reading_time: readingTime.trim() || "5 min",
        language_tag: languageTag,
        tone_tags: toneTags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),
        topic_tags: topicTags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),
        status,
      },
    ])

    if (error) {
      setError(error.message)
      return
    }

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setTitle("")
      setSlug("")
      setContent("")
      setExcerpt("")
      setReadingTime("")
      setToneTags("")
      setTopicTags("")
      setError(null)
    }, 2000)
  }

  const inputStyle = {
    width: "100%",
    backgroundColor: "rgba(204, 198, 184, 0.05)",
    border: "1px solid rgba(204, 198, 184, 0.15)",
    borderRadius: "6px",
    padding: "10px 14px",
    color: "#CCC6B8",
    fontFamily: "Satoshi, sans-serif",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  }

  const labelStyle = {
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    opacity: 0.4,
    marginBottom: "6px",
    display: "block",
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#1D1D0C",
        color: "#CCC6B8",
        padding: "48px",
        fontFamily: "Satoshi, sans-serif",
      }}
    >
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <a
            href="/dashboard"
            style={{
              fontSize: "12px",
              color: "#CCC6B8",
              opacity: 0.4,
              textDecoration: "none",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            ← Back
          </a>
          <h1 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
            New Article
          </h1>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "rgba(255, 100, 100, 0.1)",
              border: "1px solid rgba(255, 100, 100, 0.3)",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "24px",
              fontSize: "13px",
              color: "#ff6464",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Article title"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Slug</label>
            <input
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="auto-generated-from-title"
              style={{ ...inputStyle, opacity: 0.6 }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Reading Time</label>
              <input
                value={readingTime}
                onChange={e => setReadingTime(e.target.value)}
                placeholder="5 min"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                style={inputStyle}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Language Tag</label>
              <select
                value={languageTag}
                onChange={e => setLanguageTag(e.target.value)}
                style={inputStyle}
              >
                <option value="Mixed">Mixed</option>
                <option value="Formal">Formal</option>
                <option value="Informal">Informal</option>
                <option value="Technical">Technical</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tone Tags (comma separated)</label>
              <input
                value={toneTags}
                onChange={e => setToneTags(e.target.value)}
                placeholder="Reflective, Casual"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Topic Tags (comma separated)</label>
              <input
                value={topicTags}
                onChange={e => setTopicTags(e.target.value)}
                placeholder="Personal, Life"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>
              Excerpt (optional — auto-generated if empty)
            </label>
            <input
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Short description of the article"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your article here. Separate paragraphs with a blank line."
              style={{
                ...inputStyle,
                minHeight: "400px",
                resize: "vertical",
                lineHeight: "1.7",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: submitted
                  ? "rgba(204, 198, 184, 0.2)"
                  : "#CCC6B8",
                color: "#1D1D0C",
                border: "none",
                borderRadius: "4px",
                padding: "12px 32px",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "Satoshi, sans-serif",
                fontWeight: "600",
              }}
            >
              {submitted
                ? "Saved ✓"
                : status === "published"
                  ? "Publish"
                  : "Save Draft"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
