import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avalon Hideout Mapper",
  description: "Track hideouts across the Avalon roads of Albion Online",
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
