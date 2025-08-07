import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
// 1. IMPORT THE CLERK PROVIDER
import { ClerkProvider } from '@clerk/nextjs';
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FeasAI",
  description: "Feasibility studies powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. WRAP THE ENTIRE <html> TAG WITH THE PROVIDER
    <ClerkProvider>
      <html lang="en">
        
        
        <body
          // Your existing body classes are untouched
          className={`${geistSans.variable} antialiased bg-[#030a03] text-white`}
        >
          {/* Your existing layout structure is untouched */}
          <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
            
            {/* Shared Background Effects */}
            <div
              className="absolute inset-0 z-0 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, #0a1d0a, #0a1d0a 60px, #030a03 60px, #030a03 120px)",
              }}
            />
            <div className="absolute inset-0 z-0 bg-black opacity-30" />

            {/* Shared Navbar */}
            <Navbar />

            {/* Shared <main> wrapper is untouched */}
            <main className="z-10 flex-1 flex flex-col items-center text-center w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-12">
             <Providers> 
                      {children}
             </Providers>
              
            </main>
            
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}