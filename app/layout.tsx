import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BackToTop } from "@/components/BackToTop";
import "@/styles/site.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Iren Corner — Collabora con noi",
  description:
    "Programma commerciale Iren Corner: offerte energia, provvigioni e form di candidatura partner.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <div className="bg-orbs" aria-hidden="true">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="orb orb-3" />
        </div>
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
