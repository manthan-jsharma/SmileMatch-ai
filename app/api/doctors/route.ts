import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("search");
    const specialization = url.searchParams.get("specialization");
    const minExperience = url.searchParams.get("minExperience")
      ? Number.parseInt(url.searchParams.get("minExperience") as string)
      : undefined;
    const maxFee = url.searchParams.get("maxFee")
      ? Number.parseFloat(url.searchParams.get("maxFee") as string)
      : undefined;
    const page = Number.parseInt(url.searchParams.get("page") || "1");
    const limit = Number.parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    const where: any = {};

    // Add filters if provided
    if (specialization) {
      where.specialization = {
        contains: specialization,
        mode: "insensitive",
      };
    }

    if (minExperience !== undefined) {
      where.yearsExperience = {
        gte: minExperience,
      };
    }

    if (maxFee !== undefined) {
      where.consultationFee = {
        lte: maxFee,
      };
    }

    // For search term, we need to search across multiple fields
    if (searchTerm) {
      where.OR = [
        {
          specialization: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          bio: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          user: {
            OR: [
              {
                name: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ];
    }

    // Get total count for pagination
    const totalDoctors = await prisma.doctorProfile.count({
      where,
    });

    // Get doctor profiles with filtering and pagination
    const doctors = await prisma.doctorProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        yearsExperience: "desc",
      },
      skip,
      take: limit,
    });

    // Get all unique specializations for filtering options
    const specializations = await prisma.doctorProfile.findMany({
      select: {
        specialization: true,
      },
      distinct: ["specialization"],
    });

    return NextResponse.json({
      doctors,
      specializations: specializations.map((s) => s.specialization),
      pagination: {
        total: totalDoctors,
        page,
        limit,
        totalPages: Math.ceil(totalDoctors / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching doctor profiles:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor profiles" },
      { status: 500 }
    );
  }
}
