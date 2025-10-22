import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Truth Link - Anonymous Messaging",
  description: "Share your thoughts anonymously. Connect authentically.",
  icons: {
    icon: "/images/truthlink.png",
    shortcut: "/images/truthlink.png",
    apple: "/images/truthlink.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors`}
        >
          <ThemeProvider>
            {children}
            <Toaster/>
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
