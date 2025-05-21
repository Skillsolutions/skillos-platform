"use client";
import React, { useState } from "react";
import PlatformLayout from "@/components/platform/PlatformLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Edit3, Zap, Library, Search, Filter, Download, Bell, Info, CheckCircle, AlertTriangle, BarChart, Users, Brain, FileText, ChevronDown, ListChecks, Target, FileQuestion, User, UserPlus, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { assessmentInfoData, AssessmentInfoCard } from "./assessment-info-cards";

// Define interfaces for type safety
interface Assessment {
  id: string;
  employeeName: string;
  type: string;
  status: string;
  dueDate: string;
  results?: AssessmentResults;
}

interface AssessmentResults {
  scores: {
    category: string;
    score: number;
    benchmark: number;
  }[];
  strengths: string[];
  developmentAreas: string[];
  recommendations: string[];
}

const CustomAssessmentCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showIDPModal, setShowIDPModal] = useState(false);
  const [showPIPModal, setShowPIPModal] = useState(false);
  
  // New state for mockup modals
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPreMadeModal, setShowPreMadeModal] = useState(false);
  const [selectedPreMadeType, setSelectedPreMadeType] = useState("360-feedback");

  // Assessment Creation Options Component
  const AssessmentCreationOptions = () => {
    const options = [
      {
        id: "custom",
        title: "Custom Assessment",
        subtitle: "Start from Scratch",
        icon: <Edit3 className="h-8 w-8" />,
        color: "bg-blue-500",
        description: "Manually create your own assessment with custom questions and formats.",
        detailedDescription: "Build assessments tailored to your specific needs. Create custom questions, set scoring criteria, and design your own format. Perfect for specialized skill evaluations or department-specific assessments.",
        action: () => setShowCustomModal(true)
      },
      {
        id: "ai",
        title: "Use AI to Generate",
        subtitle: "AI Builder",
        icon: <Zap className="h-8 w-8" />,
        color: "bg-purple-500",
        description: "Input key criteria and let AI generate suggested questions and structure.",
        detailedDescription: "Save time with AI-powered assessment creation. Simply input job roles, required skills, and experience levels, and our AI will generate relevant questions and a structured assessment format for you to review and customize.",
        action: () => setShowAIModal(true)
      },
      {
        id: "library",
        title: "Choose Assessment",
        subtitle: "Precurated Library",
        icon: <Library className="h-8 w-8" />,
        color: "bg-green-500",
        description: "Select from our ready-made library of professional assessments.",
        detailedDescription: "Choose from our extensive library of professionally designed assessments including 360-Degree Feedback, Technical Skills Tests, Skills Gap Analysis, Learning Retention Quizzes, and Soft Skills Assessments. Ready to use with minimal setup.",
        action: () => setShowPreMadeModal(true)
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((option) => (
          <Card 
            key={option.id} 
            className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
            onMouseEnter={() => setHoveredOption(option.id)}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={option.action}
          >
            <CardHeader className={`${option.color} text-white transition-all duration-300 ${hoveredOption === option.id ? 'pb-8' : ''}`}>
              <div className="flex justify-center">
                {option.icon}
              </div>
              <CardTitle className="text-center mt-2">{option.title}</CardTitle>
              <CardDescription className="text-center text-white opacity-90">{option.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-center">{option.description}</p>
              {hoveredOption === option.id && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100 text-sm text-gray-700">
                  {option.detailedDescription}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button 
                variant={hoveredOption === option.id ? "default" : "outline"}
                className={`transition-all duration-300 ${hoveredOption === option.id ? (
                  option.id === "custom" ? "bg-blue-500 hover:bg-blue-600" : 
                  option.id === "ai" ? "bg-purple-500 hover:bg-purple-600" : 
                  "bg-green-500 hover:bg-green-600"
                ) : ''}`}
              >
                {option.id === "custom" ? "Create Custom" : 
                 option.id === "ai" ? "Generate with AI" : 
                 "Browse Library"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  // Assessment types with detailed descriptions
  const assessmentTypes = {
    "360-Degree Feedback": "Collects feedback from managers, peers, and direct reports to provide a comprehensive view of an employee's performance and behavior.",
    "Technical Skills Test": "Evaluates specific technical competencies through practical exercises and knowledge-based questions.",
    "Skills Gap Analysis": "Identifies the difference between current skills and those required for optimal job performance or career advancement.",
    "Learning Retention Quiz": "Measures how well employees have retained information from training programs or learning initiatives.",
    "Soft Skills Assessment": "Evaluates communication, teamwork, leadership, and other interpersonal abilities through scenario-based questions."
  };

  // Mock assessment data with results
  const assessments: Assessment[] = [
    {
      id: "1",
      employeeName: "Sarah Miller",
      type: "360-Degree Feedback",
      status: "in-progress",
      dueDate: "May 25"
    },
    {
      id: "2",
      employeeName: "John Davis",
      type: "Technical Skills Test",
      status: "not-started",
      dueDate: "May 28"
    },
    {
      id: "3",
      employeeName: "Emily Wong",
      type: "Skills Gap Analysis",
      status: "completed",
      dueDate: "May 10",
      results: {
        scores: [
          { category: "Technical Knowledge", score: 85, benchmark: 75 },
          { category: "Problem Solving", score: 92, benchmark: 80 },
          { category: "Communication", score: 68, benchmark: 75 },
          { category: "Leadership", score: 72, benchmark: 70 },
          { category: "Teamwork", score: 88, benchmark: 80 }
        ],
        strengths: [
          "Exceptional problem-solving abilities",
          "Strong technical knowledge in data analysis",
          "Effective collaboration with cross-functional teams"
        ],
        developmentAreas: [
          "Written communication skills",
          "Presentation delivery",
          "Strategic planning"
        ],
        recommendations: [
          "Communication skills workshop",
          "Presentation skills course",
          "Mentoring in strategic planning"
        ]
      }
    },
    {
      id: "4",
      employeeName: "Michael Brown",
      type: "Learning Retention Quiz",
      status: "overdue",
      dueDate: "May 5"
    },
    {
      id: "5",
      employeeName: "Jessica Taylor",
      type: "360-Degree Feedback",
      status: "completed",
      dueDate: "May 12",
      results: {
        scores: [
          { category: "Communication", score: 90, benchmark: 75 },
          { category: "Teamwork", score: 85, benchmark: 80 },
          { category: "Adaptability", score: 78, benchmark: 75 },
          { category: "Problem Solving", score: 65, benchmark: 70 },
          { category: "Time Management", score: 72, benchmark: 80 }
        ],
        strengths: [
          "Excellent verbal communication",
          "Strong team collaboration",
          "Adaptable to changing priorities"
        ],
        developmentAreas: [
          "Analytical problem solving",
          "Time management and prioritization",
          "Technical knowledge"
        ],
        recommendations: [
          "Problem-solving workshop",
          "Time management course",
          "Technical skills training"
        ]
      }
    },
    {
      id: "6",
      employeeName: "Ahmed Ali",
      type: "Skills Gap Analysis",
      status: "pending",
      dueDate: "May 22"
    },
    {
      id: "7",
      employeeName: "Fatima Rahman",
      type: "Soft Skills Assessment",
      status: "completed",
      dueDate: "May 10",
      results: {
        scores: [
          { category: "Communication", score: 82, benchmark: 75 },
          { category: "Leadership", score: 88, benchmark: 80 },
          { category: "Adaptability", score: 75, benchmark: 75 },
          { category: "Conflict Resolution", score: 90, benchmark: 70 },
          { category: "Emotional Intelligence", score: 95, benchmark: 80 }
        ],
        strengths: [
          "Exceptional emotional intelligence",
          "Strong conflict resolution skills",
          "Effective leadership capabilities"
        ],
        developmentAreas: [
          "Technical knowledge",
          "Data analysis",
          "Project management"
        ],
        recommendations: [
          "Technical skills training",
          "Data analysis course",
          "Project management certification"
        ]
      }
    }
  ];

  // Filter assessments based on search query and filters
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || assessment.type === typeFilter;
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get status badge with appropriate color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "not-started":
        return <Badge className="bg-gray-500">Not Started</Badge>;
      case "overdue":
        return <Badge className="bg-red-500">Overdue</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle view results action
  const handleViewResults = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowResultsModal(true);
  };

  // Handle create IDP action
  const handleCreateIDP = () => {
    setShowResultsModal(false);
    setShowIDPModal(true);
  };

  // Handle create PIP action
  const handleCreatePIP = () => {
    setShowResultsModal(false);
    setShowPIPModal(true);
  };

  // Handle pre-made assessment selection
  const handlePreMadeSelection = (id: string) => {
    setSelectedPreMadeType(id);
    // In a real implementation, this would load the selected assessment template
    alert(`Selected pre-made assessment: ${id}`);
  };

  // Custom Assessment Modal Component
  const CustomAssessmentModal = () => (
    <Dialog open={showCustomModal} onOpenChange={setShowCustomModal}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Custom Assessment</DialogTitle>
          <DialogDescription>
            Build your own assessment from scratch with custom questions and formats.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="assessment-title">Assessment Title</Label>
            <Input id="assessment-title" placeholder="Enter assessment title" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assessment-description">Description</Label>
            <Textarea 
              id="assessment-description" 
              placeholder="Describe the purpose and goals of this assessment"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Questions</h3>
              <Button variant="outline" size="sm">+ Add Question</Button>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">Question 1</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="q1-text">Question Text</Label>
                    <Input 
                      id="q1-text" 
                      placeholder="Enter your question" 
                      defaultValue="How would you rate this person's communication skills?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select defaultValue="rating">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Rating Scale</SelectItem>
                        <SelectItem value="multiple">Multiple Choice</SelectItem>
                        <SelectItem value="text">Text Response</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Rating Scale</Label>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                    <div className="flex justify-between">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full border flex items-center justify-center">
                            {rating}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">Question 2</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="q2-text">Question Text</Label>
                    <Input 
                      id="q2-text" 
                      placeholder="Enter your question" 
                      defaultValue="What are this person's greatest strengths?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select defaultValue="text">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Rating Scale</SelectItem>
                        <SelectItem value="multiple">Multiple Choice</SelectItem>
                        <SelectItem value="text">Text Response</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="q2-placeholder">Response Placeholder</Label>
                    <Input 
                      id="q2-placeholder" 
                      placeholder="Enter placeholder text" 
                      defaultValue="Please provide specific examples..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assessment Settings</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="anonymous" />
                  <label htmlFor="anonymous" className="text-sm">Anonymous responses</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="required" defaultChecked />
                  <label htmlFor="required" className="text-sm">All questions required</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="progress" defaultChecked />
                  <label htmlFor="progress" className="text-sm">Show progress indicator</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Visibility</Label>
              <RadioGroup defaultValue="private">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="text-sm">Private (Only you can see)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="team" id="team" />
                  <Label htmlFor="team" className="text-sm">Team (Visible to your team)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="org" id="org" />
                  <Label htmlFor="org" className="text-sm">Organization (Visible to all)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCustomModal(false)}>Cancel</Button>
          <Button>Save Assessment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // AI Assessment Generator Modal Component
  const AIAssessmentModal = () => (
    <Dialog open={showAIModal} onOpenChange={setShowAIModal}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Generate Assessment with AI</DialogTitle>
          <DialogDescription>
            Input key criteria and let AI generate a suggested assessment structure and questions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ai-target-audience">Target Audience</Label>
            <Input 
              id="ai-target-audience" 
              placeholder="E.g., Software Engineers, Marketing Team, Customer Service Representatives"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ai-objective">Assessment Objective</Label>
            <Input 
              id="ai-objective" 
              placeholder="E.g., Evaluate leadership potential, Assess technical skills, Measure team collaboration"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ai-skills">Key Skills to Evaluate</Label>
            <Textarea 
              id="ai-skills" 
              placeholder="List the specific skills you want to assess, separated by commas"
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ai-exam-type">Assessment Format</Label>
            <Select defaultValue="mixed">
              <SelectTrigger id="ai-exam-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="360">360-Degree Feedback</SelectItem>
                <SelectItem value="skills">Skills Assessment</SelectItem>
                <SelectItem value="knowledge">Knowledge Test</SelectItem>
                <SelectItem value="mixed">Mixed Format</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">Advanced Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ai-question-count">Number of Questions</Label>
                <Select defaultValue="10-15">
                  <SelectTrigger id="ai-question-count">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-10">5-10 questions</SelectItem>
                    <SelectItem value="10-15">10-15 questions</SelectItem>
                    <SelectItem value="15-20">15-20 questions</SelectItem>
                    <SelectItem value="20+">20+ questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ai-difficulty">Difficulty Level</Label>
                <Select defaultValue="intermediate">
                  <SelectTrigger id="ai-difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="mixed">Mixed Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAIModal(false)}>Cancel</Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Zap className="h-4 w-4 mr-2" />
            Generate Assessment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Pre-Made Assessment Selection Modal Component
  const PreMadeAssessmentModal = () => (
    <Dialog open={showPreMadeModal} onOpenChange={setShowPreMadeModal}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Select Pre-Made Assessment</DialogTitle>
          <DialogDescription>
            Choose from our library of professionally designed assessment templates.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6">
            <Label htmlFor="pre-made-type">Assessment Type</Label>
            <Select 
              value={selectedPreMadeType} 
              onValueChange={setSelectedPreMadeType}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assessmentInfoData.map(assessment => (
                  <SelectItem key={assessment.id} value={assessment.id}>
                    {assessment.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {assessmentInfoData
              .filter(assessment => assessment.id === selectedPreMadeType)
              .map(assessment => (
                <AssessmentInfoCard
                  key={assessment.id}
                  id={assessment.id}
                  title={assessment.title}
                  description={assessment.description}
                  icon={assessment.icon}
                  color={assessment.color}
                  benefits={assessment.benefits}
                  useCases={assessment.useCases}
                  timeToComplete={assessment.timeToComplete}
                  onClick={handlePreMadeSelection}
                />
              ))}
          </div>
          
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium mb-4">Customize Template</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Assessment Name</Label>
                <Input 
                  id="template-name" 
                  placeholder="Enter a name for this assessment"
                  defaultValue={assessmentInfoData.find(a => a.id === selectedPreMadeType)?.title}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-due-date">Due Date</Label>
                <Input 
                  id="template-due-date" 
                  type="date"
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowPreMadeModal(false)}>Cancel</Button>
          <Button className="bg-green-600 hover:bg-green-700">
            Use This Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Assessment Results Modal Component
  const AssessmentResultsModal = () => {
    if (!selectedAssessment || !selectedAssessment.results) return null;
    
    const results = selectedAssessment.results;
    
    return (
      <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assessment Results: {selectedAssessment.employeeName}</DialogTitle>
            <DialogDescription>
              {selectedAssessment.type} completed on {selectedAssessment.dueDate}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Performance Scores</h4>
              <div className="space-y-3">
                {results.scores.map((score, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{score.category}</span>
                      <span className="font-medium">{score.score}% (Benchmark: {score.benchmark}%)</span>
                    </div>
                    <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full ${score.score >= score.benchmark ? 'bg-green-500' : 'bg-amber-500'}`} 
                        style={{ width: `${score.score}%` }}
                      />
                      <div 
                        className="absolute top-0 h-full border-r-2 border-gray-400" 
                        style={{ left: `${score.benchmark}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Strengths</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="text-sm">{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Development Areas</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {results.developmentAreas.map((area, index) => (
                    <li key={index} className="text-sm">{area}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Recommendations</h4>
              <ul className="list-disc pl-5 space-y-1">
                {results.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm">{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Assessment ID: {selectedAssessment.id}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowResultsModal(false)}>Close</Button>
              <Button 
                variant="outline" 
                className="border-amber-500 text-amber-600 hover:bg-amber-50"
                onClick={handleCreatePIP}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Create PIP
              </Button>
              <Button 
                variant="outline" 
                className="border-green-500 text-green-600 hover:bg-green-50"
                onClick={handleCreateIDP}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Generate IDP
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // IDP Modal Component
  const IDPModal = () => {
    if (!selectedAssessment) return null;
    
    return (
      <Dialog open={showIDPModal} onOpenChange={setShowIDPModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Individual Development Plan (IDP)</DialogTitle>
            <DialogDescription>
              For {selectedAssessment.employeeName} based on {selectedAssessment.type} assessment
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="plan">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="plan">Development Plan</TabsTrigger>
              <TabsTrigger value="courses">Recommended Courses</TabsTrigger>
              <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            </TabsList>
            
            <TabsContent value="plan" className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Strengths</h4>
                <div className="rounded-md border p-3 bg-gray-50">
                  {selectedAssessment.results?.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p className="text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Development Areas</h4>
                <div className="space-y-3">
                  {selectedAssessment.results?.developmentAreas.map((area, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`area-${index}`}>{area}</Label>
                      <Textarea 
                        id={`area-${index}`} 
                        placeholder="Add specific development actions..."
                        defaultValue={`Improve ${area.toLowerCase()} through targeted training and practice.`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Select defaultValue="3months">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">1 Month</SelectItem>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="review-date">Next Review Date</Label>
                  <Input type="date" defaultValue="2025-08-18" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="courses" className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Recommended Learning Resources</h4>
                  <Button variant="outline" size="sm">
                    Browse Course Catalogue
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {selectedAssessment.results?.recommendations.map((course, index) => (
                    <Card key={index}>
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{course}</CardTitle>
                          <Badge>Recommended</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-sm text-muted-foreground">
                          This course addresses development needs in {selectedAssessment.results?.developmentAreas[index % selectedAssessment.results?.developmentAreas.length]}.
                        </p>
                      </CardContent>
                      <CardFooter className="py-3 flex justify-between">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Duration:</span> 4-6 hours
                        </div>
                        <Button variant="outline" size="sm">Assign</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="progress" className="py-4">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3">Overall Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Status</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Development Areas Progress</h4>
                  <div className="space-y-4">
                    {selectedAssessment.results?.developmentAreas.map((area, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{area}</span>
                          <span className="font-medium">{[10, 30, 15][index % 3]}%</span>
                        </div>
                        <Progress value={[10, 30, 15][index % 3]} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Comments & Feedback</h4>
                  <div className="space-y-3">
                    <div className="rounded-md border p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Manager Comment</span>
                        <span className="text-xs text-muted-foreground">May 15, 2025</span>
                      </div>
                      <p className="text-sm">Good progress on the communication workshop. Please schedule the presentation skills course by next month.</p>
                    </div>
                    <Textarea placeholder="Add a comment or feedback..." />
                    <Button size="sm">Add Comment</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIDPModal(false)}>Cancel</Button>
            <Button>Save IDP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // PIP Modal Component
  const PIPModal = () => {
    if (!selectedAssessment) return null;
    
    return (
      <Dialog open={showPIPModal} onOpenChange={setShowPIPModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Performance Improvement Plan (PIP)</DialogTitle>
            <DialogDescription>
              For {selectedAssessment.employeeName} based on {selectedAssessment.type} assessment
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="issues">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="issues">Performance Issues</TabsTrigger>
              <TabsTrigger value="goals">Improvement Goals</TabsTrigger>
              <TabsTrigger value="timeline">Timeline & Milestones</TabsTrigger>
              <TabsTrigger value="support">Support Actions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="issues" className="space-y-4 py-4">
              <div className="space-y-3">
                <Label htmlFor="issue-description">Description of Performance Issues</Label>
                <Textarea 
                  id="issue-description" 
                  placeholder="Describe the specific performance issues..."
                  className="min-h-[150px]"
                  defaultValue={`Based on the ${selectedAssessment.type} assessment, the following performance issues have been identified:\n\n1. ${selectedAssessment.results?.developmentAreas[0]}\n2. ${selectedAssessment.results?.developmentAreas[1]}\n\nThese issues are impacting overall team performance and project delivery timelines.`}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="impact-description">Impact on Work Performance</Label>
                <Textarea 
                  id="impact-description" 
                  placeholder="Describe how these issues impact work performance..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="previous-feedback">Previous Feedback Provided</Label>
                <Textarea 
                  id="previous-feedback" 
                  placeholder="Summarize previous feedback provided..."
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="goals" className="py-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Specific Improvement Goals</Label>
                  {selectedAssessment.results?.developmentAreas.map((area, index) => (
                    <div key={index} className="rounded-md border p-3 space-y-2">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">Goal {index + 1}: Improve {area}</h4>
                        <Select defaultValue="critical">
                          <SelectTrigger className="w-[120px] h-7">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea 
                        placeholder={`Define specific, measurable goal for ${area}...`}
                        defaultValue={`Improve ${area.toLowerCase()} to meet department standards by achieving a score of at least 75% on the next assessment.`}
                      />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Current Level:</span>
                        <Progress value={65} className="h-2 w-20" />
                        <span>65%</span>
                        <span className="mx-2">→</span>
                        <span>Target:</span>
                        <Progress value={100} className="h-2 w-20 bg-gray-200" />
                        <span>75%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="success-criteria">Success Criteria</Label>
                  <Textarea 
                    id="success-criteria" 
                    placeholder="Define how success will be measured..."
                    className="min-h-[100px]"
                    defaultValue="Success will be measured through:\n1. Weekly manager observations\n2. Peer feedback\n3. Follow-up assessment scores\n4. Project delivery metrics"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="timeline" className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input type="date" id="start-date" defaultValue="2025-05-20" />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input type="date" id="end-date" defaultValue="2025-08-20" />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Review Milestones</h4>
                  <div className="space-y-3">
                    <div className="rounded-md border p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-medium">Initial Review</h5>
                        <Input type="date" className="w-auto" defaultValue="2025-06-03" />
                      </div>
                      <Textarea 
                        placeholder="Define expectations for this milestone..."
                        defaultValue="Initial progress check to ensure understanding of expectations and beginning of improvement."
                      />
                    </div>
                    <div className="rounded-md border p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-medium">Mid-point Review</h5>
                        <Input type="date" className="w-auto" defaultValue="2025-07-08" />
                      </div>
                      <Textarea 
                        placeholder="Define expectations for this milestone..."
                        defaultValue="Comprehensive review of progress. Should demonstrate significant improvement in key areas."
                      />
                    </div>
                    <div className="rounded-md border p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-medium">Final Evaluation</h5>
                        <Input type="date" className="w-auto" defaultValue="2025-08-19" />
                      </div>
                      <Textarea 
                        placeholder="Define expectations for this milestone..."
                        defaultValue="Final assessment to determine if performance has improved to required standards."
                      />
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      + Add Milestone
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="support" className="py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Assigned Courses & Training</h4>
                  <div className="space-y-3">
                    {selectedAssessment.results?.recommendations.map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="text-sm font-medium">{course}</p>
                          <p className="text-xs text-muted-foreground">Due: June 15, 2025</p>
                        </div>
                        <Badge variant="outline">Assigned</Badge>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      + Assign Additional Course
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="coaching-plan">Coaching & Mentoring Plan</Label>
                  <Textarea 
                    id="coaching-plan" 
                    placeholder="Describe coaching and mentoring support..."
                    className="min-h-[100px]"
                    defaultValue="Weekly 30-minute coaching sessions with direct manager.\nBi-weekly check-ins with assigned mentor from senior leadership team.\nAccess to external communication coach for targeted skill development."
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="resources-needed">Additional Resources Needed</Label>
                  <Textarea 
                    id="resources-needed" 
                    placeholder="List any additional resources required..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPIPModal(false)}>Cancel</Button>
            <Button>Save PIP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <PlatformLayout title="Assessment Center" currentView="manager">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Assessment Center</h1>
        <p className="text-muted-foreground">
          Create, manage, and track assessments for your team members.
        </p>
      </div>

      {/* Assessment Creation Options */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Assessment</h2>
        <AssessmentCreationOptions />
      </div>

      {/* Assessment Management Dashboard */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Assessment Management</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span>Send Reminders</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search by name or assessment type..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.keys(assessmentTypes).map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Assessments Table */}
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800 sticky top-0">
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Assessment Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">{assessment.employeeName}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1 underline decoration-dotted">
                            {assessment.type}
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <p className="text-sm">{assessmentTypes[assessment.type as keyof typeof assessmentTypes]}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                    <TableCell>{assessment.dueDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {assessment.status === "completed" ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewResults(assessment)}
                            className="flex items-center gap-1"
                          >
                            <BarChart className="h-3 w-3" />
                            View Results
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No assessments found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modals */}
      <CustomAssessmentModal />
      <AIAssessmentModal />
      <PreMadeAssessmentModal />
      <AssessmentResultsModal />
      <IDPModal />
      <PIPModal />
    </PlatformLayout>
  );
};

export default CustomAssessmentCenterPage;
