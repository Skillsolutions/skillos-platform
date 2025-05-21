"use client";

import React, { useState } from "react";
import PlatformLayout from "@/components/platform/PlatformLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Palette, Users, Link2, Save, Settings2, PlusCircle, Edit, Trash2, ShieldCheck, UploadCloud, FileText, Download, BarChart3 } from "lucide-react"; // Added BarChart3

import { useAuth } from "@/hooks/useAuth";

const initialIntegrations = [
  { id: "udemy", name: "Udemy Business", connected: true, logo: "/logos/udemy.png" },
  { id: "linkedin", name: "LinkedIn Learning", connected: false, logo: "/logos/linkedin.png" },
  { id: "teams", name: "Microsoft Teams", connected: true, logo: "/logos/teams.png" },
  { id: "slack", name: "Slack", connected: false, logo: "/logos/slack.png" },
  { id: "sana", name: "Sana Labs", connected: false, logo: "/logos/sana.png" },
];

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

const mockUsers: User[] = [
    { id: "user1", name: "Alex Johnson", email: "alex.johnson@example.com", role: "Admin" },
    { id: "user2", name: "Maria Garcia", email: "maria.garcia@example.com", role: "Department Head" },
    { id: "user3", name: "David Smith", email: "david.smith@example.com", role: "Team Leader" },
    { id: "user4", name: "Sarah Miller", email: "sarah.miller@example.com", role: "Learner" },
];

