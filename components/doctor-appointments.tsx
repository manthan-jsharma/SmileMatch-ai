"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  LinkIcon,
  Loader2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PDFReport from "@/components/pdf-report";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DoctorAppointmentsProps {
  initialAppointments: any[];
}

export default function DoctorAppointments({
  initialAppointments,
}: DoctorAppointmentsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [meetLink, setMeetLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState(initialAppointments);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);

  // Fetch appointments with filters
  const fetchAppointments = async () => {
    setIsLoading(true);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");

      if (activeTab !== "all") {
        params.append("status", activeTab);
      } else if (statusFilter) {
        params.append("status", statusFilter);
      }

      if (dateFilter) {
        params.append("date", dateFilter);
      }

      if (searchTerm) {
        params.append("patientName", searchTerm);
      }

      const response = await fetch(
        `/api/doctor/appointments?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data.appointments);
      setTotalPages(data.pagination.totalPages);
      setTotalAppointments(data.pagination.total);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch appointments when filters change
  useEffect(() => {
    fetchAppointments();
  }, [page, activeTab, statusFilter, dateFilter, searchTerm]);

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setIsReportDialogOpen(true);
  };

  const handleAddMeetLink = (appointment: any) => {
    setSelectedAppointment(appointment);
    setMeetLink(appointment.meetLink || "");
    setIsAddLinkDialogOpen(true);
  };

  const handleSubmitMeetLink = async () => {
    if (!selectedAppointment) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/appointments/${selectedAppointment.id}/meet-link`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ meetLink }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update meeting link");
      }

      // Update the appointment in the local state
      setAppointments(
        appointments.map((apt) =>
          apt.id === selectedAppointment.id ? { ...apt, meetLink } : apt
        )
      );

      setIsAddLinkDialogOpen(false);
    } catch (err: any) {
      setError(
        err.message || "An error occurred while updating the meeting link"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAppointmentTime = (startTime: string, endTime: string) => {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchAppointments();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateFilter(null);
    setStatusFilter(null);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setPage(1); // Reset to first page when changing tabs
        }}
      >
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-4">
          {/* Search and Filter Bar */}
          <Card className="p-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by patient name or email"
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="date-filter">Date</Label>
                        <Input
                          id="date-filter"
                          type="date"
                          value={dateFilter || ""}
                          onChange={(e) =>
                            setDateFilter(e.target.value || null)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status-filter">Status</Label>
                        <Select
                          value={statusFilter || ""}
                          onValueChange={(value) =>
                            setStatusFilter(value || null)
                          }
                        >
                          <SelectTrigger id="status-filter">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleClearFilters}
                        >
                          Clear Filters
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => fetchAppointments()}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button type="submit" size="sm" className="h-10">
                  Search
                </Button>
              </div>
            </form>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : appointments.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No appointments found.</p>
              </Card>
            ) : (
              <>
                <div className="text-sm text-gray-500 mb-2">
                  Showing {appointments.length} of {totalAppointments}{" "}
                  appointments
                </div>

                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={appointment.patient.image || ""}
                            alt={appointment.patient.name || "Patient"}
                          />
                          <AvatarFallback>
                            {appointment.patient.name?.charAt(0) || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {appointment.patient.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {appointment.patient.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {format(
                              parseISO(appointment.startTime),
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
                            appointment.status === "scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : appointment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        {appointment.status === "scheduled" &&
                          (appointment.meetLink ? (
                            <>
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
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleAddMeetLink(appointment)}
                              >
                                <LinkIcon className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => handleAddMeetLink(appointment)}
                            >
                              <LinkIcon className="h-4 w-4 mr-2" />
                              Add Meeting Link
                            </Button>
                          ))}

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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Tabs>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Veneer Analysis Report</DialogTitle>
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

      <Dialog open={isAddLinkDialogOpen} onOpenChange={setIsAddLinkDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Meeting Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="meetLink">Video Meeting URL</Label>
              <Input
                id="meetLink"
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                placeholder="https://meet.google.com/..."
              />
              <p className="text-xs text-gray-500">
                Enter a Google Meet, Zoom, or other video conferencing link
              </p>
            </div>

            {error && (
              <Card className="bg-red-50 p-3 text-red-600 text-sm border-red-200">
                {error}
              </Card>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsAddLinkDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitMeetLink}
                disabled={isSubmitting || !meetLink}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Meeting Link"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
