// Authentication library for SkillOS platform
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Mock user database - in production, this would be a real database
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@skillsolutions.io",
    password: "admin123",
    role: "admin",
    department: "Management",
    jobTitle: "Platform Administrator",
    image: "/images/avatars/admin-avatar.jpg"
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@skillsolutions.io",
    password: "manager123",
    role: "departmentHead",
    department: "Engineering",
    jobTitle: "Engineering Director",
    image: "/images/avatars/manager-avatar.jpg"
  },
  {
    id: "3",
    name: "Team Leader",
    email: "team@skillsolutions.io",
    password: "team123",
    role: "teamLeader",
    department: "Engineering",
    jobTitle: "Frontend Team Lead",
    image: "/images/avatars/team-avatar.jpg"
  },
  {
    id: "4",
    name: "Employee User",
    email: "employee@skillsolutions.io",
    password: "employee123",
    role: "employee",
    department: "Engineering",
    jobTitle: "Software Developer",
    image: "/images/avatars/employee-avatar.jpg"
  }
];

// Define the shape of the session object
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  jobTitle: string;
  image?: string;
}

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user in the mock database
        const user = users.find(user => user.email === credentials.email);

        // Check if user exists and password matches
        if (user && user.password === credentials.password) {
          // Return user without password
          const { password: _, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        // Safely assign optional properties
        if ('role' in user) token.role = user.role;
        if ('department' in user) token.department = user.department;
        if ('jobTitle' in user) token.jobTitle = user.jobTitle;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        if ('role' in token) session.user.role = token.role as string;
        if ('department' in token) session.user.department = token.department as string;
        if ('jobTitle' in token) session.user.jobTitle = token.jobTitle as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-for-development",
  debug: process.env.NODE_ENV === "development",
};

// Helper function to check if user has required role
export function hasRequiredRole(userRole: string, requiredRole: string | string[]): boolean {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}

// Helper function to get user role display name
export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    admin: "Administrator",
    departmentHead: "Department Head",
    teamLeader: "Team Leader",
    employee: "Employee"
  };
  
  return roleMap[role] || role;
}

// Helper function to get all users (for admin dashboard)
export function getAllUsers(): SessionUser[] {
  return users.map(({ password: _unused, ...user }) => user as SessionUser);
}

// Helper function to get user by ID
export function getUserById(id: string): SessionUser | null {
  const user = users.find(user => user.id === id);
  if (!user) return null;
  
  const { password: _unused, ...userWithoutPassword } = user;
  return userWithoutPassword as SessionUser;
}
