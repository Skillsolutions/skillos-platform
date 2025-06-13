"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Target,
  DollarSign
} from "lucide-react";

export default function ReportsPage() {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  // Mock reports data
  const reportsData = {
    overview: {
      totalReports: 24,
      scheduledReports: 8,
      customReports: 12,
      sharedReports: 16
    },
    recentReports: [
      {
        id: 1,
        name: "Monthly Learning Analytics",
        type: "Analytics",
        lastGenerated: "2024-06-10",
        frequency: "Monthly",
        recipients: 5,
        status: "Active",
        size: "2.3 MB"
      },
      {
        id: 2,
        name: "Quarterly Skills Assessment",
        type: "Assessment",
        lastGenerated: "2024-06-08",
        frequency: "Quarterly",
        recipients: 12,
        status: "Active",
        size: "5.1 MB"
      },
      {
        id: 3,
        name: "Department Performance Summary",
        type: "Performance",
        lastGenerated: "2024-06-12",
        frequency: "Weekly",
        recipients: 8,
        status: "Active",
        size: "1.8 MB"
      },
      {
        id: 4,
        name: "Course Completion Report",
        type: "Completion",
        lastGenerated: "2024-06-11",
        frequency: "Daily",
        recipients: 3,
        status: "Active",
        size: "892 KB"
      }
    ],
    reportTemplates: [
      {
        name: "Learning Progress Report",
        description: "Track individual and team learning progress",
        category: "Progress",
        fields: ["Completion Rate", "Time Spent", "Skills Gained", "Certifications"],
        usage: 45
      },
      {
        name: "ROI Analysis Report",
        description: "Measure return on investment for learning programs",
        category: "Financial",
        fields: ["Training Costs", "Productivity Gains", "Revenue Impact", "Cost Savings"],
        usage: 32
      },
      {
        name: "Skill Gap Analysis",
        description: "Identify skill gaps across departments",
        category: "Skills",
        fields: ["Required Skills", "Current Skills", "Gap Analysis", "Recommendations"],
        usage: 28
      },
      {
        name: "Engagement Metrics",
        description: "Analyze learner engagement and participation",
        category: "Engagement",
        fields: ["Login Frequency", "Course Starts", "Discussion Posts", "Feedback Scores"],
        usage: 38
      }
    ],
    scheduledReports: [
      { name: "Weekly Team Summary", schedule: "Every Monday 9:00 AM", recipients: ["managers@company.com"] },
      { name: "Monthly Executive Dashboard", schedule: "1st of every month", recipients: ["executives@company.com"] },
      { name: "Quarterly Skills Review", schedule: "End of quarter", recipients: ["hr@company.com", "l&d@company.com"] }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Paused": return "bg-yellow-500";
      case "Error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and manage learning analytics reports</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              Available reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.scheduledReports}</div>
            <p className="text-xs text-muted-foreground">
              Auto-generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.customReports}</div>
            <p className="text-xs text-muted-foreground">
              User-created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared Reports</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.sharedReports}</div>
            <p className="text-xs text-muted-foreground">
              Team accessible
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Report Dashboard</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Reports</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search reports..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.recentReports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{report.name}</CardTitle>
                          <CardDescription>
                            {report.type} • Last generated: {report.lastGenerated}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></div>
                          <Badge variant="outline">{report.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Frequency</p>
                          <p className="font-medium">{report.frequency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Recipients</p>
                          <p className="font-medium">{report.recipients}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">File Size</p>
                          <p className="font-medium">{report.size}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Format</p>
                          <Badge variant="secondary">PDF</Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Share</Button>
                        <Button size="sm">Generate Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Pre-built templates for common reporting needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportsData.reportTemplates.map((template, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Included Fields</p>
                        <div className="flex flex-wrap gap-2">
                          {template.fields.map((field) => (
                            <Badge key={field} variant="secondary" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Used by {template.usage} teams</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Preview</Button>
                          <Button size="sm">Use Template</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automatically generated reports sent to stakeholders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.scheduledReports.map((scheduled, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{scheduled.name}</h4>
                        <p className="text-sm text-gray-600">{scheduled.schedule}</p>
                        <p className="text-xs text-gray-500">
                          Recipients: {scheduled.recipients.join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Active</Badge>
                      <Button variant="outline" size="sm">Edit Schedule</Button>
                      <Button variant="outline" size="sm">Run Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Create custom reports with drag-and-drop interface</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Report Builder</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop components to create custom reports
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 cursor-pointer hover:bg-gray-50">
                      <div className="text-center">
                        <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">Charts</p>
                      </div>
                    </Card>
                    <Card className="p-4 cursor-pointer hover:bg-gray-50">
                      <div className="text-center">
                        <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">Tables</p>
                      </div>
                    </Card>
                    <Card className="p-4 cursor-pointer hover:bg-gray-50">
                      <div className="text-center">
                        <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">KPIs</p>
                      </div>
                    </Card>
                    <Card className="p-4 cursor-pointer hover:bg-gray-50">
                      <div className="text-center">
                        <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">Trends</p>
                      </div>
                    </Card>
                  </div>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Building Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

