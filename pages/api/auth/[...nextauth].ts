// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { User, Session } from "next-auth";

const prisma = new PrismaClient();

// --- Extend NextAuth types locally for this file only ---
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      isAdmin: boolean;
    } & Omit<User, "id">;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    isAdmin: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Phone",
          type: "text",
          placeholder: "Email or Phone",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { identifier, password } = credentials;

        // ENV-based admin login
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminId = Number(process.env.ADMIN_ID ?? -1);

        if (identifier === adminEmail && password === adminPassword) {
          return {
            id: adminId.toString(), // NextAuth expects string
            name: "Admin",
            email: adminEmail,
            isAdmin: true,
          } as unknown as User;
        }

        // Normal user login via Prisma
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier.toLowerCase() },
              { phone: identifier },
            ],
          },
        });

        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          // include any extra fields you want (phone, isAdmin false)
          isAdmin: false,
        } as unknown as User;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // `user` here is the object returned by `authorize` or created by the adapter
    async jwt({ token, user }: { token: JWT; user?: any }) {
      // small runtime cast since NextAuth's User type doesn't include our custom isAdmin
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        token.id = parseInt((user as any).id, 10);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        token.isAdmin = (user as any).isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secretkey",
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
