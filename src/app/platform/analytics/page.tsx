"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Award,
  Target,
  BookOpen,
  Activity
} from "lucide-react";

export default function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalLearners: 245,
      activeLearners: 189,
      completionRate: 78,
      avgTimePerCourse: 4.2,
      totalHours: 8750,
      coursesCompleted: 3420
    },
    departmentBreakdown: [
      { department: "Engineering", userCount: 85, completedCourses: 1240, hoursSpent: 3200, completionRate: 82 },
      { department: "Sales", userCount: 62, completedCourses: 890, hoursSpent: 2100, completionRate: 75 },
      { department: "Marketing", userCount: 45, completedCourses: 650, hoursSpent: 1800, completionRate: 80 },
      { department: "HR", userCount: 28, completedCourses: 420, hoursSpent: 950, completionRate: 85 },
      { department: "Finance", userCount: 25, completedCourses: 220, hoursSpent: 700, completionRate: 70 }
    ],
    topCourses: [
      { title: "Advanced React Development", enrollments: 156, completions: 128, rating: 4.8 },
      { title: "Data Science Fundamentals", enrollments: 142, completions: 98, rating: 4.6 },
      { title: "Leadership Essentials", enrollments: 134, completions: 112, rating: 4.7 },
      { title: "Machine Learning Basics", enrollments: 128, completions: 89, rating: 4.5 },
      { title: "Project Management", enrollments: 118, completions: 95, rating: 4.4 }
    ],
    skillsProgress: [
      { skill: "JavaScript", progress: 85, learners: 89 },
      { skill: "Python", progress: 72, learners: 67 },
      { skill: "Leadership", progress: 68, learners: 45 },
      { skill: "Data Analysis", progress: 61, learners: 38 },
      { skill: "Communication", progress: 78, learners: 92 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600">Comprehensive learning analytics and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button>Export Analytics</Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalLearners}</div>
            <div className="text-sm text-green-600 mt-1">
              {analyticsData.overview.activeLearners} active learners
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.completionRate}%</div>
            <Progress value={analyticsData.overview.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalHours.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">
              Avg {analyticsData.overview.avgTimePerCourse}h per course
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="departments">Department Analytics</TabsTrigger>
          <TabsTrigger value="courses">Course Performance</TabsTrigger>
          <TabsTrigger value="skills">Skills Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Learning metrics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyticsData.departmentBreakdown.map((dept) => (
                  <Card key={dept.department}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{dept.department}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Users:</span>
                        <span className="font-medium">{dept.userCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Completed:</span>
                        <span className="font-medium">{dept.completedCourses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Hours:</span>
                        <span className="font-medium">{dept.hoursSpent}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Completion Rate:</span>
                          <span className="font-medium">{dept.completionRate}%</span>
                        </div>
                        <Progress value={dept.completionRate} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Courses</CardTitle>
              <CardDescription>Most popular and highest-rated courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topCourses.map((course, index) => (
                  <div key={course.title} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-gray-600">
                          {course.enrollments} enrollments • {course.completions} completions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {Math.round((course.completions / course.enrollments) * 100)}% completion
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Development Progress</CardTitle>
              <CardDescription>Organization-wide skill development tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analyticsData.skillsProgress.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{skill.skill}</h4>
                      <div className="text-sm text-gray-600">
                        {skill.learners} learners • {skill.progress}% avg progress
                      </div>
                    </div>
                    <Progress value={skill.progress} />
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

