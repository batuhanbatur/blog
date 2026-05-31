import Image from "next/image"

const img = {
  width: "100%",
  height: "auto",
  display: "block",
  borderRadius: "6px",
  border: "1px solid rgba(29,29,12,0.1)",
  boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
}

const h2 = {
  fontSize: "22px",
  fontWeight: "700",
  fontFamily: "Satoshi, sans-serif",
  color: "#1D1D0C",
  margin: 0,
}

const p = {
  fontSize: "16px",
  lineHeight: "1.85",
  color: "#1D1D0C",
  margin: 0,
  fontFamily: "Satoshi, sans-serif",
  opacity: 0.85,
}

const section = {
  display: "flex",
  flexDirection: "column",
  gap: "28px",
}

export default function TourPage() {
  return (
    <main
      className="tour-main"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "80px 24px 120px 24px",
        fontFamily: "Satoshi, sans-serif",
        backgroundColor: "#CCC6B8",
      }}
    >
      <style>{`
        .tour-three-col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          overflow: visible;
        }
        .tour-zoom-wrap {
          position: relative;
          z-index: 0;
          transition: transform 0.3s ease, z-index 0s 0.3s;
          cursor: zoom-in;
        }
        .tour-zoom-wrap:hover {
          transform: scale(1.7);
          z-index: 20;
          transition: transform 0.3s ease, z-index 0s 0s;
        }
        .tour-img-frame {
          aspect-ratio: 4/3;
          overflow: hidden;
          border-radius: 6px;
          border: 1px solid rgba(29,29,12,0.1);
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
          background: rgba(29,29,12,0.03);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 768px) {
          .tour-main { padding: 48px 20px 80px 20px !important; }
          .tour-three-col { grid-template-columns: 1fr !important; }
          .tour-zoom-wrap:hover { transform: none; }
        }
      `}</style>

      {/* Opening */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "80px" }}>
        <p style={{ ...p, fontSize: "17px", opacity: 1 }}>
          When I permanently deleted my Instagram and Twitter accounts, nothing about it felt wrong. But I didn't want to completely disappear from the internet. That's when I came up with this idea.
        </p>
        <p style={p}>
          I wanted a place for articles, status updates, and whatever else I found worth sharing. Something more personal than social media, but more alive than a traditional blog.
        </p>
        <p style={p}>
          As I built it, I kept finding small things that felt missing from the reading experience. Ways to make content easier to discover, easier to revisit, and more enjoyable to explore. What started as a simple blog gradually turned into something much larger.
        </p>
        <p style={p}>
          Another thing I enjoy about this project is that it's never really finished. If I think a feature would improve the experience, I can experiment with it immediately. Many of the ideas in this tour didn't exist when the project started.
        </p>
        <p style={p}>
          This guided tour walks through the decisions, features, and ideas that shaped it.
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "rgba(29,29,12,0.1)", marginBottom: "80px" }} />

      {/* Section 1: The Landing */}
      <div style={{ ...section, marginBottom: "80px" }}>
        <h2 style={h2}>The Landing</h2>
        <Image
          src="/tour/landing.png"
          alt="Landing page"
          width={1600}
          height={900}
          style={img}
        />
        <p style={p}>
          The first thing you see is the headline, <em>Things I Couldn't Keep to Myself</em>. It's set in Tanker, a display font that feels heavy and deliberate. I wanted the landing page to feel like a statement rather than a greeting.
        </p>
        <p style={p}>
          Below it sits the daily message. Every day it changes. It's pulled from Supabase and written by me in advance. It's not a quote widget. It's more like leaving a note on the door for whoever shows up.
        </p>
        <p style={p}>
          The profile photo sits to the right on desktop. Black and white, no caption. Together, the photo, headline, and daily message establish the tone of the site before a visitor reads a single article.
        </p>
      </div>

      {/* Section 2: The Timeline */}
      <div style={{ ...section, marginBottom: "80px" }}>
        <h2 style={h2}>The Timeline</h2>
        <Image
          src="/tour/timeline.png"
          alt="Timeline"
          width={1600}
          height={900}
          style={img}
        />
        <p style={p}>
          The homepage is a reverse-chronological timeline of everything I publish. Articles and status updates live together in the same feed.
        </p>
        <p style={p}>
          I loved the idea of keeping them side by side. Sometimes a thought grows into an article. Sometimes it doesn't. Either way, both belong to the same timeline.
        </p>
        <p style={p}>
          Articles show their title, tags, reading time, and an opening excerpt. Status updates are intentionally lighter. No title, no preview, just a thought captured in the moment.
        </p>
        <p style={p}>
          Between entries sits a sword divider inspired by the Blade of the Ruined King. I originally used a simple "|" character, but it never felt right. Each entry is its own story, and I wanted a stronger sense of separation between them without adding visual noise.
        </p>
        <p style={p}>
          Further down the timeline, returning visitors may notice a marker called <em>Where You Left Off</em>. The site quietly keeps track of what has already been read and places a divider before the first unread item.
        </p>
        <p style={p}>
          The feature exists because I imagined someone returning to the blog after a few days or weeks. If they've been following along and enjoying the content, they shouldn't have to remember where they stopped. The site remembers for them. It's a small detail, but one that helps the space feel a little more familiar each time someone comes back.
        </p>
      </div>

      {/* Section 3: Reading an Article */}
      <div style={{ ...section, marginBottom: "80px" }}>
        <h2 style={h2}>Reading an Article</h2>
        <Image
          src="/tour/article-full.png"
          alt="Article page"
          width={1600}
          height={900}
          style={img}
        />
        <p style={p}>
          Article pages are intentionally simple. The title, tags, date, and reading time sit at the top. Below that, the content.
        </p>
        <p style={p}>
          But the content layer has more depth than it first appears. While writing, I can annotate any word or phrase using a custom inline syntax. There are three types: a word definition that displays a small card with an explanation and optional phonemic transcription, an article preview that surfaces a related piece with a <em>Check it out</em> / <em>No thanks</em> prompt, and a GIF popup connected to the text by a small SVG line. All three appear on hover without taking the reader away from the page.
        </p>
        <div className="tour-three-col">
          <div className="tour-zoom-wrap">
            <div className="tour-img-frame">
              <Image
                src="/tour/hover-word.png"
                alt="Hover word explanation"
                width={800}
                height={600}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
          <div className="tour-zoom-wrap">
            <div className="tour-img-frame">
              <Image
                src="/tour/hover-link-article.png"
                alt="Hover link article preview"
                width={800}
                height={600}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
          <div className="tour-zoom-wrap">
            <div className="tour-img-frame">
              <Image
                src="/tour/hover-gif.png"
                alt="Hover GIF popup"
                width={800}
                height={600}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
        <p style={p}>
          At the bottom, a <em>You May Also Like</em> section suggests articles from the same collection. These collections are generated through AI classification, with each article assigned to the theme that best fits its content. The recommendation system simply uses those classifications, allowing related articles to connect automatically as the archive grows.
        </p>
      </div>

      {/* Section 4: Collections & Articles */}
      <div style={{ ...section, marginBottom: "80px" }}>
        <h2 style={h2}>Collections & Articles</h2>
        <Image
          src="/tour/articles-section.png"
          alt="Articles section"
          width={1600}
          height={900}
          style={img}
        />
        <p style={p}>
          The Articles page organizes everything by theme rather than date. The subheadline says it plainly: <em>Organized by theme. Not by date.</em>
        </p>
        <p style={p}>
          Each collection appears as a card containing a title, a one-line description, and the articles that belong to it. The descriptions are written by GPT-4o. Given a collection name and its articles, it generates a single evocative line that captures the mood of the group.
        </p>
        <p style={p}>
          The collections themselves are determined during article classification. When I publish something new from the dashboard, GPT-4o-mini reads the content and decides which existing collection it belongs to, or proposes a new one if nothing fits. I review and approve every suggestion before anything goes live.
        </p>
        <p style={p}>
          The result is an archive that evolves alongside the writing. As new articles are published, existing collections deepen, new ones emerge, and the structure grows without requiring manual sorting.
        </p>
      </div>

      {/* Section 5: The Small Things */}
      <div style={{ ...section, marginBottom: "80px" }}>
        <h2 style={h2}>The Small Things</h2>
        <p style={p}>
          Most visitors won't notice these features immediately, and that's the point. They exist to make the experience feel a little more personal over time.
        </p>
        <p style={p}>
          The blog uses localStorage to remember where a visitor left off. As the timeline grows, returning readers can quickly find their place instead of searching through everything they've already seen. Once someone has read every available article, they're greeted with a simple message: <em>There's nothing left to read. Thank you.</em>
        </p>
        <p style={p}>
          The site also keeps track of repeat visits. After someone returns several times, they're invited to participate in a short survey. The goal isn't marketing or lead generation. It's learning who keeps coming back and why.
        </p>
        <p style={p}>
          The survey asks simple questions: Are you a recruiter, a friend, another developer, or just passing by? What made you return? Which features stood out? Did anything feel confusing?
        </p>
        <p style={p}>
          Individually, these features are small. Together, they help the site adapt to its visitors rather than treating every visit as if it were the first.
        </p>
      </div>

      {/* Section 6: The Dashboard */}
      <div style={{ ...section }}>
        <h2 style={h2}>The Dashboard</h2>
        <Image
          src="/tour/dashboard.png"
          alt="Dashboard"
          width={1600}
          height={900}
          style={img}
        />
        <p style={p}>
          The dashboard is where everything is managed. Articles, status updates, daily messages, and the archive each have their own section. It lives behind authentication and is completely separate from the public-facing experience.
        </p>
        <p style={p}>
          The most important part is the publishing workflow. After writing an article, I can trigger AI classification directly from the dashboard. GPT-4o-mini reads the content and returns topics, tone tags, an estimated reading time, and a collection assignment. Every suggestion is reviewed and can be edited before publication.
        </p>
        <p style={p}>
          The goal isn't to automate writing. It's to automate organization. The AI handles the repetitive tasks that would otherwise become difficult to maintain as the archive grows, while every publishing decision remains under human control.
        </p>
        <p style={p}>
          Throughout the project, AI is treated as an assistant rather than an author. It helps organize, classify, and connect content, but the final judgment always stays with me.
        </p>
      </div>
    </main>
  )
}
