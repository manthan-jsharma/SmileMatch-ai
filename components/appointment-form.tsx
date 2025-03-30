"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, Loader2, Check, Video, Copy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AppointmentFormProps {
  doctor: any;
  onSuccess: () => void;
}

export default function AppointmentForm({
  doctor,
  onSuccess,
}: AppointmentFormProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ meetLink: string } | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  // Mock time slots - in a real app, these would come from the doctor's availability
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const handleSubmit = async () => {
    if (!date || !timeSlot) {
      setError("Please select both date and time");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Parse the time slot and create a datetime
      const [hours, minutes] = timeSlot.split(":");
      const isPM = timeSlot.includes("PM");
      let hour = Number.parseInt(hours);
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;

      const startTime = new Date(date);
      startTime.setHours(hour);
      startTime.setMinutes(Number.parseInt(minutes));

      // End time is 1 hour later
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorProfileId: doctor.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to schedule appointment");
      }

      const data = await response.json();

      // Show success message with meeting link
      setSuccessData({
        meetLink: data.appointment.meetLink,
      });

      // Refresh the appointments list
      router.refresh();
    } catch (err: any) {
      setError(
        err.message || "An error occurred while scheduling the appointment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyMeetingLink = () => {
    if (successData?.meetLink) {
      navigator.clipboard.writeText(successData.meetLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (successData) {
    return (
      <div className="space-y-6">
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">
            Appointment Scheduled!
          </AlertTitle>
          <AlertDescription className="text-green-700">
            Your appointment with Dr. {doctor.user.name} has been successfully
            scheduled.
          </AlertDescription>
        </Alert>

        <Card className="p-4 border-cyan-200 bg-cyan-50">
          <h3 className="font-medium mb-2 text-cyan-800">Your Meeting Link</h3>
          <div className="flex items-center gap-2 mb-4">
            <Video className="h-4 w-4 text-cyan-600" />
            <a
              href={successData.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 hover:underline text-sm break-all"
            >
              {successData.meetLink}
            </a>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={copyMeetingLink}
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          <p className="text-xs text-cyan-700">
            This link will be available in your appointments section. You can
            join the meeting at the scheduled time.
          </p>
        </Card>

        <div className="flex justify-end">
          <Button onClick={onSuccess}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={doctor.user.image || ""}
            alt={doctor.user.name || "Doctor"}
          />
          <AvatarFallback>{doctor.user.name?.charAt(0) || "D"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{doctor.user.name}</h3>
          <p className="text-sm text-gray-500">{doctor.specialization}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Select Date</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => {
                  // Disable past dates
                  return date < new Date(new Date().setHours(0, 0, 0, 0));
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Select Time</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                variant={timeSlot === slot ? "default" : "outline"}
                className={`${
                  timeSlot === slot ? "bg-cyan-600 hover:bg-cyan-700" : ""
                }`}
                onClick={() => setTimeSlot(slot)}
              >
                <Clock className="mr-2 h-4 w-4" />
                {slot}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <Card className="bg-red-50 p-3 text-red-600 text-sm border-red-200">
          {error}
        </Card>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !date || !timeSlot}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            "Schedule Appointment"
          )}
        </Button>
      </div>
    </div>
  );
}
