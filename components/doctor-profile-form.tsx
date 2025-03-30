"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface DoctorProfileFormProps {
  existingProfile?: any;
  onSuccess: () => void;
}

export default function DoctorProfileForm({
  existingProfile,
  onSuccess,
}: DoctorProfileFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    specialization: existingProfile?.specialization || "",
    yearsExperience: existingProfile?.yearsExperience || "",
    bio: existingProfile?.bio || "",
    consultationFee: existingProfile?.consultationFee || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/doctor/profile", {
        method: existingProfile ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          yearsExperience: Number.parseInt(formData.yearsExperience),
          consultationFee: Number.parseFloat(formData.consultationFee),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save profile");
      }

      // Refresh the page data
      router.refresh();
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="specialization">
            Specialization <span className="text-red-500">*</span>
          </Label>
          <Input
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="e.g., Cosmetic Dentistry, Veneer Specialist"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearsExperience">
            Years of Experience <span className="text-red-500">*</span>
          </Label>
          <Input
            id="yearsExperience"
            name="yearsExperience"
            type="number"
            min="1"
            value={formData.yearsExperience}
            onChange={handleChange}
            placeholder="e.g., 5"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="consultationFee">
            Consultation Fee ($) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="consultationFee"
            name="consultationFee"
            type="number"
            min="0"
            step="0.01"
            value={formData.consultationFee}
            onChange={handleChange}
            placeholder="e.g., 150.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">
            Professional Bio <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell patients about your education, experience, and approach to veneer treatments..."
            rows={5}
            required
          />
        </div>

        {error && (
          <Card className="bg-red-50 p-3 text-red-600 text-sm border-red-200">
            {error}
          </Card>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : existingProfile ? (
              "Update Profile"
            ) : (
              "Create Profile"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
