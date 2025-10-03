// app/layout.js (Server Component)
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import ClientProviders from "./components/ClientProviders"; // New wrapper

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Balanced Life - Your Life Management App",
  description: "Track tasks, manage your schedule, and stay motivated with Balanced Life.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-16x16.png",
  },
  openGraph: {
    title: "Balanced Life - Your Life Management App",
    description: "Track tasks, manage your schedule, and stay motivated with Balanced Life.",
    url: "https://yourwebsite.com/",
    type: "website",
    images: ["https://yourwebsite.com/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Balanced Life - Your Life Management App",
    description: "Track tasks, manage your schedule, and stay motivated with Balanced Life.",
    images: ["https://yourwebsite.com/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <ClientProviders>
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
