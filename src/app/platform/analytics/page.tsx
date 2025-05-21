"use client";

import React, { useState } from 'react';
import PlatformLayout from "@/components/platform/PlatformLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, LineChart, PieChart, Activity, Users, TrendingUp, DollarSign, 
  Download, Filter, ChevronDown, FileText, BarChart2, PieChart as PieChartIcon,
  ArrowUpDown, CheckCircle, Clock, BookOpen, Award, X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AnalyticsDashboardPage = () => {
  // State for filters
  const [dateRange, setDateRange] = useState("last30days");
  const [organization, setOrganization] = useState("all");
  const [department, setDepartment] = useState("all");
  const [team, setTeam] = useState("all");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportSections, setExportSections] = useState<string[]>(["overview", "activity", "skills", "engagement"]);
  
  // Mock data for filters
  const organizations = [
    { id: "all", name: "All Organizations" },
    { id: "org1", name: "Global Corp" },
    { id: "org2", name: "Tech Innovators" },
    { id: "org3", name: "Healthcare Solutions" }
  ];
  
  const departments = [
    { id: "all", name: "All Departments" },
    { id: "sales", name: "Sales" },
    { id: "engineering", name: "Engineering" },
    { id: "marketing", name: "Marketing" },
    { id: "hr", name: "Human Resources" },
    { id: "finance", name: "Finance" },
    { id: "operations", name: "Operations" }
  ];
  
  const teams = [
    { id: "all", name: "All Teams" },
    { id: "team1", name: "Frontend Development" },
    { id: "team2", name: "Backend Development" },
    { id: "team3", name: "DevOps" },
    { id: "team4", name: "UX/UI Design" },
    { id: "team5", name: "Product Management" },
    { id: "team6", name: "Customer Success" },
    { id: "team7", name: "Enterprise Sales" },
    { id: "team8", name: "SMB Sales" }
  ];
  
  // Handle export button click
  const handleExport = () => {
    setShowExportDialog(true);
  };
  
  // Handle export confirmation
  const handleConfirmExport = () => {
    // In a real implementation, this would generate and download the report
    alert(`Exporting analytics in ${exportFormat.toUpperCase()} format with selected sections: ${exportSections.join(", ")}`);
    setShowExportDialog(false);
  };
  
  // Toggle export section selection
  const toggleExportSection = (section: string) => {
    setExportSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };
  
  // Check if a section is selected for export
  const isSectionSelected = (section: string) => {
    return exportSections.includes(section);
  };

  return (
    <PlatformLayout title="Analytics Dashboard" requiredRole={["admin", "department_head"]}>
      <div className="space-y-8">
        {/* Header with filters */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Platform Analytics Overview</h2>
            <p className="text-muted-foreground">Insights and metrics about your learning platform</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Date Range Filter */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                <SelectItem value="lastYear">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Advanced Filters Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filters
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Analytics</h4>
                  
                  {/* Organization Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Select value={organization} onValueChange={setOrganization}>
                      <SelectTrigger id="organization" className="w-full">
                        <SelectValue placeholder="Select Organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map(org => (
                          <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Department Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger id="department" className="w-full">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Team Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="team">Team</Label>
                    <Select value={team} onValueChange={setTeam}>
                      <SelectTrigger id="team" className="w-full">
                        <SelectValue placeholder="Select Team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      setOrganization("all");
                      setDepartment("all");
                      setTeam("all");
                    }}>
                      Reset
                    </Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Export Button */}
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2">
          {dateRange !== "last30days" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {dateRange === "last7days" ? "Last 7 Days" : 
               dateRange === "lastQuarter" ? "Last Quarter" : 
               dateRange === "lastYear" ? "Last Year" : "Custom Range"}
              <button 
                className="ml-1 hover:bg-gray-200 rounded-full"
                onClick={() => setDateRange("last30days")}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {organization !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Org: {organizations.find(org => org.id === organization)?.name}
              <button 
                className="ml-1 hover:bg-gray-200 rounded-full"
                onClick={() => setOrganization("all")}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {department !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Dept: {departments.find(dept => dept.id === department)?.name}
              <button 
                className="ml-1 hover:bg-gray-200 rounded-full"
                onClick={() => setDepartment("all")}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {team !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Team: {teams.find(t => t.id === team)?.name}
              <button 
                className="ml-1 hover:bg-gray-200 rounded-full"
                onClick={() => setTeam("all")}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>

        {/* Analytics View Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab Content */}
          <div className="space-y-6">
            {/* Key Metrics Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Course Completion Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Learning Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.5 hrs</div>
                  <p className="text-xs text-muted-foreground">per user this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7.8/10</div>
                  <p className="text-xs text-muted-foreground">Based on platform activity</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Activity & Completion</CardTitle>
                  <CardDescription>Enrollment vs. Completion Rates</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded">
                  <BarChart className="w-40 h-40 text-blue-500" />
                  <p className="text-gray-500 ml-4">Bar chart showing course enrollments and completion rates.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Skill Development & Proficiency</CardTitle>
                  <CardDescription>Overall Skill Proficiency Distribution</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded">
                  <PieChart className="w-40 h-40 text-green-500" />
                  <p className="text-gray-500 ml-4">Pie chart showing skill proficiency levels (Beginner, Intermediate, Advanced).</p>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Platform Engagement Trends</CardTitle>
                  <CardDescription>User Activity Over Time (DAU/WAU)</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded">
                  <LineChart className="w-full h-64 text-purple-500" />
                </CardContent>
              </Card>
            </div>
            
            {/* Top Performers Section */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Departments</CardTitle>
                  <CardDescription>Based on completion rates and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.slice(1, 5).map((dept, index) => (
                      <div key={dept.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            index === 0 ? "bg-yellow-100 text-yellow-700" :
                            index === 1 ? "bg-gray-100 text-gray-700" :
                            index === 2 ? "bg-amber-100 text-amber-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {index + 1}
                          </div>
                          <span>{dept.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{95 - index * 5}%</span>
                          <TrendingUp className={`h-4 w-4 ${index < 2 ? "text-green-500" : "text-blue-500"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Learning Content</CardTitle>
                  <CardDescription>Based on enrollment and completion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "Leadership Essentials",
                      "Technical Skills Bootcamp",
                      "Project Management Fundamentals",
                      "Communication Masterclass"
                    ].map((course, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            index === 0 ? "bg-yellow-100 text-yellow-700" :
                            index === 1 ? "bg-gray-100 text-gray-700" :
                            index === 2 ? "bg-amber-100 text-amber-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {index + 1}
                          </div>
                          <span>{course}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{450 - index * 75} users</span>
                          <BookOpen className="h-4 w-4 text-blue-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
      
      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Export Analytics Report</DialogTitle>
            <DialogDescription>
              Choose the format and sections to include in your exported report.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label>Sections to Include</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="overview" 
                  checked={isSectionSelected("overview")}
                  onCheckedChange={() => toggleExportSection("overview")}
                />
                <Label htmlFor="overview" className="flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2 text-blue-500" />
                  Overview & Key Metrics
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="activity" 
                  checked={isSectionSelected("activity")}
                  onCheckedChange={() => toggleExportSection("activity")}
                />
                <Label htmlFor="activity" className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-green-500" />
                  Learning Activity & Completion
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="skills" 
                  checked={isSectionSelected("skills")}
                  onCheckedChange={() => toggleExportSection("skills")}
                />
                <Label htmlFor="skills" className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-purple-500" />
                  Skill Development & Proficiency
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="engagement" 
                  checked={isSectionSelected("engagement")}
                  onCheckedChange={() => toggleExportSection("engagement")}
                />
                <Label htmlFor="engagement" className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-orange-500" />
                  Platform Engagement Trends
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="raw-data" 
                  checked={isSectionSelected("raw-data")}
                  onCheckedChange={() => toggleExportSection("raw-data")}
                />
                <Label htmlFor="raw-data" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  Raw Data Tables
                </Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name</Label>
              <input 
                id="report-name"
                type="text" 
                placeholder="Analytics Report - May 2025" 
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmExport} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PlatformLayout>
  );
};

export default AnalyticsDashboardPage;
