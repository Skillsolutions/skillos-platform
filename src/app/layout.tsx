import '@/app/globals.css';
import React from 'react';
import { OrganizationProvider } from '@/lib/organization/auth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>SkillOS - Learning Analytics Platform</title>
        <meta name="description" content="Multi-tenant learning analytics platform with Udemy Business integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-background">
        <OrganizationProvider>
          {children}
        </OrganizationProvider>
      </body>
    </html>
  );
}

