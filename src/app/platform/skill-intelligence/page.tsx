"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Target,
  Award,
  Users,
  BookOpen,
  Lightbulb,
  BarChart3
} from "lucide-react";

export default function SkillIntelligencePage() {
  const [selectedTab, setSelectedTab] = useState('insights');

  // Mock skill intelligence data
  const skillData = {
    overview: {
      skillsTracked: 156,
      emergingSkills: 12,
      skillGaps: 34,
      aiRecommendations: 28
    },
    skillInsights: [
      {
        skill: "Machine Learning",
        category: "Technical",
        demand: "High",
        supply: "Low",
        gap: 78,
        trend: "Rising",
        marketValue: "$95k avg salary",
        employees: 23,
        courses: 8,
        priority: "Critical"
      },
      {
        skill: "Cloud Architecture",
        category: "Technical",
        demand: "High",
        supply: "Medium",
        gap: 45,
        trend: "Rising",
        marketValue: "$110k avg salary",
        employees: 34,
        courses: 12,
        priority: "High"
      },
      {
        skill: "Data Visualization",
        category: "Technical",
        demand: "Medium",
        supply: "Medium",
        gap: 32,
        trend: "Stable",
        marketValue: "$75k avg salary",
        employees: 45,
        courses: 6,
        priority: "Medium"
      },
      {
        skill: "Digital Marketing",
        category: "Marketing",
        demand: "High",
        supply: "High",
        gap: 15,
        trend: "Rising",
        marketValue: "$65k avg salary",
        employees: 67,
        courses: 15,
        priority: "Low"
      }
    ],
    emergingSkills: [
      { skill: "Generative AI", growth: 245, demand: "Explosive", timeframe: "6 months" },
      { skill: "Quantum Computing", growth: 89, demand: "Emerging", timeframe: "2-3 years" },
      { skill: "Blockchain Development", growth: 156, demand: "High", timeframe: "1 year" },
      { skill: "AR/VR Development", growth: 134, demand: "Growing", timeframe: "1-2 years" }
    ],
    recommendations: [
      {
        type: "Skill Gap",
        title: "Machine Learning Bootcamp",
        description: "Address critical ML skills shortage",
        impact: "High",
        effort: "Medium",
        timeline: "3 months",
        affected: 23
      },
      {
        type: "Emerging Skill",
        title: "Generative AI Workshop",
        description: "Prepare team for AI revolution",
        impact: "High",
        effort: "Low",
        timeline: "1 month",
        affected: 45
      },
      {
        type: "Career Development",
        title: "Cloud Certification Program",
        description: "Advance cloud architecture skills",
        impact: "Medium",
        effort: "High",
        timeline: "6 months",
        affected: 34
      }
    ]
  };

  const getTrendIcon = (trend: string) => {
    return trend === "Rising" ? <TrendingUp className="h-4 w-4 text-green-600" /> : 
           <BarChart3 className="h-4 w-4 text-blue-600" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skill Intelligence</h1>
          <p className="text-gray-600">AI-powered insights into skill trends and gaps</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            Generate Insights
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Tracked</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillData.overview.skillsTracked}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emerging Skills</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillData.overview.emergingSkills}</div>
            <p className="text-xs text-muted-foreground">
              Trending upward
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Gaps</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillData.overview.skillGaps}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillData.overview.aiRecommendations}</div>
            <p className="text-xs text-muted-foreground">
              Generated this week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">Skill Insights</TabsTrigger>
          <TabsTrigger value="emerging">Emerging Skills</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="market">Market Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Skill Intelligence Dashboard</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search skills..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillData.skillInsights.map((skill, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{skill.skill}</CardTitle>
                          <CardDescription>{skill.category} • {skill.employees} employees</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(skill.priority)}`}></div>
                          <Badge variant="outline">{skill.priority}</Badge>
                          {getTrendIcon(skill.trend)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Market Demand</p>
                          <Badge variant={skill.demand === 'High' ? 'default' : 'secondary'}>
                            {skill.demand}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Internal Supply</p>
                          <Badge variant={skill.supply === 'Low' ? 'destructive' : 'secondary'}>
                            {skill.supply}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Skill Gap</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={skill.gap} className="flex-1" />
                            <span className="text-sm">{skill.gap}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Market Value</p>
                          <p className="font-medium text-green-600">{skill.marketValue}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{skill.courses} courses available</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View Courses</Button>
                          <Button variant="outline" size="sm">Skill Assessment</Button>
                          <Button size="sm">Create Learning Path</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emerging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emerging Skills Radar</CardTitle>
              <CardDescription>Skills gaining momentum in the market</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillData.emergingSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Lightbulb className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{skill.skill}</h4>
                        <p className="text-sm text-gray-600">Growth: {skill.growth}% • {skill.timeframe}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={skill.demand === 'Explosive' ? 'destructive' : 'default'}>
                        {skill.demand}
                      </Badge>
                      <Button variant="outline" size="sm">Explore</Button>
                      <Button size="sm">Add to Roadmap</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Recommendations</CardTitle>
              <CardDescription>Intelligent suggestions for skill development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillData.recommendations.map((rec, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <CardDescription>{rec.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{rec.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Impact</p>
                          <Badge variant={rec.impact === 'High' ? 'default' : 'secondary'}>
                            {rec.impact}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Effort</p>
                          <Badge variant="outline">{rec.effort}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Timeline</p>
                          <p className="font-medium">{rec.timeline}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Affected</p>
                          <p className="font-medium">{rec.affected} employees</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button size="sm">Implement</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Intelligence</CardTitle>
              <CardDescription>External market trends and salary benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Market Intelligence Dashboard</h3>
                <p className="text-gray-600 mb-4">Real-time market data and salary benchmarks</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Market Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

