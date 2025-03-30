"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, LogOut, FileText, CalendarIcon } from "lucide-react";
import DoctorList from "@/components/doctor-list";
import AppointmentList from "@/components/appointment-list";
import VeneerAIUploader from "@/components/veneer-ai-uploader";

interface PatientDashboardProps {
  user: any;
  reports: any[];
  appointments: any[];
  doctors: any[];
}

export default function PatientDashboard({
  user,
  reports,
  appointments,
  doctors,
}: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState("analysis");

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white border-b">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                SmileMatch AI
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
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="analysis">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Smile Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Schedule Session</span>
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">My Appointments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <h1 className="text-2xl font-bold text-center mb-6">
              Your Smile Analysis
            </h1>

            {reports.length > 0 ? (
              <div className="space-y-6">
                {/* Display the most recent report */}
                {/* This would be integrated with your existing VeneerResults component */}
                <Card className="p-6">
                  <p className="text-center text-gray-500 mb-4">
                    Your most recent analysis from{" "}
                    {new Date(reports[0].createdAt).toLocaleDateString()}
                  </p>
                  {/* Render your existing VeneerResults component here */}
                </Card>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <Card className="p-6 text-center mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Get Your Smile Analysis
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Upload a photo of your smile to receive personalized veneer
                    recommendations
                  </p>
                </Card>

                <VeneerAIUploader />
              </div>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <h1 className="text-2xl font-bold text-center mb-6">
              Schedule a Consultation
            </h1>
            <DoctorList doctors={doctors} />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <h1 className="text-2xl font-bold text-center mb-6">
              Your Appointments
            </h1>
            <AppointmentList appointments={appointments} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
