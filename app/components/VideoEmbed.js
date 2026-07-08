"use client"

export default function VideoEmbed({ title, url, ambient }) {
  return (
    <div
      style={{
        marginTop: "12px",
        marginBottom: "4px",
        borderRadius: "6px",
        overflow: "hidden",
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
        controlsList={!ambient ? "nodownload" : undefined}
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
