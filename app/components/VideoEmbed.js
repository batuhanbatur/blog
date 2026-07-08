"use client"

export default function VideoEmbed({ title, url, ambient }) {
  return (
    <div
      style={{
        width: "100%",
        marginTop: "12px",
        marginBottom: "4px",
        borderRadius: "6px",
        overflow: "hidden",
        backgroundColor: "#1D1D0C",
      }}
    >
      <video
        src={url}
        autoPlay={ambient}
        loop={ambient}
        muted={ambient}
        playsInline={ambient}
        controls={!ambient}
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
