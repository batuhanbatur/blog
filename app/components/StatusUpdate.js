export default function StatusUpdate({ post }) {
  return (
    <div
      style={{
        marginLeft: "32px",
        maxWidth: "580px",
        border: "1px solid rgba(29, 29, 12, 0.15)",
        borderRadius: "8px",
        padding: "16px 20px",
        backgroundColor: "#CFCDD2",
        boxShadow: "2px 3px 0px rgba(29, 29, 12, 0.08)",
      }}
    >
      <p
        style={{
          fontSize: "15px",
          lineHeight: "1.6",
          color: "#1D1D0C",
          opacity: 0.75,
          margin: "0 0 8px 0",
          fontFamily: "monospace",
        }}
      >
        {post.content}
      </p>
      <span
        style={{
          fontSize: "11px",
          color: "#1D1D0C",
          opacity: 0.35,
          letterSpacing: "0.08em",
        }}
      >
        {post.date}
      </span>
    </div>
  )
}
