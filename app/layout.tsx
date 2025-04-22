import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${monaSans.className} antialiased`}
        style={{isolation: "isolate"}}
      >
        {/* Simple Navigation Bar */}
        <nav className="sticky top-0 z-50"> 
          <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/*Logo*/}
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center"> 
                  <Briefcase className="h-6 w-6 text-[var(--primary)] mr-2 drop-shadow-[0_0_8px_rgba(79,70,229,0.7)]" />
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]">PrepMaster</span>
                </Link>
              </div>
              {/*Auth Buttons */}
              <div className="flex items-center space-x-3">
                <Link href="/signin" className="no-underline">
                  <Button variant="default" size="sm" className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 border border-[rgba(255,255,255,0.08)]">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" className="no-underline">
                  <Button variant="default" size="sm" className="bg-[var(--secondary)] hover:bg-[var(--secondary-light)] text-white cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 border border-[rgba(255,255,255,0.08)]">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
