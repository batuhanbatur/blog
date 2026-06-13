"use client"

export default function VideoEmbed({ title, url }) {
  return (
    <div style={{
      width: "100%",
      marginTop: "12px",
      marginBottom: "4px",
      borderRadius: "6px",
      overflow: "hidden",
      backgroundColor: "#1D1D0C",
    }}>
      <video
        src={url}
        controls
        playsInline
        style={{
          width: "100%",
          display: "block",
          maxHeight: "400px",
          objectFit: "contain",
        }}
        aria-label={title}
      />
    </div>
  )
}
