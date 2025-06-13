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
  DollarSign,
  Target,
  Users,
  Clock,
  Award,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";

export default function ImpactAnalyticsPage() {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock impact analytics data
  const impactData = {
    overview: {
      totalROI: 285,
      costSavings: 450000,
      productivityGain: 23,
      employeeRetention: 94
    },
    businessImpact: [
      {
        metric: "Revenue Growth",
        value: "$2.3M",
        change: "+18%",
        period: "YoY",
        trend: "up",
        description: "Attributed to improved sales skills training"
      },
      {
        metric: "Cost Reduction",
        value: "$450K",
        change: "+12%",
        period: "YoY", 
        trend: "up",
        description: "Reduced external training costs"
      },
      {
        metric: "Time to Productivity",
        value: "45 days",
        change: "-30%",
        period: "vs baseline",
        trend: "down",
        description: "New hire onboarding efficiency"
      },
      {
        metric: "Employee Retention",
        value: "94%",
        change: "+8%",
        period: "YoY",
        trend: "up",
        description: "Improved through career development"
      }
    ],
    departmentImpact: [
      {
        department: "Sales",
        roi: 340,
        investment: 125000,
        returns: 425000,
        keyMetrics: {
          dealSize: "+25%",
          closingRate: "+18%",
          timeToClose: "-15%"
        },
        topPrograms: ["Sales Methodology", "Negotiation Skills", "CRM Training"]
      },
      {
        department: "Engineering",
        roi: 220,
        investment: 180000,
        returns: 396000,
        keyMetrics: {
          codeQuality: "+30%",
          deploymentSpeed: "+40%",
          bugReduction: "-25%"
        },
        topPrograms: ["Cloud Architecture", "DevOps", "Security Training"]
      },
      {
        department: "Marketing",
        roi: 195,
        investment: 95000,
        returns: 185250,
        keyMetrics: {
          leadQuality: "+35%",
          campaignROI: "+22%",
          contentOutput: "+45%"
        },
        topPrograms: ["Digital Marketing", "Analytics", "Content Strategy"]
      },
      {
        department: "Customer Success",
        roi: 275,
        investment: 75000,
        returns: 206250,
        keyMetrics: {
          customerSat: "+20%",
          churnReduction: "-15%",
          upsellRate: "+28%"
        },
        topPrograms: ["Customer Relations", "Product Training", "Communication"]
      }
    ],
    skillImpact: [
      {
        skill: "Leadership",
        participants: 45,
        investment: 85000,
        businessValue: 320000,
        outcomes: ["Team productivity +25%", "Employee engagement +30%", "Retention +15%"]
      },
      {
        skill: "Data Analysis",
        participants: 67,
        investment: 120000,
        businessValue: 280000,
        outcomes: ["Decision speed +40%", "Accuracy +35%", "Cost optimization +20%"]
      },
      {
        skill: "Project Management",
        participants: 52,
        investment: 95000,
        businessValue: 245000,
        outcomes: ["On-time delivery +30%", "Budget adherence +25%", "Quality +20%"]
      }
    ],
    trends: {
      monthlyROI: [
        { month: "Jan", roi: 180 },
        { month: "Feb", roi: 195 },
        { month: "Mar", roi: 210 },
        { month: "Apr", roi: 235 },
        { month: "May", roi: 265 },
        { month: "Jun", roi: 285 }
      ],
      investmentVsReturns: [
        { quarter: "Q1", investment: 150000, returns: 285000 },
        { quarter: "Q2", investment: 180000, returns: 378000 },
        { quarter: "Q3", investment: 165000, returns: 412500 },
        { quarter: "Q4", investment: 195000, returns: 487500 }
      ]
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Impact Analytics</h1>
          <p className="text-gray-600">Measure business impact and ROI of learning initiatives</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Analysis
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactData.overview.totalROI}%</div>
            <p className="text-xs text-muted-foreground">
              Return on investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(impactData.overview.costSavings)}</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity Gain</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactData.overview.productivityGain}%</div>
            <p className="text-xs text-muted-foreground">
              Average increase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Retention</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactData.overview.employeeRetention}%</div>
            <p className="text-xs text-muted-foreground">
              Retention rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Business Impact</TabsTrigger>
          <TabsTrigger value="departments">Department ROI</TabsTrigger>
          <TabsTrigger value="skills">Skill Impact</TabsTrigger>
          <TabsTrigger value="trends">Trends & Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Impact Metrics</CardTitle>
              <CardDescription>Key business outcomes from learning investments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {impactData.businessImpact.map((metric, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{metric.metric}</CardTitle>
                        {getTrendIcon(metric.trend)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold">{metric.value}</span>
                        <span className={`text-sm font-medium ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.change}
                        </span>
                        <span className="text-sm text-gray-500">{metric.period}</span>
                      </div>
                      <p className="text-sm text-gray-600">{metric.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department ROI Analysis</CardTitle>
              <CardDescription>Return on investment by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {impactData.departmentImpact.map((dept, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{dept.department}</CardTitle>
                        <Badge variant={dept.roi > 250 ? "default" : "secondary"} className="text-lg px-3 py-1">
                          {dept.roi}% ROI
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Investment</p>
                          <p className="text-lg font-bold">{formatCurrency(dept.investment)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Returns</p>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(dept.returns)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Net Gain</p>
                          <p className="text-lg font-bold">{formatCurrency(dept.returns - dept.investment)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Key Performance Improvements</p>
                        <div className="grid grid-cols-3 gap-4">
                          {Object.entries(dept.keyMetrics).map(([key, value]) => (
                            <div key={key} className="text-center p-2 bg-gray-50 rounded">
                              <p className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                              <p className="font-bold text-green-600">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Top Performing Programs</p>
                        <div className="flex flex-wrap gap-2">
                          {dept.topPrograms.map((program) => (
                            <Badge key={program} variant="outline">
                              {program}
                            </Badge>
                          ))}
                        </div>
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
              <CardTitle>Skill-Based Impact Analysis</CardTitle>
              <CardDescription>Business value generated by specific skill development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {impactData.skillImpact.map((skill, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{skill.skill}</CardTitle>
                          <CardDescription>{skill.participants} participants</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Business Value</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(skill.businessValue)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Investment</p>
                          <p className="font-bold">{formatCurrency(skill.investment)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ROI</p>
                          <p className="font-bold text-green-600">
                            {Math.round((skill.businessValue / skill.investment - 1) * 100)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cost per Participant</p>
                          <p className="font-bold">{formatCurrency(skill.investment / skill.participants)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Business Outcomes</p>
                        <div className="space-y-2">
                          {skill.outcomes.map((outcome, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{outcome}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ROI Trend</CardTitle>
                <CardDescription>Monthly return on investment progression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impactData.trends.monthlyROI.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={data.roi / 3} className="w-24" />
                        <span className="text-sm font-bold">{data.roi}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment vs Returns</CardTitle>
                <CardDescription>Quarterly investment and return comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impactData.trends.investmentVsReturns.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{data.quarter}</span>
                        <span className="text-sm font-bold">
                          ROI: {Math.round((data.returns / data.investment - 1) * 100)}%
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Investment</span>
                          <span>{formatCurrency(data.investment)}</span>
                        </div>
                        <Progress value={50} className="h-2" />
                        <div className="flex items-center justify-between text-xs">
                          <span>Returns</span>
                          <span className="text-green-600">{formatCurrency(data.returns)}</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>Forecasted impact based on current trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Forecasting</h3>
                <p className="text-gray-600 mb-4">
                  AI-powered predictions for future learning ROI and business impact
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Forecast
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

