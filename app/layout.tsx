import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "the blog",
  description: "a living reading platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}