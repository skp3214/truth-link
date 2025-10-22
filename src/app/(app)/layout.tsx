import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Truth Link - Anonymous Messaging",
  description: "Share your thoughts anonymously. Connect authentically.",
  icons: {
    icon: "/images/truthlink.png",
    shortcut: "/images/truthlink.png",
    apple: "/images/truthlink.png",
  },
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
