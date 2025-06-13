"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter,
  Users,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function JobRolesPage() {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock job roles data
  const jobRolesData = {
    overview: {
      totalRoles: 24,
      activeRoles: 18,
      avgSkillCoverage: 72,
      rolesWithGaps: 6
    },
    roles: [
      {
        id: 1,
        title: "Software Engineer",
        department: "Engineering",
        level: "Mid-Level",
        employees: 32,
        requiredSkills: ["JavaScript", "React", "Node.js", "Git", "Testing"],
        skillCoverage: 85,
        avgExperience: "3.2 years",
        salaryRange: "$70k - $95k",
        status: "Active",
        skillGaps: ["Advanced Testing", "DevOps"]
      },
      {
        id: 2,
        title: "Product Manager",
        department: "Product",
        level: "Senior",
        employees: 8,
        requiredSkills: ["Product Strategy", "Analytics", "User Research", "Agile", "Communication"],
        skillCoverage: 78,
        avgExperience: "5.1 years",
        salaryRange: "$90k - $120k",
        status: "Active",
        skillGaps: ["Data Analysis", "Technical Writing"]
      },
      {
        id: 3,
        title: "Sales Representative",
        department: "Sales",
        level: "Entry-Level",
        employees: 24,
        requiredSkills: ["Sales Techniques", "CRM", "Communication", "Negotiation", "Product Knowledge"],
        skillCoverage: 65,
        avgExperience: "1.8 years",
        salaryRange: "$45k - $65k",
        status: "Active",
        skillGaps: ["Advanced Negotiation", "Digital Sales Tools"]
      },
      {
        id: 4,
        title: "Data Scientist",
        department: "Engineering",
        level: "Senior",
        employees: 12,
        requiredSkills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
        skillCoverage: 82,
        avgExperience: "4.5 years",
        salaryRange: "$85k - $115k",
        status: "Active",
        skillGaps: ["Deep Learning", "MLOps"]
      },
      {
        id: 5,
        title: "Marketing Specialist",
        department: "Marketing",
        level: "Mid-Level",
        employees: 16,
        requiredSkills: ["Digital Marketing", "Content Creation", "SEO", "Analytics", "Social Media"],
        skillCoverage: 70,
        avgExperience: "2.9 years",
        salaryRange: "$55k - $75k",
        status: "Active",
        skillGaps: ["Marketing Automation", "Video Production"]
      },
      {
        id: 6,
        title: "DevOps Engineer",
        department: "Engineering",
        level: "Senior",
        employees: 6,
        requiredSkills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Infrastructure as Code"],
        skillCoverage: 88,
        avgExperience: "4.8 years",
        salaryRange: "$95k - $125k",
        status: "Active",
        skillGaps: ["Security Best Practices"]
      }
    ],
    skillGaps: [
      { role: "Software Engineer", skill: "Advanced Testing", employees: 32, priority: "High" },
      { role: "Sales Representative", skill: "Digital Sales Tools", employees: 24, priority: "Medium" },
      { role: "Marketing Specialist", skill: "Marketing Automation", employees: 16, priority: "High" },
      { role: "Data Scientist", skill: "MLOps", employees: 12, priority: "Medium" },
      { role: "Product Manager", skill: "Data Analysis", employees: 8, priority: "Low" }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Roles</h1>
          <p className="text-gray-600">Define and manage job roles and their skill requirements</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobRolesData.overview.totalRoles}</div>
            <p className="text-xs text-muted-foreground">
              {jobRolesData.overview.activeRoles} active roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Skill Coverage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobRolesData.overview.avgSkillCoverage}%</div>
            <Progress value={jobRolesData.overview.avgSkillCoverage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles with Gaps</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobRolesData.overview.rolesWithGaps}</div>
            <p className="text-xs text-muted-foreground">
              Need skill development
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobRolesData.roles.reduce((sum, role) => sum + role.employees, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all roles
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Role Overview</TabsTrigger>
          <TabsTrigger value="skills">Skill Requirements</TabsTrigger>
          <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Job Roles</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search roles..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobRolesData.roles.map((role) => (
                  <Card key={role.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{role.title}</CardTitle>
                          <CardDescription>
                            {role.department} • {role.level} • {role.employees} employees
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={role.skillCoverage >= 80 ? 'default' : 'secondary'}>
                            {role.skillCoverage}% Skills
                          </Badge>
                          <Badge variant="outline">{role.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Avg Experience</p>
                          <p className="font-medium">{role.avgExperience}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Salary Range</p>
                          <p className="font-medium">{role.salaryRange}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Skill Coverage</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={role.skillCoverage} className="flex-1" />
                            <span className="text-sm">{role.skillCoverage}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Employees</p>
                          <p className="font-medium">{role.employees}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {role.requiredSkills.map((skill) => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      {role.skillGaps.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2 text-orange-600">Skill Gaps</p>
                          <div className="flex flex-wrap gap-2">
                            {role.skillGaps.map((gap) => (
                              <Badge key={gap} variant="destructive">{gap}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit Role</Button>
                        <Button variant="outline" size="sm">View Employees</Button>
                        <Button variant="outline" size="sm">Create Learning Path</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Requirements by Role</CardTitle>
              <CardDescription>Overview of skills required across different job roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {jobRolesData.roles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{role.title}</h4>
                        <p className="text-sm text-gray-600">{role.department} • {role.employees} employees</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{role.skillCoverage}% coverage</p>
                        <Progress value={role.skillCoverage} className="w-24 mt-1" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Gaps Analysis</CardTitle>
              <CardDescription>Identify and prioritize skill development needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobRolesData.skillGaps.map((gap, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        gap.priority === 'High' ? 'bg-red-500' : 
                        gap.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">{gap.skill}</h4>
                        <p className="text-sm text-gray-600">{gap.role} • {gap.employees} employees affected</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={gap.priority === 'High' ? 'destructive' : 'secondary'}>
                        {gap.priority} Priority
                      </Badge>
                      <Button variant="outline" size="sm">Create Training</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

