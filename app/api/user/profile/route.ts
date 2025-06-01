// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Retrieve user profile
export async function GET() {
  console.log("🔍 GET /api/user/profile - Starting request");

  try {
    const user = await currentUser();
    console.log(
      "👤 Current user:",
      user
        ? { id: user.id, email: user.emailAddresses[0]?.emailAddress }
        : "No user"
    );

    if (!user) {
      console.log("❌ Unauthorized - No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`🔎 Searching for user profile with userId: ${user.id}`);

    // Get user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    console.log("📋 User profile found:", userProfile ? "Yes" : "No");

    if (!userProfile) {
      console.log("📄 Returning default profile structure for new user");
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

    const response = {
      userId: userProfile.userId,
      country: userProfile.country,
      languageDialect: userProfile.languageDialect,
      profileCompleted: !!userProfile.languageDialect,
      user: userProfile.user,
    };

    console.log("✅ Successfully returning user profile:", {
      userId: response.userId,
      country: response.country,
      languageDialect: response.languageDialect,
      profileCompleted: response.profileCompleted,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 Error in GET /api/user/profile:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  } finally {
    console.log("🔌 Disconnecting from Prisma");
    await prisma.$disconnect();
  }
}

// POST - Create or update user profile
export async function POST(request: NextRequest) {
  console.log("📝 POST /api/user/profile - Starting request");

  try {
    const user = await currentUser();
    console.log(
      "👤 Current user:",
      user
        ? { id: user.id, email: user.emailAddresses[0]?.emailAddress }
        : "No user"
    );

    if (!user) {
      console.log("❌ Unauthorized - No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await request.json();
    console.log("📦 Request body received:", requestBody);

    const { country, languageDialect } = requestBody;

    if (!country || !languageDialect) {
      console.log("⚠️ Validation failed - Missing required fields:", {
        country: !!country,
        languageDialect: !!languageDialect,
      });
      return NextResponse.json(
        { error: "Country and language dialect are required" },
        { status: 400 }
      );
    }

    console.log("✅ Validation passed - Creating/updating profile with:", {
      country,
      languageDialect,
    });

    // First ensure User record exists
    console.log("👥 Upserting User record...");
    const userUpsert = await prisma.user.upsert({
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

    console.log("👥 User record upserted:", {
      userId: userUpsert.userId,
      email: userUpsert.email,
      operation:
        userUpsert.createdAt === userUpsert.updatedAt ? "created" : "updated",
    });

    // Then create or update UserProfile
    console.log("📋 Upserting UserProfile record...");
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

    console.log("📋 UserProfile record upserted:", {
      userId: userProfile.userId,
      country: userProfile.country,
      languageDialect: userProfile.languageDialect,
      operation:
        userProfile.createdAt === userProfile.updatedAt ? "created" : "updated",
    });

    const response = {
      success: true,
      profile: userProfile,
    };

    console.log("✅ POST /api/user/profile completed successfully");
    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 Error in POST /api/user/profile:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  } finally {
    console.log("🔌 Disconnecting from Prisma");
    await prisma.$disconnect();
  }
}
