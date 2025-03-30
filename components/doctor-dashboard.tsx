"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Calendar, Settings } from "lucide-react";
import DoctorAppointments from "@/components/doctor-appointments";
import DoctorProfileForm from "@/components/doctor-profile-form";

interface DoctorDashboardProps {
  user: any;
  doctorProfile: any;
  appointments: any[];
}

export default function DoctorDashboard({
  user,
  doctorProfile,
  appointments,
}: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState(
    doctorProfile ? "appointments" : "profile"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white border-b">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                SmileMatch AI
              </span>
              <span className="text-sm bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">
                Doctor
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>

              <div className="hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="appointments" disabled={!doctorProfile}>
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <h1 className="text-2xl font-bold text-center mb-6">
              Your Appointments
            </h1>

            {doctorProfile ? (
              <DoctorAppointments appointments={appointments} />
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-500">
                  Please complete your doctor profile before managing
                  appointments.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <h1 className="text-2xl font-bold text-center mb-6">
              {doctorProfile ? "Edit Your Profile" : "Complete Your Profile"}
            </h1>

            <DoctorProfileForm
              existingProfile={doctorProfile}
              onSuccess={() => setActiveTab("appointments")}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
