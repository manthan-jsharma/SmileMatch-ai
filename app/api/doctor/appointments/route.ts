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

    // Verify user is a doctor
    if (session.user.role !== "doctor") {
      return NextResponse.json(
        { error: "Only doctors can access this endpoint" },
        { status: 403 }
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

    // Parse query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get("status"); // scheduled, completed, cancelled
    const date = url.searchParams.get("date"); // YYYY-MM-DD
    const patientName = url.searchParams.get("patientName");
    const page = Number.parseInt(url.searchParams.get("page") || "1");
    const limit = Number.parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    const where: any = {
      doctorProfileId: doctorProfile.id,
    };

    // Add filters if provided
    if (status) {
      where.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      where.startTime = {
        gte: startDate,
        lt: endDate,
      };
    }

    // For patient name search, we need to include the patient relation
    const include: any = {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      report: true,
    };

    // Get total count for pagination
    const totalAppointments = await prisma.appointment.count({
      where,
    });

    // Get appointments with filtering and pagination
    let appointments = await prisma.appointment.findMany({
      where,
      include,
      orderBy: {
        startTime: "asc",
      },
      skip,
      take: limit,
    });

    // If patient name filter is provided, filter in memory
    // (This is not ideal for large datasets, but works for our demo)
    if (patientName && patientName.trim() !== "") {
      const searchTerm = patientName.toLowerCase();
      appointments = appointments.filter(
        (appointment) =>
          appointment.patient.name?.toLowerCase().includes(searchTerm) ||
          appointment.patient.email?.toLowerCase().includes(searchTerm)
      );
    }

    return NextResponse.json({
      appointments,
      pagination: {
        total: totalAppointments,
        page,
        limit,
        totalPages: Math.ceil(totalAppointments / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
