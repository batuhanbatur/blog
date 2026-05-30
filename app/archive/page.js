import { unstable_noStore as noStore } from "next/cache"
import { supabase } from "../lib/supabase"

export default async function ArchivePage() {
  noStore()

  const { data: messages } = await supabase
    .from("daily_messages")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <main
      className="archive-main"
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "80px 24px",
        fontFamily: "Satoshi, sans-serif",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .archive-main { padding: 48px 20px !important; }
          .archive-title { font-size: 36px !important; }
          .archive-subtitle { margin-bottom: 40px !important; }
          .archive-quote { font-size: 18px !important; }
        }
      `}</style>

      <h1
        className="archive-title"
        style={{
          fontSize: "48px",
          fontWeight: "800",
          fontFamily: "Tanker, sans-serif",
          color: "#1D1D0C",
          lineHeight: "1.0",
          margin: "0 0 16px 0",
        }}
      >
        ARCHIVE
      </h1>

      <p
        className="archive-subtitle"
        style={{
          fontSize: "14px",
          color: "#1D1D0C",
          opacity: 0.5,
          margin: "0 0 64px 0",
          lineHeight: "1.6",
        }}
      >
        Every daily message, in order.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {messages && messages.length === 0 && (
          <p style={{ opacity: 0.4, fontSize: "14px" }}>No messages yet.</p>
        )}
        {messages &&
          messages.map(msg => (
            <div
              key={msg.id}
              style={{
                borderBottom: "1px solid rgba(29, 29, 12, 0.08)",
                paddingBottom: "32px",
              }}
            >
              <p
                className="archive-quote"
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  fontFamily: "Tanker, sans-serif",
                  color: "#1D1D0C",
                  margin: "0 0 8px 0",
                  lineHeight: "1.3",
                }}
              >
                "{msg.quote}"
              </p>
              <p
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#1D1D0C",
                  opacity: 0.5,
                  margin: "0 0 8px 0",
                  fontFamily: "Aktura, sans-serif",
                }}
              >
                — {msg.attribution}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#1D1D0C",
                  opacity: 0.3,
                  margin: 0,
                }}
              >
                {msg.date ||
                  new Date(msg.created_at).toLocaleDateString("en-GB")}
              </p>
            </div>
          ))}
      </div>
    </main>
  )
}
