import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Airlock — Autonomous risk protection for Perpl",
  description: "Monitor Perpl positions and automatically enforce deterministic safety policies before liquidation.",
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
