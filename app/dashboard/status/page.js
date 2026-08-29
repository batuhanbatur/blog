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

export default function StatusDashboard() {
  const [view, setView] = useState("list")
  const [updates, setUpdates] = useState([])
  const [editingUpdate, setEditingUpdate] = useState(null)
  const [content, setContent] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [tag, setTag] = useState("")
  const [newTag, setNewTag] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const [showGifPanel, setShowGifPanel] = useState(false)
  const [gifPhrase, setGifPhrase] = useState("")
  const [gifSearchQuery, setGifSearchQuery] = useState("")
  const [giphyResults, setGiphyResults] = useState([])
  const [selectedGif, setSelectedGif] = useState(null)
  const [gifSearching, setGifSearching] = useState(false)

  const textareaRef = useRef(null)

  const fetchUpdates = async () => {
    const { data } = await supabase
      .from("status_updates")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) setUpdates(data)
  }

  useEffect(() => {
    fetchUpdates()
  }, [])

  const resetGifPanel = () => {
    setShowGifPanel(false)
    setGifPhrase("")
    setGifSearchQuery("")
    setGiphyResults([])
    setSelectedGif(null)
  }

  const handleNew = () => {
    setEditingUpdate(null)
    setContent("")
    setDate(new Date().toISOString().split("T")[0])
    setTag("")
    setNewTag("")
    resetGifPanel()
    setView("editor")
  }

  const handleEdit = update => {
    setEditingUpdate(update)
    setContent(update.content)
    setDate(update.date)
    setTag(update.tag || "")
    setNewTag("")
    resetGifPanel()
    setView("editor")
  }

  const handleDelete = async id => {
    if (!confirm("Delete this status update?")) return
    await supabase.from("status_updates").delete().eq("id", id)
    fetchUpdates()
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

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Content is required.")
      return
    }

    if (editingUpdate) {
      const { data, error } = await supabase
        .from("status_updates")
        .update({ content: content.trim(), date, tag: tag || null })
        .eq("id", editingUpdate.id)
        .select()
      console.log("update result:", data, "error:", error, "tag state:", tag)
      if (error) {
        setError(error.message)
        return
      }
    } else {
      const { error } = await supabase
        .from("status_updates")
        .insert([{ content: content.trim(), date, tag: tag || null }])
      if (error) {
        setError(error.message)
        return
      }
    }

    await fetchUpdates()
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

  const existingTags = [...new Set(updates.map(u => u.tag).filter(Boolean))]

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
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
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
                ? "Status Updates"
                : editingUpdate
                  ? "Edit Update"
                  : "New Update"}
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
            {updates.length === 0 && (
              <p style={{ opacity: 0.4, fontSize: "14px" }}>
                No status updates yet.
              </p>
            )}
            {updates.map(update => (
              <div
                key={update.id}
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
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "14px",
                      fontFamily: "monospace",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {update.content}
                  </p>
                  <p style={{ margin: 0, fontSize: "11px", opacity: 0.4 }}>
                    {update.date}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={() => handleEdit(update)}
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
                    onClick={() => handleDelete(update.id)}
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
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{ ...inputStyle, width: "auto" }}
              />
            </div>

            <div>
              <label style={labelStyle}>Content</label>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="What's on your mind?"
                style={{
                  ...inputStyle,
                  minHeight: "160px",
                  resize: "vertical",
                  lineHeight: "1.6",
                  fontFamily: "monospace",
                }}
              />
            </div>

            {/* Tag */}
            <div>
              <label style={labelStyle}>Tag</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                {existingTags.map(t => {
                  const selected = tag === t
                  return (
                    <button
                      key={t}
                      onClick={() => setTag(selected ? "" : t)}
                      style={{
                        ...gifBtnStyle,
                        textTransform: "none",
                        ...(selected
                          ? { backgroundColor: "#CCC6B8", color: "#1D1D0C" }
                          : {}),
                      }}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  style={inputStyle}
                  placeholder="New tag, e.g. PENTAKILL"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && newTag.trim()) {
                      setTag(newTag.trim())
                      setNewTag("")
                    }
                  }}
                />
                <button
                  onClick={() => {
                    setTag(newTag.trim())
                    setNewTag("")
                  }}
                  disabled={!newTag.trim()}
                  style={{
                    ...gifBtnStyle,
                    opacity: !newTag.trim() ? 0.3 : 1,
                    cursor: !newTag.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  Set
                </button>
              </div>
              {tag && !existingTags.includes(tag) && (
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "11px",
                    opacity: 0.4,
                  }}
                >
                  New tag: {tag}
                </p>
              )}
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "12px", opacity: 0.3 }}>
                {content.length} characters
              </span>
              <button
                onClick={handleSubmit}
                style={{
                  backgroundColor: submitted
                    ? "rgba(204, 198, 184, 0.2)"
                    : "#CCC6B8",
                  color: "#1D1D0C",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 24px",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: "600",
                }}
              >
                {submitted ? "Saved ✓" : editingUpdate ? "Update" : "Post"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
