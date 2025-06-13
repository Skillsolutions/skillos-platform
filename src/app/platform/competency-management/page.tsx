"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  Plus, 
  Search, 
  Filter,
  Users,
  TrendingUp,
  Target,
  CheckCircle,
  Star,
  Brain,
  BookOpen
} from "lucide-react";

export default function CompetencyManagementPage() {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock competency data
  const competencyData = {
    overview: {
      totalCompetencies: 32,
      skillsTracked: 156,
      avgProficiency: 68,
      employeesAssessed: 245
    },
    competencies: [
      {
        id: 1,
        name: "Technical Leadership",
        category: "Leadership",
        description: "Ability to lead technical teams and make architectural decisions",
        skills: ["System Design", "Code Review", "Mentoring", "Technical Strategy"],
        levels: ["Beginner", "Intermediate", "Advanced", "Expert"],
        employees: 45,
        avgLevel: 2.3,
        assessments: 128,
        status: "Active"
      },
      {
        id: 2,
        name: "Data Analysis",
        category: "Technical",
        description: "Proficiency in analyzing and interpreting complex data sets",
        skills: ["SQL", "Python", "Statistics", "Data Visualization", "Excel"],
        levels: ["Beginner", "Intermediate", "Advanced", "Expert"],
        employees: 67,
        avgLevel: 2.1,
        assessments: 89,
        status: "Active"
      },
      {
        id: 3,
        name: "Customer Communication",
        category: "Soft Skills",
        description: "Effective communication with customers and stakeholders",
        skills: ["Active Listening", "Presentation", "Conflict Resolution", "Empathy"],
        levels: ["Beginner", "Intermediate", "Advanced", "Expert"],
        employees: 123,
        avgLevel: 2.8,
        assessments: 156,
        status: "Active"
      },
      {
        id: 4,
        name: "Project Management",
        category: "Management",
        description: "Planning, executing, and delivering projects successfully",
        skills: ["Planning", "Risk Management", "Agile", "Stakeholder Management"],
        levels: ["Beginner", "Intermediate", "Advanced", "Expert"],
        employees: 89,
        avgLevel: 2.5,
        assessments: 134,
        status: "Active"
      }
    ],
    skillGaps: [
      { competency: "Technical Leadership", skill: "System Design", gap: "High", employees: 23 },
      { competency: "Data Analysis", skill: "Advanced Statistics", gap: "Medium", employees: 34 },
      { competency: "Customer Communication", skill: "Conflict Resolution", gap: "Low", employees: 12 },
      { competency: "Project Management", skill: "Risk Management", gap: "High", employees: 45 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Competency Management</h1>
          <p className="text-gray-600">Define, assess, and develop organizational competencies</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Competency
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Competencies</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competencyData.overview.totalCompetencies}</div>
            <p className="text-xs text-muted-foreground">
              Defined competencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Tracked</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competencyData.overview.skillsTracked}</div>
            <p className="text-xs text-muted-foreground">
              Individual skills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Proficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competencyData.overview.avgProficiency}%</div>
            <Progress value={competencyData.overview.avgProficiency} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees Assessed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competencyData.overview.employeesAssessed}</div>
            <p className="text-xs text-muted-foreground">
              Have assessments
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Competencies</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
          <TabsTrigger value="development">Development Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Organizational Competencies</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search competencies..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competencyData.competencies.map((competency) => (
                  <Card key={competency.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{competency.name}</CardTitle>
                          <CardDescription>{competency.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{competency.category}</Badge>
                          <Badge variant={competency.status === 'Active' ? 'default' : 'secondary'}>
                            {competency.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Employees</p>
                          <p className="font-medium">{competency.employees}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg Level</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={(competency.avgLevel / 4) * 100} className="flex-1" />
                            <span className="text-sm">{competency.avgLevel.toFixed(1)}/4</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Assessments</p>
                          <p className="font-medium">{competency.assessments}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Skills</p>
                          <p className="font-medium">{competency.skills.length}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Proficiency Levels</p>
                        <div className="flex space-x-2">
                          {competency.levels.map((level, index) => (
                            <Badge 
                              key={level} 
                              variant={index < competency.avgLevel ? 'default' : 'outline'}
                              className="text-xs"
                            >
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {competency.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit Competency</Button>
                        <Button variant="outline" size="sm">View Assessments</Button>
                        <Button size="sm">Create Development Plan</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competency Assessments</CardTitle>
              <CardDescription>Track and manage competency assessments across the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Recent Assessments</h4>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Assessment
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {competencyData.competencies.map((competency) => (
                    <div key={competency.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h5 className="font-medium">{competency.name}</h5>
                        <p className="text-sm text-gray-600">{competency.assessments} completed assessments</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">Level {competency.avgLevel.toFixed(1)}</p>
                          <Progress value={(competency.avgLevel / 4) * 100} className="w-20" />
                        </div>
                        <Button variant="outline" size="sm">View Results</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competency Gaps Analysis</CardTitle>
              <CardDescription>Identify areas where additional development is needed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competencyData.skillGaps.map((gap, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        gap.gap === 'High' ? 'bg-red-500' : 
                        gap.gap === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">{gap.skill}</h4>
                        <p className="text-sm text-gray-600">{gap.competency} • {gap.employees} employees affected</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={gap.gap === 'High' ? 'destructive' : gap.gap === 'Medium' ? 'secondary' : 'default'}>
                        {gap.gap} Priority
                      </Badge>
                      <Button variant="outline" size="sm">Create Training</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="development" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Development Plans</CardTitle>
              <CardDescription>Create and track individual development plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Development Plans</h3>
                <p className="text-gray-600 mb-4">Create personalized development plans based on competency gaps</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Development Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

