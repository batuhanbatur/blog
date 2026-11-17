import "./globals.css";
import NavbarWrapper from "./components/NavbarWrapper";
import SurveyTriggerWrapper from "./components/SurveyTriggerWrapper";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const description =
  "A personal publishing platform by Batuhan Batur. Articles, status updates, and ideas. Organized by theme, built to last.";

export const metadata = {
  metadataBase: new URL("https://batuhanbatur.com"),
  // Pages that set their own title render as "Page title | Batuhan Batur".
  title: { default: "Batuhan Batur", template: "%s | Batuhan Batur" },
  description,
  openGraph: {
    type: "website",
    siteName: "Batuhan Batur",
    title: "Batuhan Batur",
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavbarWrapper />
        {children}
        <SurveyTriggerWrapper />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );  
}