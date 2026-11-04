import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Geist_Mono, Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roof Insulation — ESSB Virtual Lab · SRM IST",
  description:
    "Reflect sunlight before it enters the building — insulate against the heat that still gets through. An interactive simulation of the ESSB working model: two houses, one heat source, and a 10.8°C difference.",
  keywords: [
    "Roof Insulation",
    "Cool Roof",
    "ESSB",
    "Energy Systems in Sustainable Buildings",
    "SRM IST",
    "Heat Lamp Experiment",
    "Interactive Simulation",
  ],
  authors: [{ name: "ESSB Project Team — SRM IST KTR" }],
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH}/roof-icon.svg`,
  },
  openGraph: {
    title: "Roof Insulation — ESSB Virtual Lab",
    description:
      "Two cardboard houses, one heat lamp, one 10.8°C difference. Run the interactive roof-insulation simulation.",
    siteName: "ESSB · Roof Insulation",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sora.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
