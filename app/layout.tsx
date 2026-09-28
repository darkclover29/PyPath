import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PyPath — Your learning notebook",
  description: "A personal Python roadmap, reference notebook, and revision space.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

