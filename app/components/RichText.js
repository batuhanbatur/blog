"use client"

import GifWord from "./GifWord"
import ArticleWord from "./ArticleWord"
import WordCard from "./WordCard"
import VideoEmbed from "./VideoEmbed"
import ImageEmbed from "./ImageEmbed"
import { parseContentMarkers } from "../lib/parseContentMarkers"

export default function RichText({ content, style }) {
  const segments = parseContentMarkers(content)

  return (
    <div style={style}>
      {segments.map((seg, i) =>
        seg.type === "gif" ? (
          <GifWord key={i} phrase={seg.phrase} gifUrl={seg.gifUrl} />
        ) : seg.type === "article" ? (
          <ArticleWord key={i} phrase={seg.phrase} slug={seg.slug} />
        ) : seg.type === "word" ? (
          <WordCard
            key={i}
            phrase={seg.phrase}
            explanation={seg.explanation}
            phonemic={seg.phonemic}
          />
        ) : seg.type === "video" ? (
          <VideoEmbed
            key={i}
            title={seg.title}
            url={seg.url}
            ambient={seg.ambient}
          />
        ) : seg.type === "image" ? (
          <ImageEmbed key={i} alt={seg.alt} url={seg.url} />
        ) : (
          <span key={i}>{seg.content}</span>
        ),
      )}
    </div>
  )
}
