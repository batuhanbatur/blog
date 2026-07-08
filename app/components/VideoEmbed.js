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
        display: "flex",
        justifyContent: "center",
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
          display: "block",
          maxHeight: "400px",
          borderRadius: "6px",
        }}
        aria-label={title}
      />
    </div>
  )
}
