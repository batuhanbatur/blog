"use client"

import GifWord from "./GifWord"
import { parseGifTriggers } from "../lib/parseGifTriggers"

export default function RichText({ content, style }) {
  const segments = parseGifTriggers(content)

  return (
    <span style={style}>
      {segments.map((seg, i) =>
        seg.type === "gif" ? (
          <GifWord key={i} phrase={seg.phrase} gifUrl={seg.gifUrl} />
        ) : (
          <span key={i}>{seg.content}</span>
        )
      )}
    </span>
  )
}
