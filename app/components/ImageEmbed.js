"use client"

export default function ImageEmbed({ alt, url }) {
  return (
    <div
      style={{
        display: "inline-block",
        maxWidth: "60%",
        marginTop: "12px",
        marginBottom: "4px",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      <img
        src={url}
        alt={alt}
        style={{
          display: "block",
          width: "100%",
          borderRadius: "6px",
          objectFit: "contain",
        }}
      />
    </div>
  )
}
