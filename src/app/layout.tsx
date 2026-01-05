import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tu Progreso | Certificación San Marcos - Genera",
  description: "Visualiza tu progreso en la certificación de la Universidad Nacional Mayor de San Marcos. No pierdas el prestigio que has construido.",
  keywords: ["San Marcos", "Certificación", "Docentes", "Genera", "Progreso"],
  openGraph: {
    title: "Tu Progreso en San Marcos | Genera",
    description: "Visualiza cuánto has avanzado en tu certificación con San Marcos.",
    type: "website",
  },
  robots: "noindex, nofollow", // Landing privada, no indexar
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

