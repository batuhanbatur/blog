"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "../../lib/supabase"

const gifBtnStyle = {
  backgroundColor: "transparent",
  border: "1px solid rgba(204, 198, 184, 0.2)",
  borderRadius: "4px",
  padding: "8px 16px",
  fontSize: "11px",
  color: "#CCC6B8",
  cursor: "pointer",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontFamily: "Satoshi, sans-serif",
  flexShrink: 0,
}

export default function ArticlesDashboard() {
  const [view, setView] = useState("list")
  const [articles, setArticles] = useState([])
  const [editingArticle, setEditingArticle] = useState(null)

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [hoverDescription, setHoverDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [readingTime, setReadingTime] = useState("")
  const [languageTag, setLanguageTag] = useState("Mixed")
  const [toneTags, setToneTags] = useState("")
  const [topicTags, setTopicTags] = useState("")
  const [status, setStatus] = useState("draft")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const [showGifPanel, setShowGifPanel] = useState(false)
  const [gifPhrase, setGifPhrase] = useState("")
  const [gifSearchQuery, setGifSearchQuery] = useState("")
  const [giphyResults, setGiphyResults] = useState([])
  const [selectedGif, setSelectedGif] = useState(null)
  const [gifSearching, setGifSearching] = useState(false)

  const [classifying, setClassifying] = useState(false)
  const [classificationResult, setClassificationResult] = useState(null)
  const [classificationError, setClassificationError] = useState(null)
  const [savingClassification, setSavingClassification] = useState(false)

  const [generatingAudio, setGeneratingAudio] = useState(false)
  const [audioError, setAudioError] = useState(null)

  const textareaRef = useRef(null)

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false })
    if (data) setArticles(data)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const resetGifPanel = () => {
    setShowGifPanel(false)
    setGifPhrase("")
    setGifSearchQuery("")
    setGiphyResults([])
    setSelectedGif(null)
  }

  const handleNew = () => {
    setEditingArticle(null)
    setTitle("")
    setSlug("")
    setContent("")
    setExcerpt("")
    setHoverDescription("")
    setDate(new Date().toISOString().split("T")[0])
    setReadingTime("")
    setLanguageTag("Mixed")
    setToneTags("")
    setTopicTags("")
    setStatus("draft")
    setClassificationResult(null)
    resetGifPanel()
    setView("editor")
  }

  const handleEdit = article => {
    setEditingArticle(article)
    setTitle(article.title)
    setSlug(article.slug)
    setContent(article.content)
    setExcerpt(article.excerpt || "")
    setHoverDescription(article.hover_description || "")
    setDate(article.date)
    setReadingTime(article.reading_time || "")
    setLanguageTag(article.language_tag || "Mixed")
    setToneTags((article.tone_tags || []).join(", "))
    setTopicTags((article.topic_tags || []).join(", "))
    setStatus(article.status || "draft")
    setClassificationResult(
      article.primary_topics?.length
        ? {
            primaryTopics: article.primary_topics,
            secondaryTopics: article.secondary_topics,
            collection: article.collection,
          }
        : null,
    )
    resetGifPanel()
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

  const searchGiphy = async () => {
    if (!gifSearchQuery.trim()) return
    setGifSearching(true)
    setSelectedGif(null)
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${process.env.NEXT_PUBLIC_GIPHY_API_KEY}&q=${encodeURIComponent(gifSearchQuery)}&limit=9&rating=g`,
      )
      const data = await res.json()
      setGiphyResults(data.data || [])
    } finally {
      setGifSearching(false)
    }
  }

  const insertGifMarker = () => {
    if (!gifPhrase.trim() || !selectedGif) return
    const marker = `[${gifPhrase.trim()}](gif:${selectedGif.images.original.url})`
    const textarea = textareaRef.current
    const start = textarea ? textarea.selectionStart : content.length
    setContent(content.slice(0, start) + marker + content.slice(start))
    resetGifPanel()
  }

  const handleClassify = async () => {
    if (!title.trim() || !content.trim()) return
    setClassifying(true)
    setClassificationError(null)
    try {
      const { classifyArticle } = await import("../../lib/classifyArticle")
      const result = await classifyArticle({ title, content })
      setClassificationResult(result)
    } catch (e) {
      setClassificationError("Classification failed. Try again.")
    } finally {
      setClassifying(false)
    }
  }

  const handleSaveClassification = async () => {
    if (!classificationResult || !editingArticle) return
    setSavingClassification(true)
    try {
      await supabase
        .from("articles")
        .update({
          primary_topics: classificationResult.primaryTopics,
          secondary_topics: classificationResult.secondaryTopics,
          collection: classificationResult.collection,
        })
        .eq("id", editingArticle.id)

      const { generateCollectionDescription } =
        await import("../../lib/classifyArticle")
      const { data: existingCollection } = await supabase
        .from("collections")
        .select("*")
        .eq("name", classificationResult.collection)
        .single()

      if (!existingCollection) {
        const { data: articlesInCollection } = await supabase
          .from("articles")
          .select("title")
          .eq("collection", classificationResult.collection)
          .limit(5)
        const titles = articlesInCollection?.map(a => a.title) || [title]
        const description = await generateCollectionDescription(
          classificationResult.collection,
          titles,
        )
        await supabase.from("collections").insert([
          {
            name: classificationResult.collection,
            description,
          },
        ])
      }
    } finally {
      setSavingClassification(false)
    }
  }

  const handleGenerateAudio = async () => {
    if (!editingArticle || !content.trim()) return
    setGeneratingAudio(true)
    setAudioError(null)
    try {
      const res = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, slug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to generate audio")

      await supabase
        .from("articles")
        .update({ audio_url: data.url })
        .eq("id", editingArticle.id)

      setEditingArticle(prev => ({ ...prev, audio_url: data.url }))
    } catch (e) {
      setAudioError(e.message)
    } finally {
      setGeneratingAudio(false)
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
      hover_description: hoverDescription.trim() || null,
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
              <label style={labelStyle}>Hover Description</label>
              <input
                value={hoverDescription}
                onChange={e => setHoverDescription(e.target.value)}
                placeholder="Shown when someone hovers an article link — keep it one sentence."
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Content</label>
              <textarea
                ref={textareaRef}
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

            {/* Add GIF Panel */}
            <div>
              <button
                onClick={() => setShowGifPanel(p => !p)}
                style={{ ...gifBtnStyle, opacity: 0.7 }}
              >
                Add GIF {showGifPanel ? "▲" : "▼"}
              </button>

              {showGifPanel && (
                <div
                  style={{
                    marginTop: "12px",
                    backgroundColor: "rgba(204, 198, 184, 0.03)",
                    border: "1px solid rgba(204, 198, 184, 0.1)",
                    borderRadius: "6px",
                    padding: "16px",
                  }}
                >
                  <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Phrase</label>
                    <input
                      style={inputStyle}
                      placeholder="e.g. Challenge Accepted"
                      value={gifPhrase}
                      onChange={e => setGifPhrase(e.target.value)}
                    />
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Search Giphy</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        style={inputStyle}
                        placeholder="e.g. celebrate"
                        value={gifSearchQuery}
                        onChange={e => setGifSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && searchGiphy()}
                      />
                      <button
                        onClick={searchGiphy}
                        disabled={gifSearching}
                        style={gifBtnStyle}
                      >
                        {gifSearching ? "..." : "Search"}
                      </button>
                    </div>
                  </div>

                  {giphyResults.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      {giphyResults.map(gif => (
                        <div
                          key={gif.id}
                          onClick={() => setSelectedGif(gif)}
                          style={{
                            cursor: "pointer",
                            borderRadius: "4px",
                            overflow: "hidden",
                            border:
                              selectedGif?.id === gif.id
                                ? "2px solid #CCC6B8"
                                : "2px solid transparent",
                            opacity:
                              selectedGif && selectedGif.id !== gif.id
                                ? 0.5
                                : 1,
                            transition: "opacity 0.15s, border-color 0.15s",
                          }}
                        >
                          <img
                            src={gif.images.fixed_height.url}
                            alt={gif.title}
                            style={{ width: "100%", display: "block" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={insertGifMarker}
                    disabled={!gifPhrase.trim() || !selectedGif}
                    style={{
                      ...gifBtnStyle,
                      opacity: !gifPhrase.trim() || !selectedGif ? 0.3 : 0.9,
                      cursor:
                        !gifPhrase.trim() || !selectedGif
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Insert at Cursor
                  </button>
                </div>
              )}
            </div>

            {/* AI Classification */}
            <div
              style={{
                borderTop: "1px solid rgba(204, 198, 184, 0.1)",
                paddingTop: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <label style={labelStyle}>AI Classification</label>
                <button
                  onClick={handleClassify}
                  disabled={classifying || !content.trim()}
                  style={{
                    ...gifBtnStyle,
                    opacity: !content.trim() || classifying ? 0.3 : 0.9,
                    cursor:
                      !content.trim() || classifying
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {classifying ? "Classifying..." : "Classify with AI"}
                </button>
              </div>

              {classificationError && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#ff6464",
                    margin: "0 0 12px 0",
                  }}
                >
                  {classificationError}
                </p>
              )}

              {classificationResult && (
                <div
                  style={{
                    backgroundColor: "rgba(204, 198, 184, 0.05)",
                    border: "1px solid rgba(204, 198, 184, 0.1)",
                    borderRadius: "6px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Collection</label>
                    <input
                      value={classificationResult.collection || ""}
                      onChange={e =>
                        setClassificationResult(r => ({
                          ...r,
                          collection: e.target.value,
                        }))
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Primary Topics</label>
                    <input
                      value={
                        classificationResult._primaryTopicsRaw ??
                        (classificationResult.primaryTopics || []).join(", ")
                      }
                      onChange={e =>
                        setClassificationResult(r => ({
                          ...r,
                          _primaryTopicsRaw: e.target.value,
                        }))
                      }
                      onBlur={e =>
                        setClassificationResult(r => ({
                          ...r,
                          primaryTopics: e.target.value
                            .split(",")
                            .map(t => t.trim())
                            .filter(Boolean),
                        }))
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Secondary Topics</label>
                    <input
                      value={
                        classificationResult._secondaryTopicsRaw ??
                        (classificationResult.secondaryTopics || []).join(", ")
                      }
                      onChange={e =>
                        setClassificationResult(r => ({
                          ...r,
                          _secondaryTopicsRaw: e.target.value,
                        }))
                      }
                      onBlur={e =>
                        setClassificationResult(r => ({
                          ...r,
                          secondaryTopics: e.target.value
                            .split(",")
                            .map(t => t.trim())
                            .filter(Boolean),
                        }))
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={handleSaveClassification}
                      disabled={savingClassification || !editingArticle}
                      style={{
                        ...gifBtnStyle,
                        opacity:
                          savingClassification || !editingArticle ? 0.3 : 0.9,
                        cursor:
                          savingClassification || !editingArticle
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {savingClassification
                        ? "Saving..."
                        : !editingArticle
                          ? "Save article first"
                          : "Save Classification"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Generation */}
            <div
              style={{
                borderTop: "1px solid rgba(204, 198, 184, 0.1)",
                paddingTop: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>Audio</label>
                  {editingArticle?.audio_url && (
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: "11px",
                        opacity: 0.4,
                      }}
                    >
                      Audio exists · regenerate to overwrite
                    </p>
                  )}
                </div>
                <button
                  onClick={handleGenerateAudio}
                  disabled={
                    generatingAudio || !editingArticle || !content.trim()
                  }
                  style={{
                    ...gifBtnStyle,
                    opacity:
                      generatingAudio || !editingArticle || !content.trim()
                        ? 0.3
                        : 0.9,
                    cursor:
                      generatingAudio || !editingArticle || !content.trim()
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {generatingAudio
                    ? "Generating..."
                    : editingArticle?.audio_url
                      ? "Regenerate Audio"
                      : "Generate Audio"}
                </button>
              </div>

              {audioError && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#ff6464",
                    margin: "0 0 12px 0",
                  }}
                >
                  {audioError}
                </p>
              )}

              {editingArticle?.audio_url && (
                <audio
                  controls
                  src={editingArticle.audio_url}
                  style={{ width: "100%", opacity: 0.7 }}
                />
              )}
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
