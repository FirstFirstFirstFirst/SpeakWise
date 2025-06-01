import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProviderWrapper } from "@/app/providers/clerk-provider";
const inter = Inter({ subsets: ["latin"] });
import { ProfileProtection } from "@/components/profile-protection";

export const metadata: Metadata = {
  title: "SpeakWise - English Language Learning",
  description: "Unlock your English speaking potential with SpeakWise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProviderWrapper>
      <html lang="en">
        <body className={inter.className}>
          <ProfileProtection>
            <div className="min-h-screen flex flex-col bg-background">
              <Navbar />
              <main className="flex-1 flex items-center justify-center">
                {children}
              </main>
              <Toaster />
            </div>
          </ProfileProtection>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
