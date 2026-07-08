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
          width: "100%",
          display: "block",
          objectFit: "contain",
        }}
      />
    </div>
  )
}
