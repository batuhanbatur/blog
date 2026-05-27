import "./globals.css";
import NavbarWrapper from "./components/NavbarWrapper";

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
      </body>
    </html>
  );  
}