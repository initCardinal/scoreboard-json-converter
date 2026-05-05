import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scoreboard JSON Converter",
  description: "Clinic performance scoreboard - Excel to JSON converter dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
