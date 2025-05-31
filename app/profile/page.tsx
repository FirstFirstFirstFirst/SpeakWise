"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LanguageDialectSelector } from "@/components/language-dialect-selector";
import { LanguageDialectType, CountryType } from "@/types/user";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<CountryType>();
  const [selectedLanguageDialect, setSelectedLanguageDialect] =
    useState<LanguageDialectType>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!selectedCountry || !selectedLanguageDialect) {
      toast.error("Please select both your country and language/dialect");
      return;
    }

    setIsLoading(true);
    try {
      // Save language dialect preference to database
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: selectedCountry,
          languageDialect: selectedLanguageDialect,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      toast.success("Profile completed successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10 max-w-4xl">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          Complete Your Profile
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Help us provide personalized English learning feedback based on your
          language background
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Language Background</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LanguageDialectSelector
            selectedCountry={selectedCountry}
            selectedLanguageDialect={selectedLanguageDialect}
            onCountrySelect={setSelectedCountry}
            onLanguageDialectSelect={setSelectedLanguageDialect}
            showTitle={false}
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              onClick={handleSaveProfile}
              className="flex-1"
              disabled={
                !selectedCountry || !selectedLanguageDialect || isLoading
              }
            >
              {isLoading ? "Saving..." : "Complete Profile"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              This information helps us provide better pronunciation and grammar
              feedback tailored to your native language
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
