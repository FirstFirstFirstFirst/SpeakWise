// app/profile/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LanguageDialectSelector } from "@/components/language-dialect-selector";
import { LanguageDialectType, CountryType } from "@/types/user";
import { useProfileStore } from "@/stores/profileStore";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { country, languageDialect, saveProfile, isLoading } =
    useProfileStore();

  const [selectedCountry, setSelectedCountry] = useState<CountryType>(
    country as CountryType
  );
  const [selectedLanguageDialect, setSelectedLanguageDialect] =
    useState<LanguageDialectType>(languageDialect as LanguageDialectType);

  const handleSaveProfile = async () => {
    if (!selectedCountry || !selectedLanguageDialect) {
      toast.error("Please select both your country and language/dialect");
      return;
    }

    const success = await saveProfile({
      country: selectedCountry,
      languageDialect: selectedLanguageDialect,
    });

    if (success) {
      toast.success("Profile updated successfully!");
      router.push("/");
    } else {
      toast.error("Failed to update profile. Please try again.");
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
              className="flex-1 bg-black text-white"
              disabled={
                !selectedCountry || !selectedLanguageDialect || isLoading
              }
            >
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              You can always update your language preferences later in your
              profile settings
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
