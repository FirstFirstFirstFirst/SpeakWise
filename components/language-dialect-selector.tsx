"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { LanguageDialectType, CountryType } from "@/types/user";
import {
  getProfilesByCountry,
  getAllCountries,
  getProfileById,
} from "@/utils/lm-language-dialect-profiles";

// Import flag-icons CSS
import "flag-icons/css/flag-icons.min.css";

interface LanguageDialectSelectorProps {
  selectedCountry?: CountryType;
  selectedLanguageDialect?: LanguageDialectType;
  onCountrySelect: (country: CountryType) => void;
  onLanguageDialectSelect: (languageDialect: LanguageDialectType) => void;
  showTitle?: boolean;
}

export function LanguageDialectSelector({
  selectedCountry,
  selectedLanguageDialect,
  onCountrySelect,
  onLanguageDialectSelect,
  showTitle = true,
}: LanguageDialectSelectorProps) {
  const [expandedCountry, setExpandedCountry] = useState<CountryType | null>(
    selectedCountry || null
  );
  const [expandedProfile, setExpandedProfile] =
    useState<LanguageDialectType | null>(null);

  const countries = getAllCountries();
  const countryNames: Record<CountryType, string> = {
    china: "China",
    myanmar: "Myanmar",
    laos: "Laos",
    thailand: "Thailand",
    cambodia: "Cambodia",
    vietnam: "Vietnam",
    other: "Other",
  };

  const profileFlagCodes: Record<LanguageDialectType, string | null> = {
    // China
    "mandarin-standard": "cn",
    "mandarin-beijing": "cn",
    "mandarin-northeastern": "cn",
    "cantonese-hongkong": "hk",
    "cantonese-guangzhou": "cn",
    "wu-shanghai": "cn",
    "min-fujian": "cn",
    "hakka-taiwan": "tw",

    // Myanmar
    "burmese-standard": "mm",
    "burmese-yangon": "mm",
    "burmese-mandalay": "mm",
    "shan-northern": "mm",
    "karen-sgaw": "mm",

    // Laos
    "lao-vientiane": "la",
    "lao-luang-prabang": "la",
    "lao-southern": "la",
    "hmong-white": "la",
    "khmu-northern": "la",

    // Thailand
    "thai-central": "th",
    "thai-northern": "th",
    "thai-northeastern": "th",
    "thai-southern": "th",

    // Cambodia
    "khmer-phnom-penh": "kh",
    "khmer-battambang": "kh",
    "khmer-siem-reap": "kh",

    // Vietnam
    "vietnamese-northern": "vn",
    "vietnamese-central": "vn",
    "vietnamese-southern": "vn",

    // General
    general: null,
  };

  // Map countries to their ISO codes for flag-icons
  const countryFlags: Record<CountryType, string> = {
    china: "cn",
    myanmar: "mm",
    laos: "la",
    thailand: "th",
    cambodia: "kh",
    vietnam: "vn",
    other: "", // No flag for "other"
  };

  const handleCountryClick = (country: CountryType) => {
    if (expandedCountry === country) {
      setExpandedCountry(null);
    } else {
      setExpandedCountry(country);
      onCountrySelect(country);
    }
    setExpandedProfile(null);
  };

  const handleProfileClick = (profileId: LanguageDialectType) => {
    if (expandedProfile === profileId) {
      setExpandedProfile(null);
    } else {
      setExpandedProfile(profileId);
    }
  };

  const handleSelectProfile = (profileId: LanguageDialectType) => {
    onLanguageDialectSelect(profileId);
    setExpandedProfile(null);
  };

  const selectedProfile = selectedLanguageDialect
    ? getProfileById(selectedLanguageDialect)
    : null;

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">
              Choose Your Language Background
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Select your country and native language/dialect for personalized
            English learning feedback
          </p>
        </div>
      )}

      {/* Country Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">1. Select Your Country</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {countries.map((country) => (
            <Card
              key={country}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedCountry === country
                  ? "ring-2 ring-primary border-primary"
                  : "border-border"
              }`}
              onClick={() => handleCountryClick(country)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {country === "other" ? (
                      <Globe className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      <span
                        className={`fi fi-${countryFlags[country]} text-xl`}
                      ></span>
                    )}
                    <span className="font-medium">{countryNames[country]}</span>
                  </div>
                  {selectedCountry === country && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Language/Dialect Selection */}
      {expandedCountry && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">
            2. Select Your Language/Dialect
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({countryNames[expandedCountry]})
            </span>
          </h3>
          <div className="space-y-3">
            {getProfilesByCountry(expandedCountry).map((profile) => (
              <Card
                key={profile.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedLanguageDialect === profile.id
                    ? "ring-2 ring-primary border-primary"
                    : "border-border"
                }`}
                onClick={() => handleProfileClick(profile.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center space-x-3">
                      {/* Updated flag rendering - check if profile.flag is ISO code or emoji */}
                      {profileFlagCodes[profile.id] ? (
                        <span
                          className={`fi fi-${
                            profileFlagCodes[profile.id]
                          } text-xl`}
                        ></span>
                      ) : (
                        <span className="text-xl">{profile.flag}</span>
                      )}
                      <div>
                        <div className="font-medium">{profile.name}</div>
                        <div className="text-sm text-muted-foreground font-normal">
                          {profile.nativeName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedLanguageDialect === profile.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                      {expandedProfile === profile.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {profile.description} • {profile.speakers}
                  </p>
                </CardHeader>

                {expandedProfile === profile.id && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Tonal System Info */}
                      {profile.tonalSystem && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-blue-900 mb-1">
                            Tonal System
                          </h4>
                          <p className="text-xs text-blue-800">
                            {profile.tonalSystem.description}
                          </p>
                        </div>
                      )}

                      {/* Common Challenges */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Common English Learning Challenges:
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {profile.commonChallenges
                            .slice(0, 4)
                            .map((challenge, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-2"
                              >
                                <span className="text-primary mt-1">•</span>
                                <span>{challenge}</span>
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Learning Focus */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Our Focus Areas for You:
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {profile.learningFocus.map((focus, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <span className="text-green-600 mt-1">✓</span>
                              <span>{focus}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedProfile(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectProfile(profile.id);
                          }}
                        >
                          Select This Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {selectedProfile && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{selectedProfile.flag}</span>
            <div>
              <h4 className="font-medium text-green-900">
                Selected: {selectedProfile.name}
              </h4>
              <p className="text-sm text-green-700">
                {selectedProfile.nativeName} • {selectedProfile.description}
              </p>
            </div>
          </div>
          <div className="mt-3 text-xs text-green-600">
            ✓ Your feedback will be customized for {selectedProfile.name}{" "}
            speakers learning English
          </div>
        </div>
      )}
    </div>
  );
}