const SettingsPage = () => {
  const { userRole } = useAuth();
  const currentUserRole = userRole;

  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#6b7280");
  const [logoPreview, setLogoPreview] = useState<string | null>("/logos/skillos_logo_placeholder.png");
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [users] = useState<User[]>(mockUsers); 
  const [userCsvFile, setUserCsvFile] = useState<File | null>(null);
  const [userUploadStatus, setUserUploadStatus] = useState<string | null>(null);
  const [skillsCsvFile, setSkillsCsvFile] = useState<File | null>(null);
  const [skillsUploadStatus, setSkillsUploadStatus] = useState<string | null>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(int => int.id === id ? { ...int, connected: !int.connected } : int));
  };

  const handleUserCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUserCsvFile(event.target.files[0]);
      setUserUploadStatus(null);
    }
  };

  const processUserCsvUpload = () => {
    if (!userCsvFile) {
      setUserUploadStatus("Please select a CSV file to upload.");
      return;
    }
    setUserUploadStatus(`Processing ${userCsvFile.name}...`);
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3;
      if (isSuccess) {
        setUserUploadStatus(`Successfully uploaded and processed ${userCsvFile.name}. 15 users added, 2 updated, 0 errors.`);
      } else {
        setUserUploadStatus(`Error processing ${userCsvFile.name}. Please check the file format and try again. Error: Invalid CSV header.`);
      }
      setUserCsvFile(null);
    }, 2000);
  };

  const handleSkillsCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSkillsCsvFile(event.target.files[0]);
      setSkillsUploadStatus(null);
    }
  };

  const processSkillsCsvUpload = () => {
    if (!skillsCsvFile) {
      setSkillsUploadStatus("Please select a CSV/Excel file to upload.");
      return;
    }
    setSkillsUploadStatus(`Processing ${skillsCsvFile.name}...`);
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3;
      if (isSuccess) {
        setSkillsUploadStatus(`Successfully uploaded and processed ${skillsCsvFile.name}. 2000 employee skill records imported. Skill gaps identified and learning plans suggested for 150 teams.`);
      } else {
        setSkillsUploadStatus(`Error processing ${skillsCsvFile.name}. Please check the file format. Error: Skill 'Advanced Obfuscation' not found in taxonomy.`);
      }
      setSkillsCsvFile(null);
    }, 3000);
  };
  
  if (currentUserRole !== "admin") {
    return (
      <PlatformLayout title="Settings - Access Denied">
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <ShieldCheck className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You do not have permission to view the settings page.</p>
          <Button onClick={() => window.history.back()} className="mt-6">Go Back</Button>
        </div>
      </PlatformLayout>
    );
  }

  return (
    <PlatformLayout title="Platform Settings">
      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-6">
          <TabsTrigger value="branding"><Palette className="mr-2 h-4 w-4"/>Branding</TabsTrigger>
          <TabsTrigger value="userManagement"><Users className="mr-2 h-4 w-4"/>User Management</TabsTrigger>
          <TabsTrigger value="dataImport"><UploadCloud className="mr-2 h-4 w-4"/>Data Import</TabsTrigger> {/* New Tab */}
          <TabsTrigger value="integrations"><Link2 className="mr-2 h-4 w-4"/>Integrations</TabsTrigger>
          <TabsTrigger value="general"><Settings2 className="mr-2 h-4 w-4"/>General</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          {/* Branding content remains the same */}
          <Card>
            <CardHeader>
              <CardTitle>Branding & Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="logoUpload">Platform Logo</Label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="h-16 w-auto border rounded dark:bg-gray-700" />
                  ) : (
                    <div className="h-16 w-32 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-sm text-muted-foreground">Logo Preview</div>
                  )}
                  <Input id="logoUpload" type="file" accept="image/*" onChange={handleLogoChange} className="max-w-xs" />
                </div>
                <p className="text-xs text-muted-foreground">Recommended format: PNG, SVG. Max size: 2MB.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input id="primaryColor" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input id="secondaryColor" type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-full h-10" />
                </div>
              </div>
              <Button><Save className="mr-2 h-4 w-4"/> Save Branding</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="userManagement">
          {/* User Management content remains the same, bulk upload moved to Data Import */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and their roles within the platform. Only Admins can manage users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-end">
                    <Button><PlusCircle className="mr-2 h-4 w-4"/> Add New User</Button>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Data Import Tab */}
        <TabsContent value="dataImport">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Bulk User Upload</CardTitle>
                <CardDescription>Upload a CSV file to add or update multiple users at once.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The CSV should contain the following columns in order: <code>EmployeeID</code>, <code>FullName</code>, <code>Email</code>, <code>Role</code>, <code>Department</code>, <code>ManagerEmail</code> (optional).
                </p>
                <div className="mb-4">
                  <a href="/templates/sample_user_upload.csv" download className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                    <Download className="mr-2 h-4 w-4"/> Download Sample User CSV Template
                  </a>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <Label htmlFor="userCsvUpload" className="sr-only">Upload CSV</Label>
                  <Input id="userCsvUpload" type="file" accept=".csv" onChange={handleUserCsvUpload} className="max-w-md" />
                  <Button onClick={processUserCsvUpload} disabled={!userCsvFile}>
                    <UploadCloud className="mr-2 h-4 w-4"/> Upload & Process Users
                  </Button>
                </div>
                {userCsvFile && <p className="text-xs text-muted-foreground">Selected file: {userCsvFile.name}</p>}
                {userUploadStatus && (
                  <div className={`mt-4 p-3 rounded-md text-sm ${userUploadStatus.includes("Error") ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200" : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"}`}>
                    {userUploadStatus}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Skills Data Upload (TNA/LNA)</CardTitle>
                <CardDescription>Import structured skills data (e.g., Excel/CSV) from TNA/LNA exercises, consultant reports, or other assessment platforms.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This enables quick onboarding into SkillOS and real-time alignment of existing skill gap data with learning plans and course recommendations.
                  The file should contain columns like: <code>EmployeeID</code>, <code>SkillName</code>, <code>CurrentProficiency</code>, <code>RequiredProficiency</code>, <code>AssessmentDate</code>.
                </p>
                <div className="mb-4">
                  <a href="/templates/sample_skills_data_upload.xlsx" download className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                    <Download className="mr-2 h-4 w-4"/> Download Sample Skills Data Template (Excel)
                  </a>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <Label htmlFor="skillsCsvUpload" className="sr-only">Upload Skills Data</Label>
                  <Input id="skillsCsvUpload" type="file" accept=".csv,.xlsx" onChange={handleSkillsCsvUpload} className="max-w-md" />
                  <Button onClick={processSkillsCsvUpload} disabled={!skillsCsvFile}>
                    <BarChart3 className="mr-2 h-4 w-4"/> Upload & Process Skills Data
                  </Button>
                </div>
                {skillsCsvFile && <p className="text-xs text-muted-foreground">Selected file: {skillsCsvFile.name}</p>}
                {skillsUploadStatus && (
                  <div className={`mt-4 p-3 rounded-md text-sm ${skillsUploadStatus.includes("Error") ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200" : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"}`}>
                    {skillsUploadStatus}
                  </div>
                )}
                <div className="mt-6">
                    <h4 className="font-semibold mb-2">Security & Mapping Considerations:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Uploads are validated (e.g., duplicate IDs, missing values, invalid skills).</li>
                        <li>Uploaded skills can be mapped to your internal skill taxonomy or job families during processing (mocked).</li>
                        <li>Access to bulk upload features is restricted to admin-level users.</li>
                    </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          {/* Integrations content remains the same */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Integrations</CardTitle>
              <CardDescription>Connect SkillOS with your other learning and communication tools. Only Admins can manage integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                  <div className="flex items-center">
                    {integration.logo && <img src={integration.logo} alt={`${integration.name} logo`} className="h-8 w-8 mr-3 dark:bg-gray-200 dark:p-1 dark:rounded-sm" />}
                    <span className="font-medium">{integration.name}</span>
                  </div>
                  <Button variant={integration.connected ? "outline" : "default"} onClick={() => toggleIntegration(integration.id)}>
                    {integration.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          {/* General settings content remains the same */}
          <Card>
            <CardHeader>
                <CardTitle>General Platform Settings</CardTitle>
                <CardDescription>Manage general settings for the platform. Only Admins can modify these.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input id="platformName" defaultValue="SkillOS Learning Platform" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue={30} />
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="maintenanceMode" />
                    <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input id="supportEmail" type="email" defaultValue="support@skillos.com" />
                </div>
                <Button><Save className="mr-2 h-4 w-4"/> Save General Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </PlatformLayout>
  );
};

export default SettingsPage;

