"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Target, 
  Clock,
  Plus,
  Filter,
  Search,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function EngagementPlannerPage() {
  const [selectedView, setSelectedView] = useState('calendar');

  // Mock engagement data
  const engagementData = {
    upcomingDeadlines: [
      { title: "Q4 Leadership Training", department: "Management", dueDate: "Dec 15, 2024", progress: 65, participants: 24 },
      { title: "Data Science Certification", department: "Engineering", dueDate: "Dec 20, 2024", progress: 80, participants: 18 },
      { title: "Sales Skills Workshop", department: "Sales", dueDate: "Jan 10, 2025", progress: 45, participants: 32 },
      { title: "Compliance Training", department: "All", dueDate: "Jan 15, 2025", progress: 30, participants: 245 }
    ],
    campaigns: [
      { 
        id: 1, 
        title: "New Hire Onboarding", 
        status: "Active", 
        participants: 12, 
        completion: 75,
        startDate: "Nov 1, 2024",
        endDate: "Dec 31, 2024",
        courses: ["Company Culture", "Security Training", "Role-specific Skills"]
      },
      { 
        id: 2, 
        title: "Leadership Development", 
        status: "Planning", 
        participants: 24, 
        completion: 0,
        startDate: "Jan 15, 2025",
        endDate: "Mar 15, 2025",
        courses: ["Management Fundamentals", "Team Building", "Strategic Thinking"]
      },
      { 
        id: 3, 
        title: "Technical Skills Upgrade", 
        status: "Active", 
        participants: 56, 
        completion: 42,
        startDate: "Oct 1, 2024",
        endDate: "Feb 28, 2025",
        courses: ["Advanced React", "Cloud Architecture", "DevOps Practices"]
      }
    ],
    recommendations: [
      { type: "Skill Gap", title: "Python Training for Data Team", priority: "High", affected: 15 },
      { type: "Compliance", title: "Annual Security Refresh", priority: "Medium", affected: 245 },
      { type: "Performance", title: "Communication Skills Workshop", priority: "Medium", affected: 32 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Engagement Planner</h1>
          <p className="text-gray-600">Plan and track learning campaigns and initiatives</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Learning initiatives with approaching deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagementData.upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{deadline.title}</h4>
                        <p className="text-sm text-gray-600">{deadline.department} • {deadline.participants} participants</p>
                        <p className="text-sm text-gray-500">Due: {deadline.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium">{deadline.progress}%</span>
                        {deadline.progress >= 80 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : deadline.progress < 50 ? (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <Progress value={deadline.progress} className="w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Campaigns</CardTitle>
              <CardDescription>Manage ongoing and planned learning initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagementData.campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{campaign.title}</CardTitle>
                        <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Participants</p>
                          <p className="font-medium">{campaign.participants}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Completion</p>
                          <p className="font-medium">{campaign.completion}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="font-medium">{campaign.startDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">End Date</p>
                          <p className="font-medium">{campaign.endDate}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Included Courses</p>
                        <div className="flex flex-wrap gap-2">
                          {campaign.courses.map((course, index) => (
                            <Badge key={index} variant="outline">{course}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      {campaign.status === 'Active' && (
                        <Progress value={campaign.completion} />
                      )}
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                        {campaign.status === 'Planning' && (
                          <Button size="sm">Launch Campaign</Button>
                        )}
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
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Suggested learning initiatives based on data analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagementData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        rec.priority === 'High' ? 'bg-red-500' : 
                        rec.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-gray-600">{rec.type} • {rec.affected} people affected</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={rec.priority === 'High' ? 'destructive' : 'secondary'}>
                        {rec.priority} Priority
                      </Badge>
                      <Button variant="outline" size="sm">Create Campaign</Button>
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

