import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PatientDashboard from "@/components/patient-dashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Check user role and redirect if doctor
  if (session.user.role === "doctor") {
    redirect("/doctor/dashboard");
  }

  // Get user's reports
  const reports = await prisma.report.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get user's appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: session.user.id,
    },
    include: {
      doctor: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      report: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  // Get available doctors
  const doctors = await prisma.doctorProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return (
    <PatientDashboard
      user={session.user}
      reports={reports}
      appointments={appointments}
      doctors={doctors}
    />
  );
}
