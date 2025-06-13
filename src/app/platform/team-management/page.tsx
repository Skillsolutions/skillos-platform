"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Clock
} from "lucide-react";

export default function TeamManagementPage() {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock team data
  const teamData = {
    overview: {
      totalMembers: 245,
      activeMembers: 189,
      departments: 5,
      avgCompletionRate: 78
    },
    departments: [
      { 
        name: "Engineering", 
        members: 85, 
        manager: "Sarah Johnson", 
        completionRate: 82,
        topSkills: ["JavaScript", "Python", "React"],
        recentActivity: "15 courses completed this week"
      },
      { 
        name: "Sales", 
        members: 62, 
        manager: "Mike Chen", 
        completionRate: 75,
        topSkills: ["Sales Strategy", "CRM", "Communication"],
        recentActivity: "12 courses completed this week"
      },
      { 
        name: "Marketing", 
        members: 45, 
        manager: "Emily Davis", 
        completionRate: 80,
        topSkills: ["Digital Marketing", "Analytics", "Content"],
        recentActivity: "8 courses completed this week"
      },
      { 
        name: "HR", 
        members: 28, 
        manager: "David Wilson", 
        completionRate: 85,
        topSkills: ["HR Management", "Recruitment", "Training"],
        recentActivity: "6 courses completed this week"
      },
      { 
        name: "Finance", 
        members: 25, 
        manager: "Lisa Brown", 
        completionRate: 70,
        topSkills: ["Financial Analysis", "Accounting", "Excel"],
        recentActivity: "4 courses completed this week"
      }
    ],
    members: [
      { 
        id: 1, 
        name: "Sarah Johnson", 
        role: "Engineering Manager", 
        department: "Engineering",
        email: "sarah@acme.com",
        joinDate: "Jan 2022",
        coursesCompleted: 24,
        hoursLearned: 156,
        skills: ["Leadership", "React", "Node.js"],
        status: "Active"
      },
      { 
        id: 2, 
        name: "Mike Chen", 
        role: "Sales Director", 
        department: "Sales",
        email: "mike@acme.com",
        joinDate: "Mar 2021",
        coursesCompleted: 18,
        hoursLearned: 142,
        skills: ["Sales Strategy", "Negotiation", "CRM"],
        status: "Active"
      },
      { 
        id: 3, 
        name: "Emily Davis", 
        role: "Marketing Manager", 
        department: "Marketing",
        email: "emily@acme.com",
        joinDate: "Jun 2022",
        coursesCompleted: 16,
        hoursLearned: 128,
        skills: ["Digital Marketing", "SEO", "Analytics"],
        status: "Active"
      },
      { 
        id: 4, 
        name: "David Wilson", 
        role: "HR Manager", 
        department: "HR",
        email: "david@acme.com",
        joinDate: "Sep 2020",
        coursesCompleted: 15,
        hoursLearned: 118,
        skills: ["HR Management", "Training", "Compliance"],
        status: "Active"
      },
      { 
        id: 5, 
        name: "Lisa Brown", 
        role: "Finance Manager", 
        department: "Finance",
        email: "lisa@acme.com",
        joinDate: "Feb 2023",
        coursesCompleted: 14,
        hoursLearned: 105,
        skills: ["Financial Analysis", "Budgeting", "Excel"],
        status: "Active"
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage team members and track their learning progress</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.overview.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {teamData.overview.activeMembers} active members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.overview.departments}</div>
            <p className="text-xs text-muted-foreground">
              Across the organization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.overview.avgCompletionRate}%</div>
            <Progress value={teamData.overview.avgCompletionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.overview.activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              Learning this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Department Overview</TabsTrigger>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamData.departments.map((dept) => (
              <Card key={dept.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                    <Badge variant="outline">{dept.members} members</Badge>
                  </div>
                  <CardDescription>Manager: {dept.manager}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{dept.completionRate}%</span>
                    </div>
                    <Progress value={dept.completionRate} />
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Top Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {dept.topSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">{dept.recentActivity}</p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View Department Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search members..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamData.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-medium text-blue-600">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role} • {member.department}</p>
                        <p className="text-xs text-gray-500">Joined {member.joinDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">{member.coursesCompleted}</p>
                        <p className="text-xs text-gray-600">Courses</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{member.hoursLearned}h</p>
                        <p className="text-xs text-gray-600">Hours</p>
                      </div>
                      <div className="flex flex-wrap gap-1 max-w-32">
                        {member.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {member.skills.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{member.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Metrics</CardTitle>
              <CardDescription>Learning progress and engagement across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamData.departments.map((dept) => (
                  <div key={dept.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{dept.name}</h4>
                        <p className="text-sm text-gray-600">{dept.members} members • {dept.manager}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{dept.completionRate}% completion</p>
                        <p className="text-sm text-gray-600">{dept.recentActivity}</p>
                      </div>
                    </div>
                    <Progress value={dept.completionRate} />
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

