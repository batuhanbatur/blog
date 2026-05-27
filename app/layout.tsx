import "./globals.css";
import NavbarWrapper from "./components/NavbarWrapper";

export const metadata = {
  title: "the blog",
  description: "a living reading platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}