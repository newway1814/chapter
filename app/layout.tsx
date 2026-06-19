import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chapter — Your AI Voice Journal",
  description:
    "Record 60 seconds a day. Chapter turns your voice into a monthly narrative documentary — a private memoir written by you, shaped by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="page-shell">{children}</body>
    </html>
  );
}
