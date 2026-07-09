import type { Metadata } from "next";
import "@/styles/anteprima.css";

const siteUrl = process.env.APP_URL ?? "https://irencornerita.it";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Iren Corner — Anteprima",
  description:
    "Anteprima grafica del programma commerciale Iren Corner per condivisione via email.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnteprimaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
