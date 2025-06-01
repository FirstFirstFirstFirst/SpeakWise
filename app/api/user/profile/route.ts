// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Retrieve user profile
export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        {
          userId: user.id,
          country: null,
          languageDialect: null,
          profileCompleted: false,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      userId: userProfile.userId,
      country: userProfile.country,
      languageDialect: userProfile.languageDialect,
      profileCompleted: !!userProfile.languageDialect,
      user: userProfile.user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create or update user profile
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { country, languageDialect } = await request.json();

    if (!country || !languageDialect) {
      return NextResponse.json(
        { error: "Country and language dialect are required" },
        { status: 400 }
      );
    }

    // First ensure User record exists
    await prisma.user.upsert({
      where: {
        userId: user.id,
      },
      update: {
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    });

    // Then create or update UserProfile
    const userProfile = await prisma.userProfile.upsert({
      where: {
        userId: user.id,
      },
      update: {
        country,
        languageDialect,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        country,
        languageDialect,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({
      success: true,
      profile: userProfile,
    });
  } catch (error) {
    console.error("Error saving user profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
