import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DoctorDashboard from "@/components/doctor-dashboard";

export default async function DoctorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Check user role and redirect if not doctor
  if (session.user.role !== "doctor") {
    redirect("/dashboard");
  }

  // Get doctor profile
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  // Get doctor's appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorProfileId: doctorProfile?.id,
    },
    include: {
      patient: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      report: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return (
    <DoctorDashboard
      user={session.user}
      doctorProfile={doctorProfile}
      appointments={appointments}
    />
  );
}
