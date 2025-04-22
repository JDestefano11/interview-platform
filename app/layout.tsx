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
                  <Briefcase className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold text-white">PrepMaster</span>
                  </Link>
              </div>
              {/*Auth Buttons */}
        <div className="flex items-center space-x-3">
                <Link href="/signin">
                  <Button variant="default" size="sm" className="bg-[var(--auth-btn)] hover:bg-[var(--auth-btn-hover)] text-white cursor-pointer">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" size="sm" className="bg-[var(--secondary)] hover:bg-[var(--secondary-dark)] text-white cursor-pointer">
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
