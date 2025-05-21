"use client";

import React, { useState } from 'react';
import PlatformLayout from "@/components/platform/PlatformLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  BarChart, TrendingUp, DollarSign, FileText, ThumbsUp, BookOpen, 
  Briefcase, LineChart, PieChart, HelpCircle, ChevronRight, ChevronDown,
  Users, Award, Clock, CheckCircle, AlertCircle, Info, Plus, Edit, Trash2,
  Save, X, ArrowUpDown
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Tooltip component for business context explanations
const InfoTooltip = ({ text }: { text: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block">
      <Info 
        className="h-4 w-4 text-blue-500 cursor-help ml-1" 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />
      {isVisible && (
        <div className="absolute z-10 w-64 p-2 bg-white border rounded shadow-lg text-xs text-gray-700 -translate-x-1/2 left-1/2 bottom-full mb-2">
          {text}
          <div className="absolute w-2 h-2 bg-white border-b border-r transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

const ROIPage = () => {
  const [timeframe, setTimeframe] = useState("last6months");
  const [department, setDepartment] = useState("all");
  const [showModelExplainer, setShowModelExplainer] = useState(false);
  
  // Business outcomes state
  const [businessOutcomes, setBusinessOutcomes] = useState([
    { 
      id: "1",
      name: "Productivity", 
      before: 100, 
      after: 115, 
      unit: "%", 
      impact: "+15%",
      description: "Average tasks completed per employee per week"
    },
    { 
      id: "2",
      name: "Quality", 
      before: 92, 
      after: 97, 
      unit: "%", 
      impact: "+5%",
      description: "Reduction in errors and rework required"
    },
    { 
      id: "3",
      name: "Employee Retention", 
      before: 82, 
      after: 90, 
      unit: "%", 
      impact: "+8%",
      description: "Annual retention rate for trained employees"
    },
    { 
      id: "4",
      name: "Customer Satisfaction", 
      before: 78, 
      after: 90, 
      unit: "NPS", 
      impact: "+12 points",
      description: "Net Promoter Score from customer feedback"
    }
  ]);
  
  // Dialog states
  const [showAddOutcomeDialog, setShowAddOutcomeDialog] = useState(false);
  const [showEditOutcomeDialog, setShowEditOutcomeDialog] = useState(false);
  const [currentOutcome, setCurrentOutcome] = useState<any>(null);
  
  // New outcome form state
  const [newOutcome, setNewOutcome] = useState({
    name: "",
    before: 0,
    after: 0,
    unit: "%",
    description: ""
  });
  
  // Mock data - replace with actual data fetching and processing logic
  const learningJourneyData = {
    satisfaction: {
      score: 4.2,
      outOf: 5,
      responses: 876,
      trend: "+0.3",
      topPrograms: [
        { name: "Leadership Essentials", score: 4.8 },
        { name: "Technical Skills Bootcamp", score: 4.5 },
        { name: "Customer Service Excellence", score: 4.3 }
      ]
    },
    knowledge: {
      averageGain: 32,
      completionRate: 78,
      skillsGained: [
        { name: "Project Management", gain: 42 },
        { name: "Communication", gain: 28 },
        { name: "Technical Skills", gain: 35 },
        { name: "Leadership", gain: 24 }
      ]
    },
    application: {
      implementationRate: 68,
      managerObserved: 72,
      topAppliedSkills: [
        { name: "Problem Solving", rate: 82 },
        { name: "Team Collaboration", rate: 76 },
        { name: "Process Improvement", rate: 65 }
      ]
    },
    results: {
      productivityIncrease: 15,
      qualityImprovement: 23,
      employeeRetention: 8,
      customerSatisfaction: 12
    },
    value: {
      roi: 240,
      investmentAmount: 125000,
      returnAmount: 425000,
      timeToValue: 6
    }
  };
  
  // Handle adding a new business outcome
  const handleAddOutcome = () => {
    // Calculate impact
    let impact = "";
    const difference = newOutcome.after - newOutcome.before;
    
    if (newOutcome.unit === "%" || newOutcome.unit === "points") {
      impact = `+${difference}${newOutcome.unit === "%" ? "%" : " points"}`;
    } else {
      const percentChange = ((newOutcome.after - newOutcome.before) / newOutcome.before) * 100;
      impact = `+${percentChange.toFixed(1)}%`;
    }
    
    const newBusinessOutcome = {
      id: Date.now().toString(),
      ...newOutcome,
      impact
    };
    
    setBusinessOutcomes([...businessOutcomes, newBusinessOutcome]);
    setShowAddOutcomeDialog(false);
    setNewOutcome({
      name: "",
      before: 0,
      after: 0,
      unit: "%",
      description: ""
    });
  };
  
  // Handle editing a business outcome
  const handleEditOutcome = () => {
    if (!currentOutcome) return;
    
    // Calculate impact
    let impact = "";
    const difference = currentOutcome.after - currentOutcome.before;
    
    if (currentOutcome.unit === "%" || currentOutcome.unit === "points") {
      impact = `+${difference}${currentOutcome.unit === "%" ? "%" : " points"}`;
    } else {
      const percentChange = ((currentOutcome.after - currentOutcome.before) / currentOutcome.before) * 100;
      impact = `+${percentChange.toFixed(1)}%`;
    }
    
    const updatedOutcome = {
      ...currentOutcome,
      impact
    };
    
    const updatedOutcomes = businessOutcomes.map(outcome => 
      outcome.id === currentOutcome.id ? updatedOutcome : outcome
    );
    
    setBusinessOutcomes(updatedOutcomes);
    setShowEditOutcomeDialog(false);
    setCurrentOutcome(null);
  };
  
  // Handle deleting a business outcome
  const handleDeleteOutcome = (id: string) => {
    const updatedOutcomes = businessOutcomes.filter(outcome => outcome.id !== id);
    setBusinessOutcomes(updatedOutcomes);
  };
  
  // Open edit dialog for a business outcome
  const openEditDialog = (outcome: any) => {
    setCurrentOutcome(outcome);
    setShowEditOutcomeDialog(true);
  };

  return (
    <PlatformLayout title="Learning Impact Dashboard">
      <div className="space-y-6">
        {/* Header with filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Learning Impact Dashboard</h1>
            <p className="text-muted-foreground">Demonstrating the business value of learning initiatives</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last3months">Last 3 Months</SelectItem>
                <SelectItem value="last6months">Last 6 Months</SelectItem>
                <SelectItem value="lastyear">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="customerservice">Customer Service</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Executive Summary Card */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-6 w-6 text-green-500" />
              Business Value Created
            </CardTitle>
            <CardDescription>Executive summary of learning impact</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="text-4xl font-bold text-green-600">{learningJourneyData.value.roi}%</div>
                <p className="text-sm text-center mt-1">Return on Investment</p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  For every $1 invested, $3.40 returned
                  <InfoTooltip text="ROI calculated as (Benefits - Costs) / Costs × 100%" />
                </p>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="text-4xl font-bold text-blue-600">+{learningJourneyData.results.productivityIncrease}%</div>
                <p className="text-sm text-center mt-1">Productivity Increase</p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Average across all departments
                  <InfoTooltip text="Measured by output per employee compared to pre-training baseline" />
                </p>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="text-4xl font-bold text-purple-600">+{learningJourneyData.results.employeeRetention}%</div>
                <p className="text-sm text-center mt-1">Employee Retention</p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Improvement in annual retention
                  <InfoTooltip text="Comparing retention rates of employees who completed training vs. those who didn't" />
                </p>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="text-4xl font-bold text-orange-600">{learningJourneyData.value.timeToValue}</div>
                <p className="text-sm text-center mt-1">Months to Value</p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Average time to positive ROI
                  <InfoTooltip text="Time required for learning initiatives to generate positive returns" />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Learning Value Journey */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            Learning Value Journey
            <InfoTooltip text="This journey shows how learning transforms from initial satisfaction to business value, following industry-standard evaluation models" />
          </h2>
          
          <div className="relative">
            {/* Journey Progress Bar */}
            <div className="hidden md:block absolute top-16 left-0 w-full h-1 bg-gray-200 z-0">
              <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: '100%' }}></div>
            </div>
            
            {/* Journey Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {/* Step 1: Satisfaction */}
              <Card className="md:mt-8">
                <CardHeader className="bg-blue-50 dark:bg-blue-900/30 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-md flex items-center">
                      <div className="bg-blue-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center mr-2">1</div>
                      Learner Satisfaction
                    </CardTitle>
                    <ThumbsUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardDescription>Did people like the learning?</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold">{learningJourneyData.satisfaction.score}/{learningJourneyData.satisfaction.outOf}</div>
                    <p className="text-sm text-muted-foreground">Average rating ({learningJourneyData.satisfaction.responses} responses)</p>
                    <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">{learningJourneyData.satisfaction.trend} vs. previous period</Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Step 2: Knowledge */}
              <Card className="md:mt-8">
                <CardHeader className="bg-indigo-50 dark:bg-indigo-900/30 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-md flex items-center">
                      <div className="bg-indigo-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center mr-2">2</div>
                      Skills Gained
                    </CardTitle>
                    <BookOpen className="h-5 w-5 text-indigo-500" />
                  </div>
                  <CardDescription>Did they learn something useful?</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold">+{learningJourneyData.knowledge.averageGain}%</div>
                    <p className="text-sm text-muted-foreground">Average knowledge gain</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-100">{learningJourneyData.knowledge.completionRate}% completion rate</Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Step 3: Application */}
              <Card className="md:mt-8">
                <CardHeader className="bg-purple-50 dark:bg-purple-900/30 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-md flex items-center">
                      <div className="bg-purple-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center mr-2">3</div>
                      Skills Applied
                    </CardTitle>
                    <Briefcase className="h-5 w-5 text-purple-500" />
                  </div>
                  <CardDescription>Are they using what they learned?</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold">{learningJourneyData.application.implementationRate}%</div>
                    <p className="text-sm text-muted-foreground">Implementation rate</p>
                    <Badge className="mt-2 bg-purple-100 text-purple-800 hover:bg-purple-100">{learningJourneyData.application.managerObserved}% manager-observed</Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Step 4: Results */}
              <Card className="md:mt-8">
                <CardHeader className="bg-orange-50 dark:bg-orange-900/30 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-md flex items-center">
                      <div className="bg-orange-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center mr-2">4</div>
                      Performance Improvement
                    </CardTitle>
                    <LineChart className="h-5 w-5 text-orange-500" />
                  </div>
                  <CardDescription>Is it driving better results?</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold">4/4</div>
                    <p className="text-sm text-muted-foreground">Key metrics improved</p>
                    <Badge className="mt-2 bg-orange-100 text-orange-800 hover:bg-orange-100">All targets met</Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Step 5: Value */}
              <Card className="md:mt-8">
                <CardHeader className="bg-green-50 dark:bg-green-900/30 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-md flex items-center">
                      <div className="bg-green-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center mr-2">5</div>
                      Business Value
                    </CardTitle>
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <CardDescription>Was it worth the investment?</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold">${(learningJourneyData.value.returnAmount - learningJourneyData.value.investmentAmount).toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Net value created</p>
                    <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">{learningJourneyData.value.roi}% ROI</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Business Outcomes - Before/After */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-blue-500" />
                  Business Outcomes: Before & After
                </CardTitle>
                <CardDescription>Measurable improvements following learning initiatives</CardDescription>
              </div>
              <Button 
                onClick={() => setShowAddOutcomeDialog(true)}
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Business Outcome
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Metric</th>
                    <th className="text-center py-3 px-4">Before</th>
                    <th className="text-center py-3 px-4">After</th>
                    <th className="text-center py-3 px-4">Impact</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businessOutcomes.map((outcome) => (
                    <tr key={outcome.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 font-medium">{outcome.name}</td>
                      <td className="py-3 px-4 text-center">
                        {outcome.before}{outcome.unit}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {outcome.after}{outcome.unit}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          {outcome.impact}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate">
                        {outcome.description}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditDialog(outcome)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteOutcome(outcome.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {businessOutcomes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No business outcomes added yet.</p>
                <Button 
                  onClick={() => setShowAddOutcomeDialog(true)}
                  variant="outline" 
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Business Outcome
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* ROI Calculation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-green-500" />
              ROI Calculation
            </CardTitle>
            <CardDescription>Financial analysis of learning investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Investment</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Training Development</span>
                    <span className="text-sm font-medium">${(learningJourneyData.value.investmentAmount * 0.35).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Delivery Costs</span>
                    <span className="text-sm font-medium">${(learningJourneyData.value.investmentAmount * 0.25).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Employee Time</span>
                    <span className="text-sm font-medium">${(learningJourneyData.value.investmentAmount * 0.40).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-semibold">
                    <span>Total Investment</span>
                    <span>${learningJourneyData.value.investmentAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Returns</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Productivity Gains</span>
                    <span className="text-sm font-medium">${(learningJourneyData.value.returnAmount * 0.45).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Quality Improvements</span>
                    <span className="text-sm font-medium">${(learningJourneyData.value.returnAmount * 0.20).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Retention Savings</span>
                    <span className="text-sm font-medium">${(learningJourneyData.value.returnAmount * 0.25).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="text-sm font-medium">${(learningJourneyData.value.returnAmount * 0.10).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-semibold">
                    <span>Total Returns</span>
                    <span>${learningJourneyData.value.returnAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="mr-4">
                    <div className="text-sm text-gray-600">ROI Formula:</div>
                    <div className="font-mono bg-white dark:bg-gray-800 px-3 py-1 rounded border mt-1">
                      (Returns - Investment) / Investment × 100%
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">=</div>
                </div>
                
                <div className="flex items-center">
                  <div className="font-mono bg-white dark:bg-gray-800 px-3 py-1 rounded border">
                    (${learningJourneyData.value.returnAmount.toLocaleString()} - ${learningJourneyData.value.investmentAmount.toLocaleString()}) / ${learningJourneyData.value.investmentAmount.toLocaleString()} × 100%
                  </div>
                  <div className="text-2xl font-bold text-green-600 mx-4">=</div>
                  <div className="text-3xl font-bold text-green-600">{learningJourneyData.value.roi}%</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-center text-gray-600">
                For every $1 invested in learning, the organization received $3.40 in return.
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Model Explainer (Collapsible) */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => setShowModelExplainer(!showModelExplainer)}
          >
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-blue-500" />
                Understanding the Learning Impact Models
              </CardTitle>
              {showModelExplainer ? 
                <ChevronDown className="h-5 w-5 text-gray-500" /> : 
                <ChevronRight className="h-5 w-5 text-gray-500" />
              }
            </div>
            <CardDescription>Learn about the methodologies behind this dashboard</CardDescription>
          </CardHeader>
          
          {showModelExplainer && (
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      Kirkpatrick's Four Levels
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      A widely used model for evaluating training effectiveness through four progressive levels:
                    </p>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-2">Level 1</Badge>
                        <span><span className="font-medium">Reaction</span> - How participants feel about the training</span>
                      </li>
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-2">Level 2</Badge>
                        <span><span className="font-medium">Learning</span> - Knowledge or skills gained</span>
                      </li>
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-2">Level 3</Badge>
                        <span><span className="font-medium">Behavior</span> - Application of learning on the job</span>
                      </li>
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-2">Level 4</Badge>
                        <span><span className="font-medium">Results</span> - Business outcomes from training</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      Phillips ROI Methodology
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Extends Kirkpatrick's model by adding a fifth level focused on financial return:
                    </p>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-2">Level 5</Badge>
                        <span><span className="font-medium">ROI</span> - Comparing monetary benefits to costs</span>
                      </li>
                    </ul>
                    <p className="text-sm mt-3">
                      The methodology involves:
                    </p>
                    <ul className="mt-1 space-y-1 text-sm list-disc pl-5">
                      <li>Converting data to monetary values</li>
                      <li>Isolating the effects of training</li>
                      <li>Capturing fully-loaded costs</li>
                      <li>Calculating the ROI</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold flex items-center">
                    <BarChart className="h-4 w-4 mr-2 text-purple-500" />
                    How This Dashboard Combines These Models
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our Learning Impact Dashboard translates these academic models into business-friendly language and metrics:
                  </p>
                  <div className="mt-3 overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="px-4 py-2 text-left">Traditional Model</th>
                          <th className="px-4 py-2 text-left">Our Dashboard</th>
                          <th className="px-4 py-2 text-left">Business Focus</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="px-4 py-2">Kirkpatrick Level 1 (Reaction)</td>
                          <td className="px-4 py-2">Learner Satisfaction</td>
                          <td className="px-4 py-2">Engagement & Experience</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Kirkpatrick Level 2 (Learning)</td>
                          <td className="px-4 py-2">Skills Gained</td>
                          <td className="px-4 py-2">Capability Building</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Kirkpatrick Level 3 (Behavior)</td>
                          <td className="px-4 py-2">Skills Applied</td>
                          <td className="px-4 py-2">Workplace Implementation</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Kirkpatrick Level 4 (Results)</td>
                          <td className="px-4 py-2">Performance Improvement</td>
                          <td className="px-4 py-2">Operational Metrics</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Phillips Level 5 (ROI)</td>
                          <td className="px-4 py-2">Business Value</td>
                          <td className="px-4 py-2">Financial Impact</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline">
            Export Report
          </Button>
          <Button variant="outline">
            Schedule Updates
          </Button>
          <Button>
            Share Dashboard
          </Button>
        </div>
      </div>
      
      {/* Add Business Outcome Dialog */}
      <Dialog open={showAddOutcomeDialog} onOpenChange={setShowAddOutcomeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Business Outcome</DialogTitle>
            <DialogDescription>
              Add a new business outcome to track the impact of learning initiatives.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="outcome-name">Metric Name</Label>
              <Input 
                id="outcome-name" 
                placeholder="e.g., Customer Happiness, NPS, Sales Conversion"
                value={newOutcome.name}
                onChange={(e) => setNewOutcome({...newOutcome, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="outcome-before">Before Value</Label>
                <Input 
                  id="outcome-before" 
                  type="number"
                  placeholder="e.g., 75"
                  value={newOutcome.before}
                  onChange={(e) => setNewOutcome({...newOutcome, before: parseFloat(e.target.value)})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="outcome-after">After Value</Label>
                <Input 
                  id="outcome-after" 
                  type="number"
                  placeholder="e.g., 85"
                  value={newOutcome.after}
                  onChange={(e) => setNewOutcome({...newOutcome, after: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="outcome-unit">Unit</Label>
              <Select 
                value={newOutcome.unit}
                onValueChange={(value) => setNewOutcome({...newOutcome, unit: value})}
              >
                <SelectTrigger id="outcome-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="%">Percentage (%)</SelectItem>
                  <SelectItem value="points">Points</SelectItem>
                  <SelectItem value="NPS">NPS</SelectItem>
                  <SelectItem value="CSAT">CSAT</SelectItem>
                  <SelectItem value="CES">CES</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="outcome-description">Description</Label>
              <Textarea 
                id="outcome-description" 
                placeholder="Briefly describe what this metric measures and why it's important"
                value={newOutcome.description}
                onChange={(e) => setNewOutcome({...newOutcome, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddOutcomeDialog(false)}>Cancel</Button>
            <Button onClick={handleAddOutcome}>Add Outcome</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Business Outcome Dialog */}
      <Dialog open={showEditOutcomeDialog} onOpenChange={setShowEditOutcomeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Business Outcome</DialogTitle>
            <DialogDescription>
              Update the details of this business outcome.
            </DialogDescription>
          </DialogHeader>
          {currentOutcome && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-outcome-name">Metric Name</Label>
                <Input 
                  id="edit-outcome-name" 
                  value={currentOutcome.name}
                  onChange={(e) => setCurrentOutcome({...currentOutcome, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-outcome-before">Before Value</Label>
                  <Input 
                    id="edit-outcome-before" 
                    type="number"
                    value={currentOutcome.before}
                    onChange={(e) => setCurrentOutcome({...currentOutcome, before: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-outcome-after">After Value</Label>
                  <Input 
                    id="edit-outcome-after" 
                    type="number"
                    value={currentOutcome.after}
                    onChange={(e) => setCurrentOutcome({...currentOutcome, after: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-outcome-unit">Unit</Label>
                <Select 
                  value={currentOutcome.unit}
                  onValueChange={(value) => setCurrentOutcome({...currentOutcome, unit: value})}
                >
                  <SelectTrigger id="edit-outcome-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="%">Percentage (%)</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                    <SelectItem value="NPS">NPS</SelectItem>
                    <SelectItem value="CSAT">CSAT</SelectItem>
                    <SelectItem value="CES">CES</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-outcome-description">Description</Label>
                <Textarea 
                  id="edit-outcome-description" 
                  value={currentOutcome.description}
                  onChange={(e) => setCurrentOutcome({...currentOutcome, description: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditOutcomeDialog(false)}>Cancel</Button>
            <Button onClick={handleEditOutcome}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PlatformLayout>
  );
};

export default ROIPage;
