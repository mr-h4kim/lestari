import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "LESTARI — Warisan Tengger, hidup bersama",
  description:
    "Ruang pengetahuan dan dokumentasi budaya Tengger. Prototype dengan data demonstrasi.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
