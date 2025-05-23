"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Record", href: "/" },
  { name: "Analysis", href: "/analysis" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white flex items-center justify-center">
      <div className="container flex h-14 items-center justify-between mx-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Mic className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">SpeakWise</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground font-medium underline"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex items-center space-x-4 ml-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.firstName || user.emailAddresses[0].emailAddress}
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
