"use client";

import { ClerkProvider } from "@clerk/nextjs";

interface ClerkProviderWrapperProps {
  children: React.ReactNode;
}

export function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-black hover:bg-gray-800 text-white",
          card: "shadow-lg border border-gray-200",
          headerTitle: "text-gray-900",
          headerSubtitle: "text-gray-600",
          socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
          formFieldInput: "border-gray-300 bg-white",
          footerActionLink: "text-black hover:text-gray-800",
        },
        variables: {
          colorPrimary: "#000000",
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#000000",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}