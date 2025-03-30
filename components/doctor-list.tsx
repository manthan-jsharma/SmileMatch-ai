"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AppointmentForm from "@/components/appointment-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Slider } from "@/components/ui/slider";

interface DoctorListProps {
  initialDoctors: any[];
}

export default function DoctorList({ initialDoctors }: DoctorListProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState<string | null>(null);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [specializations, setSpecializations] = useState<string[]>([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);

  // Fetch doctors with filters
  const fetchDoctors = async () => {
    setIsLoading(true);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "6"); // Show 6 doctors per page

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (specialization) {
        params.append("specialization", specialization);
      }

      if (minExperience > 0) {
        params.append("minExperience", minExperience.toString());
      }

      if (maxFee !== null) {
        params.append("maxFee", maxFee.toString());
      }

      const response = await fetch(`/api/doctors?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      setDoctors(data.doctors);
      setSpecializations(data.specializations);
      setTotalPages(data.pagination.totalPages);
      setTotalDoctors(data.pagination.total);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch doctors when filters change
  useEffect(() => {
    fetchDoctors();
  }, [page]);

  const handleSchedule = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsDialogOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchDoctors();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSpecialization(null);
    setMinExperience(0);
    setMaxFee(null);
    setPage(1);
  };

  return (
    <div className="space-y-6">
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
                placeholder="Search by name, specialization, or keywords"
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
                    <Label htmlFor="specialization-filter">
                      Specialization
                    </Label>
                    <Select
                      value={specialization || ""}
                      onValueChange={(value) =>
                        setSpecialization(value || null)
                      }
                    >
                      <SelectTrigger id="specialization-filter">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specializations</SelectItem>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Years of Experience: {minExperience}</Label>
                    <Slider
                      value={[minExperience]}
                      min={0}
                      max={30}
                      step={1}
                      onValueChange={(value) => setMinExperience(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-fee">
                      Maximum Consultation Fee ($)
                    </Label>
                    <Input
                      id="max-fee"
                      type="number"
                      min="0"
                      step="10"
                      value={maxFee || ""}
                      onChange={(e) =>
                        setMaxFee(
                          e.target.value
                            ? Number.parseFloat(e.target.value)
                            : null
                        )
                      }
                      placeholder="No limit"
                    />
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
                      onClick={() => fetchDoctors()}
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
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : doctors.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">
            No doctors available matching your criteria. Please try different
            filters.
          </p>
        </Card>
      ) : (
        <>
          <div className="text-sm text-gray-500 mb-2">
            Showing {doctors.length} of {totalDoctors} doctors
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={doctor.user.image || ""}
                          alt={doctor.user.name || "Doctor"}
                        />
                        <AvatarFallback>
                          {doctor.user.name?.charAt(0) || "D"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{doctor.user.name}</h3>
                        <p className="text-sm text-gray-500">
                          {doctor.user.email}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-200">
                      {doctor.yearsExperience} Years
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Specialization</h4>
                    <p className="text-gray-700">{doctor.specialization}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-1">About</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {doctor.bio}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>${doctor.consultationFee} / session</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Available</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSchedule(doctor)}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    Schedule Appointment
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
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
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
          </DialogHeader>
          {selectedDoctor && (
            <AppointmentForm
              doctor={selectedDoctor}
              onSuccess={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
