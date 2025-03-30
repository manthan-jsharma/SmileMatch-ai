"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smile } from "lucide-react";
import Image from "next/image";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Smile className="h-8 w-8 text-cyan-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              SmileMatch AI
            </span>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-center">
            Sign in to access your veneer recommendations and appointments
          </p>
        </div>

        <Tabs defaultValue="patient" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">I'm a Patient</TabsTrigger>
            <TabsTrigger value="doctor">I'm a Doctor</TabsTrigger>
          </TabsList>
          <TabsContent value="patient" className="mt-4 text-center">
            <p className="mb-4 text-sm text-gray-600">
              Sign in to view your smile analysis and connect with veneer
              specialists
            </p>
          </TabsContent>
          <TabsContent value="doctor" className="mt-4 text-center">
            <p className="mb-4 text-sm text-gray-600">
              Sign in to manage your profile and patient appointments
            </p>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full h-12 mb-4 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300"
        >
          <div className="flex items-center justify-center">
            <Image
              src="/google-logo.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </div>
        </Button>

        <p className="text-xs text-center text-gray-500 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </Card>
    </div>
  );
}
