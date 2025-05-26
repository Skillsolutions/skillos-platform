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
  Lightbulb, Sparkles, UserCheck, Rocket, Trophy, Mail, X,
  Megaphone, Globe, UserCircle, Building, Layers, Filter
} from "lucide-react";
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define types for audience selection
interface AudienceMember {
  id: string;
  name: string;
  department?: string;
  role?: string;
}

interface Team {
  id: string;
  name: string;
  department: string;
  members: number;
}

interface Department {
  id: string;
  name: string;
  members: number;
}

interface CampaignAudience {
  type: string;
  specific: (AudienceMember | Team | Department)[];
}

interface CampaignData {
  title: string;
  description: string;
  type: string;
  template: string;
  startDate: Date;
  endDate: Date;
  audience: CampaignAudience;
  content: any[];
  rewards: {
    points: number;
    badges: boolean;
    certificates: boolean;
  };
}

interface Template {
  id: string;
  title: string;
  description: string;
  type: string;
  content: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  audience: {
    type: string;
    count: number;
  };
  progress: number;
  courses: number;
}

interface CampaignTemplate {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  courses: string[];
  image: string;
}

const EngagementPlannerPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("smart-nudges");
  
  // State for dialogs
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showChallengeDialog, setShowChallengeDialog] = useState(false);
  const [showRecognitionDialog, setShowRecognitionDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showAudienceDialog, setShowAudienceDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  
  // State for campaign creation
  const [campaignStep, setCampaignStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    title: '',
    description: '',
    type: '',
    template: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    audience: {
      type: 'all',
      specific: []
    },
    content: [],
    rewards: {
      points: 100,
      badges: true,
      certificates: true
    }
  });
  
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
  const templates: Template[] = [
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
  
  // Mock data for campaigns
  const campaigns: Campaign[] = [
    {
      id: "campaign1",
      title: "New Year Learning Resolutions",
      description: "Start the year with new skills and knowledge",
      type: "seasonal",
      startDate: "Jan 1, 2025",
      endDate: "Jan 31, 2025",
      status: "scheduled",
      audience: {
        type: "all",
        count: 250
      },
      progress: 0,
      courses: 5
    },
    {
      id: "campaign2",
      title: "Women in Leadership",
      description: "Special learning path for Women's Day",
      type: "special",
      startDate: "Mar 1, 2025",
      endDate: "Mar 31, 2025",
      status: "draft",
      audience: {
        type: "custom",
        count: 85
      },
      progress: 0,
      courses: 3
    },
    {
      id: "campaign3",
      title: "Ramadan Reflection & Growth",
      description: "Personal development during Ramadan",
      type: "seasonal",
      startDate: "Mar 10, 2025",
      endDate: "Apr 9, 2025",
      status: "draft",
      audience: {
        type: "custom",
        count: 120
      },
      progress: 0,
      courses: 4
    },
    {
      id: "campaign4",
      title: "Q3 Learning Sprint",
      description: "Accelerated skill development for Q3 objectives",
      type: "quarterly",
      startDate: "Jul 1, 2025",
      endDate: "Sep 30, 2025",
      status: "draft",
      audience: {
        type: "department",
        count: 45
      },
      progress: 0,
      courses: 8
    },
    {
      id: "campaign5",
      title: "Technical Skills Bootcamp",
      description: "Intensive technical upskilling program",
      type: "skills",
      startDate: "Jun 1, 2025",
      endDate: "Jul 15, 2025",
      status: "active",
      audience: {
        type: "team",
        count: 18
      },
      progress: 35,
      courses: 6
    }
  ];
  
  // Mock data for campaign templates
  const campaignTemplates: CampaignTemplate[] = [
    {
      id: "campaignTemplate1",
      title: "New Year Learning Resolutions",
      description: "Start the year with new skills and knowledge",
      type: "seasonal",
      duration: 30,
      courses: ["Goal Setting Mastery", "Productivity Fundamentals", "Growth Mindset"],
      image: "/images/campaigns/new-year.jpg"
    },
    {
      id: "campaignTemplate2",
      title: "Women in Leadership",
      description: "Special learning path for Women's Day",
      type: "special",
      duration: 30,
      courses: ["Women in Leadership", "Effective Communication", "Strategic Thinking"],
      image: "/images/campaigns/womens-day.jpg"
    },
    {
      id: "campaignTemplate3",
      title: "Ramadan Reflection & Growth",
      description: "Personal development during Ramadan",
      type: "seasonal",
      duration: 30,
      courses: ["Mindfulness Basics", "Work-Life Balance", "Personal Reflection"],
      image: "/images/campaigns/ramadan.jpg"
    },
    {
      id: "campaignTemplate4",
      title: "Q3 Learning Sprint",
      description: "Accelerated skill development for Q3 objectives",
      type: "quarterly",
      duration: 90,
      courses: ["Strategic Planning", "Project Management", "Data Analysis", "Presentation Skills"],
      image: "/images/campaigns/q3.jpg"
    }
  ];
  
  // Mock data for audience selection
  const audienceOptions = {
    individuals: [
      { id: "user1", name: "Alex Johnson", department: "Engineering", role: "Developer" },
      { id: "user2", name: "Maria Garcia", department: "Marketing", role: "Content Strategist" },
      { id: "user3", name: "David Kim", department: "Sales", role: "Account Executive" },
      { id: "user4", name: "Sara Wilson", department: "Engineering", role: "Product Manager" },
      { id: "user5", name: "Omar Hassan", department: "Finance", role: "Financial Analyst" }
    ] as AudienceMember[],
    teams: [
      { id: "team1", name: "Frontend Team", department: "Engineering", members: 8 },
      { id: "team2", name: "Content Team", department: "Marketing", members: 6 },
      { id: "team3", name: "Enterprise Sales", department: "Sales", members: 12 },
      { id: "team4", name: "Mobile Development", department: "Engineering", members: 5 },
      { id: "team5", name: "Financial Planning", department: "Finance", members: 7 }
    ] as Team[],
    departments: [
  
(Content truncated due to size limit. Use line ranges to read in chunks)