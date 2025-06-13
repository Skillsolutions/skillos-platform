"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Users,
  TrendingUp,
  Award,
  Clock,
  Target,
  Brain,
  Star
} from "lucide-react";

export default function LearningPersonalizationPage() {
  const [selectedTab, setSelectedTab] = useState('paths');

  // Mock learning data
  const learningData = {
    overview: {
      activePaths: 12,
      totalLearners: 189,
      avgCompletion: 78,
      skillsTracked: 45
    },
    learningPaths: [
      {
        id: 1,
        title: "Frontend Development Mastery",
        description: "Complete path from beginner to advanced frontend developer",
        duration: "12 weeks",
        difficulty: "Intermediate",
        enrollments: 45,
        completion: 72,
        skills: ["React", "JavaScript", "CSS", "HTML", "TypeScript"],
        courses: 8,
        status: "Active"
      },
      {
        id: 2,
        title: "Data Science Fundamentals",
        description: "Learn data analysis, visualization, and machine learning basics",
        duration: "16 weeks",
        difficulty: "Beginner",
        enrollments: 32,
        completion: 65,
        skills: ["Python", "Statistics", "Pandas", "Matplotlib", "SQL"],
        courses: 10,
        status: "Active"
      },
      {
        id: 3,
        title: "Leadership Excellence",
        description: "Develop essential leadership and management skills",
        duration: "8 weeks",
        difficulty: "Advanced",
        enrollments: 28,
        completion: 85,
        skills: ["Leadership", "Communication", "Strategy", "Team Building"],
        courses: 6,
        status: "Active"
      },
      {
        id: 4,
        title: "Digital Marketing Pro",
        description: "Master modern digital marketing strategies and tools",
        duration: "10 weeks",
        difficulty: "Intermediate",
        enrollments: 38,
        completion: 58,
        skills: ["SEO", "Social Media", "Analytics", "Content Marketing"],
        courses: 7,
        status: "Active"
      }
    ],
    recommendations: [
      { learner: "Sarah Johnson", role: "Engineer", recommended: "Advanced React Patterns", reason: "Based on current React skills" },
      { learner: "Mike Chen", role: "Sales", recommended: "Negotiation Mastery", reason: "To improve close rates" },
      { learner: "Emily Davis", role: "Marketing", recommended: "Data Analytics", reason: "Skill gap identified" },
      { learner: "David Wilson", role: "HR", recommended: "Change Management", reason: "Career progression goal" }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Personalization</h1>
          <p className="text-gray-600">Create and manage personalized learning experiences</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Path
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Paths</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningData.overview.activePaths}</div>
            <p className="text-xs text-muted-foreground">
              Learning paths available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningData.overview.totalLearners}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled in paths
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningData.overview.avgCompletion}%</div>
            <Progress value={learningData.overview.avgCompletion} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Tracked</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningData.overview.skillsTracked}</div>
            <p className="text-xs text-muted-foreground">
              Across all paths
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="analytics">Path Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="paths" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Learning Paths</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search paths..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningData.learningPaths.map((path) => (
                  <Card key={path.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{path.title}</CardTitle>
                        <Badge variant={path.status === 'Active' ? 'default' : 'secondary'}>
                          {path.status}
                        </Badge>
                      </div>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium">{path.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Difficulty</p>
                          <Badge variant="outline">{path.difficulty}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Enrollments</p>
                          <p className="font-medium">{path.enrollments}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Courses</p>
                          <p className="font-medium">{path.courses}</p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completion Rate</span>
                          <span>{path.completion}%</span>
                        </div>
                        <Progress value={path.completion} />
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Skills Covered</p>
                        <div className="flex flex-wrap gap-1">
                          {path.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit Path</Button>
                        <Button variant="outline" size="sm">View Analytics</Button>
                        <Button size="sm">Manage Learners</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Recommendations</CardTitle>
              <CardDescription>Personalized learning suggestions based on roles, skills, and goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Brain className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{rec.learner}</h4>
                        <p className="text-sm text-gray-600">{rec.role}</p>
                        <p className="text-sm text-blue-600 font-medium">Recommended: {rec.recommended}</p>
                        <p className="text-xs text-gray-500">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button size="sm">Assign</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Path Performance Analytics</CardTitle>
              <CardDescription>Track engagement and effectiveness of learning paths</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {learningData.learningPaths.map((path) => (
                  <div key={path.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{path.title}</h4>
                        <p className="text-sm text-gray-600">{path.enrollments} learners • {path.courses} courses</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{path.completion}% completion</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">4.{Math.floor(Math.random() * 5) + 3}</span>
                        </div>
                      </div>
                    </div>
                    <Progress value={path.completion} />
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

