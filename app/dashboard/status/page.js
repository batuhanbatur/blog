"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function StatusDashboard() {
  const [view, setView] = useState("list")
  const [updates, setUpdates] = useState([])
  const [editingUpdate, setEditingUpdate] = useState(null)
  const [content, setContent] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUpdates()
  }, [])

  const fetchUpdates = async () => {
    const { data } = await supabase
      .from("status_updates")
      .select("*")
      .order("date", { ascending: false })
    if (data) setUpdates(data)
  }

  const handleNew = () => {
    setEditingUpdate(null)
    setContent("")
    setDate(new Date().toISOString().split("T")[0])
    setView("editor")
  }

  const handleEdit = update => {
    setEditingUpdate(update)
    setContent(update.content)
    setDate(update.date)
    setView("editor")
  }

  const handleDelete = async id => {
    if (!confirm("Delete this status update?")) return
    await supabase.from("status_updates").delete().eq("id", id)
    fetchUpdates()
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Content is required.")
      return
    }

    if (editingUpdate) {
      const { error } = await supabase
        .from("status_updates")
        .update({ content: content.trim(), date })
        .eq("id", editingUpdate.id)
      if (error) {
        setError(error.message)
        return
      }
    } else {
      const { error } = await supabase
        .from("status_updates")
        .insert([{ content: content.trim(), date }])
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
