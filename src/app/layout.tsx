import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "GitHub Sanity",
  description: "Stop the insanity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
