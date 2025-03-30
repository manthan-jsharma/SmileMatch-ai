import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has a doctor profile
    const existingProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Doctor profile already exists" },
        { status: 409 }
      );
    }

    const { specialization, yearsExperience, bio, consultationFee } =
      await request.json();

    if (!specialization || !yearsExperience || !bio || !consultationFee) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the doctor profile
    const doctorProfile = await prisma.doctorProfile.create({
      data: {
        userId: session.user.id,
        specialization,
        yearsExperience,
        bio,
        consultationFee,
      },
    });

    // Update user role to doctor
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "doctor" },
    });

    return NextResponse.json({ doctorProfile });
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    return NextResponse.json(
      { error: "Failed to create doctor profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has a doctor profile
    const existingProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    const { specialization, yearsExperience, bio, consultationFee } =
      await request.json();

    if (!specialization || !yearsExperience || !bio || !consultationFee) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the doctor profile
    const doctorProfile = await prisma.doctorProfile.update({
      where: { userId: session.user.id },
      data: {
        specialization,
        yearsExperience,
        bio,
        consultationFee,
      },
    });

    return NextResponse.json({ doctorProfile });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    return NextResponse.json(
      { error: "Failed to update doctor profile" },
      { status: 500 }
    );
  }
}
