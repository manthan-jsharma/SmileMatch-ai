import { NextResponse } from "next/server";
import { mockAnalyzeSmile } from "@/lib/smile-analysis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Always use mock data instead of real AI analysis
    const results = await mockAnalyzeSmile(image);

    // If user is authenticated, save the report to the database
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      await prisma.report.create({
        data: {
          userId: session.user.id,
          faceShape: results.faceShape,
          teethColor: results.teethAnalysis.color,
          teethAlignment: results.teethAnalysis.alignment,
          teethSize: results.teethAnalysis.size,
          recommendedStyles: results.recommendedStyles,
          imageUrl: image.substring(0, 100), // Store a truncated version or reference
        },
      });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error in smile analysis API:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
