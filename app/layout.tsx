import "./globals.css";
import NavbarWrapper from "./components/NavbarWrapper";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Batuhan Batur",
  description: "A personal publishing platform by Batuhan Batur. Articles, status updates, and ideas. Organized by theme, built to last.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavbarWrapper />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );  
}