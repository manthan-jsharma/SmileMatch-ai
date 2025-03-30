import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is a doctor
    if (session.user.role !== "doctor") {
      return NextResponse.json(
        { error: "Only doctors can update meeting links" },
        { status: 403 }
      );
    }

    const { meetLink } = await request.json();

    if (!meetLink) {
      return NextResponse.json(
        { error: "Meeting link is required" },
        { status: 400 }
      );
    }

    // Get the doctor profile
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    // Get the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Verify the appointment belongs to this doctor
    if (appointment.doctorProfileId !== doctorProfile.id) {
      return NextResponse.json(
        { error: "You can only update your own appointments" },
        { status: 403 }
      );
    }

    // Update the appointment with the meeting link
    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { meetLink },
    });

    return NextResponse.json({ appointment: updatedAppointment });
  } catch (error) {
    console.error("Error updating meeting link:", error);
    return NextResponse.json(
      { error: "Failed to update meeting link" },
      { status: 500 }
    );
  }
}
