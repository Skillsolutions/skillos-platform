"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  Users,
  Target,
  Award,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Clock,
  CheckCircle
} from "lucide-react";

export default function SuccessionPlanningPage() {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock succession planning data
  const successionData = {
    overview: {
      keyPositions: 18,
      identifiedSuccessors: 42,
      readyNow: 12,
      developmentPlans: 28
    },
    keyPositions: [
      {
        id: 1,
        title: "VP of Engineering",
        department: "Engineering",
        incumbent: "Sarah Johnson",
        retirementRisk: "High",
        criticalityScore: 95,
        successors: [
          { name: "Mike Chen", readiness: "Ready Now", probability: 85 },
          { name: "Emily Davis", readiness: "1-2 Years", probability: 70 },
          { name: "David Wilson", readiness: "2-3 Years", probability: 60 }
        ],
        skillGaps: ["Strategic Planning", "Budget Management"],
        status: "Active"
      },
      {
        id: 2,
        title: "Head of Sales",
        department: "Sales",
        incumbent: "Robert Brown",
        retirementRisk: "Medium",
        criticalityScore: 88,
        successors: [
          { name: "Lisa Garcia", readiness: "Ready Now", probability: 90 },
          { name: "Tom Anderson", readiness: "1-2 Years", probability: 75 }
        ],
        skillGaps: ["International Markets", "Digital Sales"],
        status: "Active"
      },
      {
        id: 3,
        title: "Chief Marketing Officer",
        department: "Marketing",
        incumbent: "Jennifer Lee",
        retirementRisk: "Low",
        criticalityScore: 82,
        successors: [
          { name: "Alex Thompson", readiness: "1-2 Years", probability: 80 },
          { name: "Maria Rodriguez", readiness: "2-3 Years", probability: 65 }
        ],
        skillGaps: ["Brand Strategy", "Data Analytics"],
        status: "Active"
      },
      {
        id: 4,
        title: "Director of Operations",
        department: "Operations",
        incumbent: "Kevin Park",
        retirementRisk: "Medium",
        criticalityScore: 78,
        successors: [
          { name: "Rachel Kim", readiness: "Ready Now", probability: 85 },
          { name: "James Wilson", readiness: "1-2 Years", probability: 70 }
        ],
        skillGaps: ["Process Optimization", "Vendor Management"],
        status: "Active"
      }
    ],
    developmentActivities: [
      { successor: "Mike Chen", activity: "Executive Leadership Program", progress: 75, dueDate: "2024-08-15" },
      { successor: "Emily Davis", activity: "Strategic Planning Workshop", progress: 45, dueDate: "2024-07-30" },
      { successor: "Lisa Garcia", activity: "International Sales Training", progress: 90, dueDate: "2024-06-20" },
      { successor: "Alex Thompson", activity: "Brand Management Certification", progress: 60, dueDate: "2024-09-10" }
    ]
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case "Ready Now": return "bg-green-500";
      case "1-2 Years": return "bg-yellow-500";
      case "2-3 Years": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Succession Planning</h1>
          <p className="text-gray-600">Plan and prepare for leadership transitions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Key Position
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Key Positions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successionData.overview.keyPositions}</div>
            <p className="text-xs text-muted-foreground">
              Critical roles identified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Identified Successors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successionData.overview.identifiedSuccessors}</div>
            <p className="text-xs text-muted-foreground">
              Potential successors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready Now</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successionData.overview.readyNow}</div>
            <p className="text-xs text-muted-foreground">
              Immediately ready
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Development Plans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successionData.overview.developmentPlans}</div>
            <p className="text-xs text-muted-foreground">
              Active plans
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Key Positions</TabsTrigger>
          <TabsTrigger value="successors">Successor Pipeline</TabsTrigger>
          <TabsTrigger value="development">Development Plans</TabsTrigger>
          <TabsTrigger value="analytics">Risk Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Key Positions & Succession Plans</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search positions..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {successionData.keyPositions.map((position) => (
                  <Card key={position.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{position.title}</CardTitle>
                          <CardDescription>
                            {position.department} • Current: {position.incumbent}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            Criticality: {position.criticalityScore}%
                          </Badge>
                          <Badge variant={position.retirementRisk === 'High' ? 'destructive' : 'secondary'}>
                            {position.retirementRisk} Risk
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">Succession Pipeline</h4>
                        <div className="space-y-2">
                          {position.successors.map((successor, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${getReadinessColor(successor.readiness)}`}></div>
                                <div>
                                  <p className="font-medium">{successor.name}</p>
                                  <p className="text-sm text-gray-600">{successor.readiness}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="text-sm font-medium">{successor.probability}% fit</p>
                                  <Progress value={successor.probability} className="w-20" />
                                </div>
                                <Button variant="outline" size="sm">View Profile</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {position.skillGaps.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Skill Gaps to Address</h4>
                          <div className="flex flex-wrap gap-2">
                            {position.skillGaps.map((gap) => (
                              <Badge key={gap} variant="destructive" className="text-xs">
                                {gap}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit Plan</Button>
                        <Button variant="outline" size="sm">Add Successor</Button>
                        <Button size="sm">Create Development Plan</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="successors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Successor Pipeline Overview</CardTitle>
              <CardDescription>Track readiness levels across all potential successors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Ready Now</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">12</div>
                      <p className="text-xs text-gray-600">Successors ready</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">1-2 Years</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">18</div>
                      <p className="text-xs text-gray-600">In development</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">2-3 Years</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">12</div>
                      <p className="text-xs text-gray-600">Early development</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-3">
                  {successionData.keyPositions.flatMap(position => 
                    position.successors.map((successor, index) => (
                      <div key={`${position.id}-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${getReadinessColor(successor.readiness)}`}></div>
                          <div>
                            <h4 className="font-medium">{successor.name}</h4>
                            <p className="text-sm text-gray-600">Successor for {position.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">{successor.readiness}</Badge>
                          <div className="text-right">
                            <p className="text-sm font-medium">{successor.probability}% fit</p>
                            <Progress value={successor.probability} className="w-20" />
                          </div>
                          <Button variant="outline" size="sm">View Development</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="development" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Development Plans</CardTitle>
              <CardDescription>Track progress of successor development activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {successionData.developmentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{activity.activity}</h4>
                        <p className="text-sm text-gray-600">{activity.successor}</p>
                        <p className="text-xs text-gray-500">Due: {activity.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{activity.progress}% complete</p>
                        <Progress value={activity.progress} className="w-24" />
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
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
              <CardTitle>Succession Risk Analytics</CardTitle>
              <CardDescription>Analyze succession risks and readiness across the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Risk Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">High Risk</span>
                        <span className="text-sm font-medium text-red-600">6 positions</span>
                      </div>
                      <Progress value={33} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Medium Risk</span>
                        <span className="text-sm font-medium text-yellow-600">8 positions</span>
                      </div>
                      <Progress value={44} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Low Risk</span>
                        <span className="text-sm font-medium text-green-600">4 positions</span>
                      </div>
                      <Progress value={22} className="h-2" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Readiness Pipeline</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Ready Now</span>
                        <span className="text-sm font-medium text-green-600">12 successors</span>
                      </div>
                      <Progress value={29} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">1-2 Years</span>
                        <span className="text-sm font-medium text-yellow-600">18 successors</span>
                      </div>
                      <Progress value={43} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">2-3 Years</span>
                        <span className="text-sm font-medium text-orange-600">12 successors</span>
                      </div>
                      <Progress value={29} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

