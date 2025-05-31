import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { LanguageDialectType, CountryType } from "@/types/user";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { country, languageDialect } = await request.json();

    if (!country || !languageDialect) {
      return NextResponse.json(
        { error: "Country and language dialect are required" },
        { status: 400 }
      );
    }

    // Create or update user profile
    const userProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        country: country as CountryType,
        languageDialect: languageDialect as LanguageDialectType,
      },
      create: {
        userId,
        country: country as CountryType,
        languageDialect: languageDialect as LanguageDialectType,
      },
    });

    return NextResponse.json({
      success: true,
      profileId: userProfile.id,
    });
  } catch (error) {
    console.error("Error saving user profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
      select: {
        country: true,
        languageDialect: true,
      },
    });

    if (!userProfile || !userProfile.languageDialect) {
      return NextResponse.json({
        profileCompleted: false,
      });
    }

    return NextResponse.json({
      profileCompleted: true,
      country: userProfile.country,
      languageDialect: userProfile.languageDialect,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
