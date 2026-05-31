# the-blog

A personal publishing platform built as a living archive. Live at batuhanbatur.com, also available as a guided tour at batuhanbatur.com/tour.

---

## What it is

Most blogs are static archives. This project takes a different approach. Articles and status updates share the same timeline, returning visitors can continue where they left off, and content organizes itself into evolving collections as new writing is added.

From the beginning, the goal was to build something closer to a publishing platform than a traditional blog. A place where writing, discovery, and continuity all play a role in the experience.

---

## Features

### Reading Experience

- Mixed timeline of articles and status updates in reverse chronological order
- Inline content markers: word definitions with phonemic transcription, article preview cards, and GIF popups, all rendered on hover from a custom syntax
- "Where You Left Off" marker — localStorage tracks read content and places a divider before the first unread item
- Reading continuity across sessions

### Discovery

- Articles organized into collections by theme rather than date
- AI classification on publish: topics, tone tags, reading time, and collection assignment
- "You May Also Like" recommendations driven by collection matching
- AI-generated collection descriptions via GPT-4o

### Engagement

- Repeat-visit tracking with an anonymous visitor survey
- Daily message on the landing page, written in advance and delivered from Supabase
- Archive page containing all past daily messages

### Dashboard

- Full content management for articles, status updates, daily messages, and archives
- AI classification triggered on demand, reviewed and approved before publishing
- Authentication-protected and hidden from public navigation

---

## Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **AI:** GPT-4o-mini (classification), GPT-4o (collection descriptions)
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics + Speed Insights
- **Contact:** Formspree

---

## AI Layer

AI is used as an organizer, not an author.

When a new article is published, GPT-4o-mini reads the content and generates a classification containing primary and secondary topics, tone tags, estimated reading time, and a collection assignment. GPT-4o generates a one-line description for each collection.

Every suggestion is reviewed before anything goes live. The writing is mine. The final judgment is mine too.

---

## Guided Tour

A complete walkthrough of the platform, its features, design decisions, and technical implementation is available at:

https://batuhanbatur.com/tour

---

## What's Next

- Stories, a new content format for shorter, more visual entries
- Portfolio, a dedicated portfolio site connected to the platform
- Additional content markers, including Spotify embeds, video previews, and new interactive inline elements
- Collection management tools within the dashboard
- Codebase cleanup and gradual migration toward CSS Modules

---

## Philosophy

AI helps organize the archive. The platform helps readers discover content. The writing remains human.
