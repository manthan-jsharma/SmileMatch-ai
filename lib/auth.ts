import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Get user role from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });

        session.user.role = dbUser?.role || "patient";
      }
      return session;
    },
    async signIn({ user }) {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email as string },
      });

      // If user doesn't exist, create a new user with default role "patient"
      if (!existingUser && user.email) {
        await prisma.user.create({
          data: {
            id: user.id as string,
            email: user.email,
            name: user.name,
            image: user.image,
            role: "patient", // Default role
          },
        });
      }

      return true;
    },
  },
  pages: {
    signIn: "/authpage/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
};
