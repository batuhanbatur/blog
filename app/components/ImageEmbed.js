"use client"

export default function ImageEmbed({ alt, url }) {
  return (
    <div
      style={{
        width: "100%",
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
          maxWidth: "60%",
          borderRadius: "6px",
          objectFit: "contain",
        }}
      />
    </div>
  )
}
