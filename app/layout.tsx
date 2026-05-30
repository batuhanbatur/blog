import "./globals.css";
import NavbarWrapper from "./components/NavbarWrapper";
import SurveyTrigger from "./components/SurveyTrigger";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "the blog",
  description: "a living reading platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavbarWrapper />
        {children}
        <SurveyTrigger />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );  
}