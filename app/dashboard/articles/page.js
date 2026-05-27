"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function ArticlesDashboard() {
  const [view, setView] = useState("list")
  const [articles, setArticles] = useState([])
  const [editingArticle, setEditingArticle] = useState(null)

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

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false })
    if (data) setArticles(data)
  }

  const handleNew = () => {
    setEditingArticle(null)
    setTitle("")
    setSlug("")
    setContent("")
    setExcerpt("")
    setDate(new Date().toISOString().split("T")[0])
    setReadingTime("")
    setLanguageTag("Mixed")
    setToneTags("")
    setTopicTags("")
    setStatus("draft")
    setView("editor")
  }

  const handleEdit = article => {
    setEditingArticle(article)
    setTitle(article.title)
    setSlug(article.slug)
    setContent(article.content)
    setExcerpt(article.excerpt || "")
    setDate(article.date)
    setReadingTime(article.reading_time || "")
    setLanguageTag(article.language_tag || "Mixed")
    setToneTags((article.tone_tags || []).join(", "))
    setTopicTags((article.topic_tags || []).join(", "))
    setStatus(article.status || "draft")
    setView("editor")
  }

  const handleDelete = async id => {
    if (!confirm("Delete this article?")) return
    await supabase.from("articles").delete().eq("id", id)
    fetchArticles()
  }

  const handleTitleChange = value => {
    setTitle(value)
    if (!editingArticle) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      )
    }
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !slug.trim()) {
      setError("Title, slug and content are required.")
      return
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.trim().split("\n\n")[0].slice(0, 200),
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
    }

    if (editingArticle) {
      const { error } = await supabase
        .from("articles")
        .update(payload)
        .eq("id", editingArticle.id)
      if (error) {
        setError(error.message)
        return
      }
    } else {
      const { error } = await supabase.from("articles").insert([payload])
      if (error) {
        setError(error.message)
        return
      }
    }

    await fetchArticles()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setError(null)
      setView("list")
    }, 1500)
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
            justifyContent: "space-between",
            marginBottom: "48px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
              {view === "list"
                ? "Articles"
                : editingArticle
                  ? "Edit Article"
                  : "New Article"}
            </h1>
          </div>
          {view === "list" && (
            <button
              onClick={handleNew}
              style={{
                backgroundColor: "#CCC6B8",
                color: "#1D1D0C",
                border: "none",
                borderRadius: "4px",
                padding: "10px 20px",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "Satoshi, sans-serif",
                fontWeight: "600",
              }}
            >
              + New
            </button>
          )}
          {view === "editor" && (
            <button
              onClick={() => setView("list")}
              style={{
                backgroundColor: "transparent",
                color: "#CCC6B8",
                border: "1px solid rgba(204, 198, 184, 0.2)",
                borderRadius: "4px",
                padding: "10px 20px",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "Satoshi, sans-serif",
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {view === "list" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {articles.length === 0 && (
              <p style={{ opacity: 0.4, fontSize: "14px" }}>No articles yet.</p>
            )}
            {articles.map(article => (
              <div
                key={article.id}
                style={{
                  backgroundColor: "rgba(204, 198, 184, 0.03)",
                  border: "1px solid rgba(204, 198, 184, 0.1)",
                  borderRadius: "6px",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {article.title}
                  </p>
                  <p style={{ margin: 0, fontSize: "11px", opacity: 0.4 }}>
                    {article.status} · {article.date}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={() => handleEdit(article)}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid rgba(204, 198, 184, 0.2)",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "11px",
                      color: "#CCC6B8",
                      cursor: "pointer",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid rgba(255, 100, 100, 0.3)",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "11px",
                      color: "#ff6464",
                      cursor: "pointer",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "editor" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {error && (
              <div
                style={{
                  backgroundColor: "rgba(255, 100, 100, 0.1)",
                  border: "1px solid rgba(255, 100, 100, 0.3)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "13px",
                  color: "#ff6464",
                }}
              >
                {error}
              </div>
            )}

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
                <label style={labelStyle}>Tone Tags</label>
                <input
                  value={toneTags}
                  onChange={e => setToneTags(e.target.value)}
                  placeholder="Reflective, Casual"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Topic Tags</label>
                <input
                  value={topicTags}
                  onChange={e => setTopicTags(e.target.value)}
                  placeholder="Personal, Life"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Excerpt (optional)</label>
              <input
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="Short description"
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
                  : editingArticle
                    ? "Update"
                    : status === "published"
                      ? "Publish"
                      : "Save Draft"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
