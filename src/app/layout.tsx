import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://palawandailynews.ph"),
  title: {
    default: "Palawan Daily News",
    template: "%s | Palawan Daily News",
  },
  description: "Palawan's premier source for local news, breaking stories, and in-depth reporting on the Philippines' last ecological frontier.",
  keywords: ["Palawan", "news", "Philippines", "Puerto Princesa", "El Nido", "Coron"],
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://palawandailynews.ph",
    siteName: "Palawan Daily News",
    title: "Palawan Daily News",
    description: "Palawan's premier source for local news, breaking stories, and in-depth reporting.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Palawan Daily News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Palawan Daily News",
    description: "Palawan's premier source for local news, breaking stories, and in-depth reporting.",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import SmoothScroll from "@/components/public/SmoothScroll";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, playfair.variable, "font-sans", geist.variable)}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SmoothScroll />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
