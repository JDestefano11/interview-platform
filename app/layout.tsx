import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import ScrollNavbar from "@/components/ScrollNavbar";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntelliView",
  description: "Ace your next interview with IntelliView",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${monaSans.className} antialiased overflow-x-hidden p-0 m-0`} suppressHydrationWarning>
        {/* Global background for the entire application */}
        <div className="fixed inset-0 -z-50">
          {/* Neural network nodes */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,56,100,0.08)_0%,rgba(255,56,100,0.02)_35%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(0,246,197,0.07)_0%,rgba(0,246,197,0.02)_35%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_85%,rgba(1,205,254,0.08)_0%,rgba(1,205,254,0.02)_35%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_75%,rgba(156,66,245,0.07)_0%,rgba(156,66,245,0.02)_35%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,199,0,0.05)_0%,rgba(255,199,0,0.01)_45%,transparent_60%)]"></div>
          
          {/* Conic gradient color waves */}
          <div className="absolute inset-0 bg-[conic-gradient(from_225deg_at_50%_50%,rgba(77,77,255,0.12)_0deg,rgba(1,205,254,0.08)_90deg,rgba(156,66,245,0.10)_180deg,rgba(0,246,197,0.08)_270deg,rgba(77,77,255,0.12)_360deg)]"></div>
          
          {/* Base gradient */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#050A18_0%,#0E1428_35%,#1E0B38_65%,#1A2138_100%)]"></div>
        </div>
        <ScrollNavbar />
        {children}
      </body>
    </html>
  );
}
