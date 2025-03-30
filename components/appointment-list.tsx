"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, FileText } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PDFReport from "@/components/pdf-report";

interface AppointmentListProps {
  appointments: any[];
}

export default function AppointmentList({
  appointments,
}: AppointmentListProps) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (appointment) =>
      new Date(appointment.startTime) > now &&
      appointment.status !== "cancelled"
  );

  const pastAppointments = appointments.filter(
    (appointment) =>
      new Date(appointment.startTime) <= now ||
      appointment.status === "cancelled"
  );

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setIsReportDialogOpen(true);
  };

  const formatAppointmentTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingAppointments.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500">
                You don't have any upcoming appointments.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={appointment.doctor.user.image || ""}
                          alt={appointment.doctor.user.name || "Doctor"}
                        />
                        <AvatarFallback>
                          {appointment.doctor.user.name?.charAt(0) || "D"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {appointment.doctor.user.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {appointment.doctor.specialization}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {format(
                            new Date(appointment.startTime),
                            "MMMM d, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {formatAppointmentTime(
                            appointment.startTime,
                            appointment.endTime
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {appointment.meetLink ? (
                        <Button
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() =>
                            window.open(appointment.meetLink, "_blank")
                          }
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                        </Button>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Awaiting Link
                        </Badge>
                      )}

                      {appointment.report && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewReport(appointment.report)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastAppointments.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500">
                You don't have any past appointments.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={appointment.doctor.user.image || ""}
                          alt={appointment.doctor.user.name || "Doctor"}
                        />
                        <AvatarFallback>
                          {appointment.doctor.user.name?.charAt(0) || "D"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {appointment.doctor.user.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {appointment.doctor.specialization}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {format(
                            new Date(appointment.startTime),
                            "MMMM d, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {formatAppointmentTime(
                            appointment.startTime,
                            appointment.endTime
                          )}
                        </span>
                      </div>
                      <Badge
                        className={
                          appointment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {appointment.status === "completed"
                          ? "Completed"
                          : "Cancelled"}
                      </Badge>
                    </div>

                    {appointment.report && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(appointment.report)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Veneer Analysis Report</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <PDFReport
              results={{
                faceShape: selectedReport.faceShape,
                teethAnalysis: {
                  color: selectedReport.teethColor,
                  alignment: selectedReport.teethAlignment,
                  size: selectedReport.teethSize,
                },
                recommendedStyles: selectedReport.recommendedStyles,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
