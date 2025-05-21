"use client";

import React, { useState } from 'react';
import PlatformLayout from "@/components/platform/PlatformLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Bell, Send, Award, Calendar, Download, CheckCircle, AlertCircle, 
  User, Users, Clock, FileText, MessageSquare, Flag, Target, 
  Zap, Settings, ChevronRight, Plus, Edit, Trash2, Copy, 
  ArrowRight, Star, UserPlus, MessageCircle, Bookmark, 
  Lightbulb, Sparkles, UserCheck, Rocket, Trophy, Mail, X
} from "lucide-react";

const EngagementPlannerPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("smart-nudges");
  
  // State for dialogs
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showChallengeDialog, setShowChallengeDialog] = useState(false);
  const [showRecognitionDialog, setShowRecognitionDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  
  // State for settings
  const [settings, setSettings] = useState({
    nudgeFrequency: "weekly",
    challengeOptIn: true,
    autoRecognition: true,
    slackIntegration: true,
    emailIntegration: true,
    teamsIntegration: false
  });
  
  // Mock data for smart nudges
  const smartNudges = [
    {
      id: "nudge1",
      type: "inactivity",
      message: "3 team members inactive for 2+ weeks",
      action: "Send Nudge",
      priority: "high",
      users: ["Alex Johnson", "Maria Garcia", "David Kim"]
    },
    {
      id: "nudge2",
      type: "completion",
      message: "Sara completed Conflict Management",
      action: "Endorse Application",
      priority: "medium",
      users: ["Sara Wilson"]
    },
    {
      id: "nudge3",
      type: "dropout",
      message: "Omar dropped off a course",
      action: "Follow Up",
      priority: "medium",
      users: ["Omar Hassan"]
    },
    {
      id: "nudge4",
      type: "milestone",
      message: "Team reached 80% completion on Technical Skills",
      action: "Recognize Achievement",
      priority: "low",
      users: ["Frontend Team"]
    },
    {
      id: "nudge5",
      type: "recommendation",
      message: "5 team members might benefit from Leadership course",
      action: "Review Suggestion",
      priority: "medium",
      users: ["New Managers Group"]
    }
  ];
  
  // Mock data for quick actions
  const quickActions = [
    {
      id: "action1",
      title: "Set Learning Goals",
      description: "Establish clear objectives for your team",
      icon: <Target className="h-5 w-5 text-blue-500" />,
      action: "Assign Goal",
      color: "blue"
    },
    {
      id: "action2",
      title: "Schedule 1:1 Review",
      description: "Plan individual learning progress discussions",
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      action: "Download Summary PDF",
      color: "purple"
    },
    {
      id: "action3",
      title: "Recommend Path",
      description: "AI-based learning path suggestions",
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      action: "Get Suggestions",
      color: "amber"
    },
    {
      id: "action4",
      title: "Monthly Recognition Setup",
      description: "Automatically highlight top performers",
      icon: <Trophy className="h-5 w-5 text-green-500" />,
      action: "Auto Highlight Top Learner",
      color: "green"
    }
  ];
  
  // Mock data for recognition tools
  const recognitionTools = [
    {
      id: "recognition1",
      title: "Endorse Skill Application",
      description: "Acknowledge when skills are applied in real work",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      action: "Tag skill + context"
    },
    {
      id: "recognition2",
      title: "Send Shout-Out",
      description: "Publicly recognize achievements in team channels",
      icon: <MessageCircle className="h-5 w-5 text-blue-500" />,
      action: "Slack/MS Teams message"
    },
    {
      id: "recognition3",
      title: "Issue Badge",
      description: "Award digital badges for accomplishments",
      icon: <Award className="h-5 w-5 text-amber-500" />,
      action: "Track-based or peer-nominated"
    },
    {
      id: "recognition4",
      title: "View Recognition History",
      description: "See all past recognition activities",
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      action: "Timeline by person"
    }
  ];
  
  // Mock data for challenges
  const challenges = [
    {
      id: "challenge1",
      title: "Complete a Data course this month",
      type: "Team Challenge",
      participants: 12,
      progress: 65,
      deadline: "May 30, 2025"
    },
    {
      id: "challenge2",
      title: "Apply a new skill in your daily work",
      type: "Micro-Mission",
      participants: 8,
      progress: 50,
      deadline: "May 25, 2025"
    },
    {
      id: "challenge3",
      title: "Share one learning insight weekly",
      type: "Team Challenge",
      participants: 15,
      progress: 80,
      deadline: "Ongoing"
    },
    {
      id: "challenge4",
      title: "Mentor a colleague for 15 minutes",
      type: "Micro-Mission",
      participants: 5,
      progress: 40,
      deadline: "May 28, 2025"
    }
  ];
  
  // Mock data for templates
  const templates = [
    {
      id: "template1",
      title: "Learning Kickoff Email",
      description: "Introduce a new learning initiative to your team",
      type: "email",
      content: `Subject: Exciting New Learning Opportunity: [Course/Program Name]

Dear [Team Member],

I'm excited to announce a new learning opportunity that I believe will be valuable for your professional development: [Course/Program Name].

This [duration] program will help you develop skills in [key skills], which aligns with both your career goals and our team's objectives for this quarter.

Key benefits include:
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

The program starts on [Start Date]. Please complete it by [End Date].

I'd love to discuss how you can apply these new skills to your current projects during our next 1:1.

Best regards,
[Your Name]`
    },
    {
      id: "template2",
      title: "1:1 Discussion Guide",
      description: "Structure for learning-focused 1:1 meetings",
      type: "document",
      content: `# Learning-Focused 1:1 Discussion Guide

## Recent Learning Review (10 min)
- What courses/modules have you completed since our last meeting?
- What were your key takeaways?
- How have you applied or plan to apply what you've learned?

## Challenges & Support (10 min)
- What obstacles are you facing in your learning journey?
- What resources or support would help you overcome these challenges?
- Are there specific skills you'd like more guidance on?

## Goals & Next Steps (10 min)
- Progress on current learning goals
- Adjustments needed to learning plan
- Specific commitments before next meeting

## Action Items
- [Manager] Action items:
  - 
  - 
- [Team Member] Action items:
  - 
  - 

Next meeting date: __________`
    },
    {
      id: "template3",
      title: "Recognition Message",
      description: "Template for acknowledging learning achievements",
      type: "message",
      content: `@[Team Member Name] I wanted to recognize your outstanding commitment to professional development! 

Your recent completion of [Course/Program] and how you've already applied [Specific Skill] to [Specific Project/Task] has made a real impact on [Specific Outcome].

This is exactly the kind of growth mindset and skill application we value on our team. Thank you for your dedication to continuous improvement!

#TeamLearning #SkillsInAction`
    },
    {
      id: "template4",
      title: "Team Learning Plan",
      description: "Quarterly learning strategy for your team",
      type: "document",
      content: `# Quarterly Team Learning Plan

## Team: [Team Name]
## Quarter: [Q1/Q2/Q3/Q4] [Year]

### Focus Areas
1. [Skill Area 1]
2. [Skill Area 2]
3. [Skill Area 3]

### Learning Objectives
By the end of this quarter, our team will:
- [Objective 1]
- [Objective 2]
- [Objective 3]

### Recommended Learning Paths
| Team Member | Primary Focus | Recommended Courses | Deadline |
|-------------|---------------|---------------------|----------|
| [Name]      | [Focus]       | [Courses]           | [Date]   |
| [Name]      | [Focus]       | [Courses]           | [Date]   |

### Application Opportunities
- [Project/Task where skills can be applied]
- [Project/Task where skills can be applied]

### Success Metrics
- [Metric 1]
- [Metric 2]
- [Metric 3]

### Check-in Schedule
- Mid-quarter review: [Date]
- End-quarter celebration: [Date]`
    }
  ];
  
  // Handle template selection
  const handleTemplateSelect = (template: any) => {
    setCurrentTemplate(template);
    setShowTemplateDialog(true);
  };
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: any) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };
  
  // Get priority badge color
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <PlatformLayout title="Engagement Planner">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Engagement Planner</h1>
            <p className="text-muted-foreground">
              Tools to boost learning engagement and application
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="smart-nudges" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Smart Nudges</span>
              <span className="inline sm:hidden">Nudges</span>
            </TabsTrigger>
            <TabsTrigger value="quick-actions" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Quick Actions</span>
              <span className="inline sm:hidden">Actions</span>
            </TabsTrigger>
            <TabsTrigger value="recognition" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Recognition</span>
              <span className="inline sm:hidden">Recognize</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-1">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">Challenges</span>
              <span className="inline sm:hidden">Challenge</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
              <span className="inline sm:hidden">Template</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
              <span className="inline sm:hidden">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Smart Nudges Tab */}
          <TabsContent value="smart-nudges" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Smart Nudges</h2>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="inactivity">Inactivity</SelectItem>
                    <SelectItem value="completion">Completion</SelectItem>
                    <SelectItem value="dropout">Dropout</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="recommendation">Recommendation</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            
            <p className="text-muted-foreground">
              Dynamic suggestions based on team activity and learning patterns
            </p>
            
            <div className="space-y-4">
              {smartNudges.map((nudge) => (
                <Card key={nudge.id} className="overflow-hidden">
                  <div className={`h-1 w-full ${
                    nudge.priority === "high" ? "bg-red-500" : 
                    nudge.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                  }`}></div>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            nudge.type === "inactivity" ? "bg-red-100 text-red-600" : 
                            nudge.type === "completion" ? "bg-green-100 text-green-600" : 
                            nudge.type === "dropout" ? "bg-amber-100 text-amber-600" : 
                            nudge.type === "milestone" ? "bg-blue-100 text-blue-600" : 
                            "bg-purple-100 text-purple-600"
                          }`}>
                            {nudge.type === "inactivity" ? <AlertCircle className="h-5 w-5" /> : 
                             nudge.type === "completion" ? <CheckCircle className="h-5 w-5" /> : 
                             nudge.type === "dropout" ? <User className="h-5 w-5" /> : 
                             nudge.type === "milestone" ? <Flag className="h-5 w-5" /> : 
                             <Lightbulb className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{nudge.message}</h3>
                              {getPriorityBadge(nudge.priority)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {nudge.users.join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button size="sm" className="whitespace-nowrap">
                          {nudge.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Quick Actions Tab */}
          <TabsContent value="quick-actions" className="space-y-6">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <p className="text-muted-foreground">
              Streamlined tools to boost team engagement and learning
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Card key={action.id} className="overflow-hidden">
                  <CardHeader className={`bg-${action.color}-50 dark:bg-${action.color}-900/20 pb-3`}>
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-full bg-${action.color}-100 text-${action.color}-600`}>
                        {action.icon}
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3 pb-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      {action.description}
                    </p>
                    <Button 
                      className={`w-full bg-${action.color}-600 hover:bg-${action.color}-700`}
                    >
                      {action.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Recognition Tools Tab */}
          <TabsContent value="recognition" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recognition Tools</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowRecognitionDialog(true)}
              >
                <Award className="h-4 w-4 mr-2" />
                Recognition History
              </Button>
            </div>
            <p className="text-muted-foreground">
              Acknowledge and celebrate learning achievements and skill application
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recognitionTools.map((tool) => (
                <Card key={tool.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                        {tool.icon}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-lg">{tool.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-4">
                          {tool.description}
                        </p>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {tool.action}
                          </Badge>
                          <Button size="sm">Use Tool</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Challenges & Micro-Missions</h2>
              <Button 
                onClick={() => setShowChallengeDialog(true)}
                variant="outline" 
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Challenge
              </Button>
            </div>
            <p className="text-muted-foreground">
              Engaging activities to motivate learning and skill application
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge variant="outline">{challenge.type}</Badge>
                      <Badge>{challenge.participants} participants</Badge>
                    </div>
                    <CardTitle className="mt-2">{challenge.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{challenge.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${challenge.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Deadline: {challenge.deadline}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex justify-between w-full">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        Send Reminder
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Communication Templates</h2>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
            <p className="text-muted-foreground">
              Ready-to-use templates for learning communications
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className="overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge variant="outline">
                        {template.type === "email" ? "Email Template" : 
                         template.type === "message" ? "Message Template" : 
                         "Document Template"}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md max-h-24 overflow-hidden text-sm text-muted-foreground">
                      {template.content.substring(0, 150)}...
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex justify-between w-full">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button size="sm">
                        Use Template
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-semibold">Engagement Settings</h2>
            <p className="text-muted-foreground">
              Configure your engagement tools and preferences
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how and when you receive engagement notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="nudge-frequency" className="text-base">Nudge Frequency</Label>
                      <p className="text-sm text-muted-foreground">
                        How often you want to receive smart nudges
                      </p>
                    </div>
                    <Select 
                      value={settings.nudgeFrequency} 
                      onValueChange={(value) => handleSettingChange("nudgeFrequency", value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="challenge-opt-in" className="text-base">Challenge Opt-In</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow team members to join challenges
                      </p>
                    </div>
                    <Switch 
                      id="challenge-opt-in" 
                      checked={settings.challengeOptIn}
                      onCheckedChange={(checked) => handleSettingChange("challengeOptIn", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-recognition" className="text-base">Automatic Recognition</Label>
                      <p className="text-sm text-muted-foreground">
                        Suggest recognition for major achievements
                      </p>
                    </div>
                    <Switch 
                      id="auto-recognition" 
                      checked={settings.autoRecognition}
                      onCheckedChange={(checked) => handleSettingChange("autoRecognition", checked)}
                    />
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Integration Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                        <div>
                          <Label className="text-base">Slack Integration</Label>
                          <p className="text-sm text-muted-foreground">
                            Send recognition and nudges to Slack
                          </p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.slackIntegration}
                        onCheckedChange={(checked) => handleSettingChange("slackIntegration", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-red-500" />
                        <div>
                          <Label className="text-base">Email Integration</Label>
                          <p className="text-sm text-muted-foreground">
                            Send templates and summaries via email
                          </p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.emailIntegration}
                        onCheckedChange={(checked) => handleSettingChange("emailIntegration", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        <div>
                          <Label className="text-base">MS Teams Integration</Label>
                          <p className="text-sm text-muted-foreground">
                            Send recognition and nudges to MS Teams
                          </p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.teamsIntegration}
                        onCheckedChange={(checked) => handleSettingChange("teamsIntegration", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl">
          {currentTemplate && (
            <>
              <DialogHeader>
                <DialogTitle>{currentTemplate.title}</DialogTitle>
                <DialogDescription>{currentTemplate.description}</DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">
                    {currentTemplate.content}
                  </pre>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {currentTemplate.type === "email" ? "Email Template" : 
                     currentTemplate.type === "message" ? "Message Template" : 
                     "Document Template"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Editable and ready to use
                  </span>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="slack">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="teams">MS Teams</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Use Template</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Challenge Creation Dialog */}
      <Dialog open={showChallengeDialog} onOpenChange={setShowChallengeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Challenge</DialogTitle>
            <DialogDescription>
              Design an engaging challenge for your team
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="challenge-type">Challenge Type</Label>
              <Select defaultValue="team">
                <SelectTrigger id="challenge-type">
                  <SelectValue placeholder="Select challenge type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Team Challenge</SelectItem>
                  <SelectItem value="micro">Micro-Mission</SelectItem>
                  <SelectItem value="individual">Individual Challenge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="challenge-title">Challenge Title</Label>
              <Input id="challenge-title" placeholder="E.g., Complete a Data course this month" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="challenge-description">Description</Label>
              <Textarea 
                id="challenge-description" 
                placeholder="Describe the challenge and its benefits"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="participants">Participants</Label>
              <Select defaultValue="all">
                <SelectTrigger id="participants">
                  <SelectValue placeholder="Select participants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  <SelectItem value="developers">Development Team</SelectItem>
                  <SelectItem value="marketing">Marketing Team</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reward">Reward (Optional)</Label>
              <Input id="reward" placeholder="E.g., Digital badge, Recognition in team meeting" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChallengeDialog(false)}>Cancel</Button>
            <Button>Create Challenge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Recognition History Dialog */}
      <Dialog open={showRecognitionDialog} onOpenChange={setShowRecognitionDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Recognition History</DialogTitle>
            <DialogDescription>
              Timeline of all recognition activities
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Recent Recognition</h3>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="skill">Skill Endorsement</SelectItem>
                    <SelectItem value="shoutout">Shout-Out</SelectItem>
                    <SelectItem value="badge">Badge Award</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                {/* Recognition Timeline Items */}
                <div className="relative pl-6 pb-6 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-2 top-0">
                    <div className="bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-md border shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2">Skill Endorsement</Badge>
                        <h4 className="font-medium">Data Analysis Skills</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Sarah Wilson was endorsed for applying data analysis skills in the Q1 report
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">Today</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <UserCheck className="h-4 w-4 text-blue-500" />
                      <span>Endorsed by: Alex Johnson</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative pl-6 pb-6 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-2 top-0">
                    <div className="bg-blue-500 rounded-full p-1">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-md border shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2">Shout-Out</Badge>
                        <h4 className="font-medium">Project Completion</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Team shout-out for completing the customer portal redesign ahead of schedule
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">Yesterday</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>Sent to: Frontend Development Team</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative pl-6 pb-6 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-2 top-0">
                    <div className="bg-amber-500 rounded-full p-1">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-md border shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2">Badge Award</Badge>
                        <h4 className="font-medium">Learning Champion</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Omar Hassan earned the Learning Champion badge for completing 10 courses
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">May 15, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <span>Automatically awarded based on achievements</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline">
                  View More History
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PlatformLayout>
  );
};

export default EngagementPlannerPage;
