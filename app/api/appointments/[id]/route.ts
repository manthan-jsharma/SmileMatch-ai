import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateMeetingUrl } from "@/lib/meeting-utils";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { doctorProfileId, startTime, endTime } = await request.json();

    if (!doctorProfileId || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the doctor profile to verify it exists
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { id: doctorProfileId },
      include: { user: true },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    // Check if the time slot is available
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorProfileId,
        OR: [
          {
            startTime: { lte: new Date(startTime) },
            endTime: { gt: new Date(startTime) },
          },
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gte: new Date(endTime) },
          },
        ],
        status: "scheduled",
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 }
      );
    }

    // Get the user's latest report if available
    const latestReport = await prisma.report.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    // Generate a meeting URL
    const meetLink = generateMeetingUrl();

    // Create the appointment with the generated meeting link
    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.user.id,
        doctorId: doctorProfile.userId,
        doctorProfileId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        reportId: latestReport?.id,
        status: "scheduled",
        meetLink, // Add the automatically generated meeting link
      },
    });

    // Send email notification to doctor (optional)
    // This could be implemented with a background job or webhook

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
