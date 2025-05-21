"use client";

import React, { useState } from "react";
import PlatformLayout from "@/components/platform/PlatformLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Users, TrendingUp, Target, UsersRound, Building, CheckCircle, Activity, BookMarked,
  Bell, Calendar, Clock, AlertCircle, ChevronRight, DollarSign, LineChart, PieChart, Award,
  Zap, BookOpen, UserCheck, BarChart2, ArrowUpRight, ArrowDownRight, Smile, ThumbsUp
} from 'lucide-react';
import Link from "next/link";

// Define interfaces for better type safety
interface DepartmentTeam {
  id: string;
  name: string;
  members: number;
  avgProficiency: number;
}

interface DepartmentDetail {
  id: string;
  name: string;
  averageProficiency: number;
  topSkills: string[];
  skillGaps: string[];
  teamMembers: number;
  teams: DepartmentTeam[];
}

interface TeamDetail {
  id: string;
  name: string;
  department: string;
  averageProficiency: number;
  topSkills: string[];
  skillGaps: string[];
  teamMembers: number;
}

interface OrganizationDepartment {
    id: string;
    name: string;
    members: number;
    avgProficiency: number;
    topLearners: LearnerData[]; // Assuming LearnerData is defined or will be
}

interface OrganizationData {
    name: string;
    totalEmployees: number;
    averageProficiency: number;
    overallLearningHours: number;
    topPerformingDepartment: string;
    departments: OrganizationDepartment[];
}

interface LearnerData {
    id: string;
    name: string;
    score: number;
    avatar?: string;
    departmentId: string;
    teamId: string;
}

interface PendingAssessment {
  id: string;
  employeeName: string;
  type: string;
  dueDate: string;
  status: string;
}

interface AnalyticsInsight {
  id: string;
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

interface BusinessOutcome {
  id: string;
  metric: string;
  before: number;
  after: number;
  unit: string;
  improvement: number;
}

// Mock Data
const organizationData: OrganizationData = {
  name: "SkillOS Inc.",
  totalEmployees: 500,
  averageProficiency: 70,
  overallLearningHours: 12500,
  topPerformingDepartment: "Engineering",
  departments: [
    { id: "dept1", name: "Engineering", members: 45, avgProficiency: 78, topLearners: [] },
    { id: "dept2", name: "Sales", members: 30, avgProficiency: 65, topLearners: [] },
    { id: "dept3", name: "Marketing", members: 25, avgProficiency: 72, topLearners: [] },
  ],
};

const departmentDetailsData: { [key: string]: DepartmentDetail } = {
  "dept1": {
    id: "dept1",
    name: "Engineering",
    averageProficiency: 78,
    topSkills: ["Software Development", "Cloud Computing", "Agile Methodologies"],
    skillGaps: ["AI/ML", "Cybersecurity"],
    teamMembers: 45,
    teams: [
      { id: "teamA", name: "Frontend Team", members: 10, avgProficiency: 82 },
      { id: "teamB", name: "Backend Team", members: 15, avgProficiency: 75 },
      { id: "teamC", name: "DevOps Team", members: 8, avgProficiency: 80 },
    ]
  },
  "dept2": {
    id: "dept2",
    name: "Sales",
    averageProficiency: 65,
    topSkills: ["Negotiation", "CRM Management", "Product Demo"],
    skillGaps: ["Data Analysis for Sales", "Consultative Selling"],
    teamMembers: 30,
    teams: [
      { id: "teamD", name: "Enterprise Sales", members: 10, avgProficiency: 70 },
      { id: "teamE", name: "SMB Sales", members: 12, avgProficiency: 60 },
    ]
  },
  "dept3": {
    id: "dept3",
    name: "Marketing",
    averageProficiency: 72,
    topSkills: ["Content Creation", "SEO/SEM", "Social Media Marketing"],
    skillGaps: ["Marketing Automation", "Video Marketing"],
    teamMembers: 25,
    teams: [
      { id: "teamF", name: "Content Creators", members: 8, avgProficiency: 75 },
      { id: "teamG", name: "Digital Ads", members: 7, avgProficiency: 70 },
    ]
  }
};

const teamDetailsData: { [key: string]: TeamDetail } = {
  "teamA": { id: "teamA", name: "Frontend Team", department: "Engineering", averageProficiency: 82, topSkills: ["React", "TypeScript", "Next.js"], skillGaps: ["GraphQL", "WebAssembly"], teamMembers: 10 },
  "teamB": { id: "teamB", name: "Backend Team", department: "Engineering", averageProficiency: 75, topSkills: ["Node.js", "Python", "Databases"], skillGaps: ["Microservices", "Serverless"], teamMembers: 15 },
  "teamC": { id: "teamC", name: "DevOps Team", department: "Engineering", averageProficiency: 80, topSkills: ["Docker", "Kubernetes", "CI/CD"], skillGaps: ["Infrastructure as Code"], teamMembers: 8 },
  "teamD": { id: "teamD", name: "Enterprise Sales", department: "Sales", averageProficiency: 70, topSkills: ["Solution Selling", "Account Management"], skillGaps: ["Strategic Partnerships"], teamMembers: 10 },
  "teamE": { id: "teamE", name: "SMB Sales", department: "Sales", averageProficiency: 60, topSkills: ["Lead Generation", "Closing Techniques"], skillGaps: ["Salesforce Advanced"], teamMembers: 12 },
  "teamF": { id: "teamF", name: "Content Creators", department: "Marketing", averageProficiency: 75, topSkills: ["Copywriting", "Video Editing"], skillGaps: ["Podcast Production"], teamMembers: 8 },
  "teamG": { id: "teamG", name: "Digital Ads", department: "Marketing", averageProficiency: 70, topSkills: ["Google Ads", "Facebook Ads"], skillGaps: ["Programmatic Advertising"], teamMembers: 7 },
};

const topLearnersData: LearnerData[] = [
  { id: "emp123", name: "Alex Johnson (Mock Profile)", score: 950, avatar: "AJ", departmentId: "dept1", teamId: "teamA" }, 
  { id: "learner2", name: "Lucy Van Pelt", score: 920, avatar: "LP", departmentId: "dept1", teamId: "teamB" },
  { id: "learner3", name: "Linus Van Pelt", score: 890, avatar: "LV", departmentId: "dept2", teamId: "teamD" },
  { id: "learner4", name: "Sally Brown", score: 850, avatar: "SB", departmentId: "dept3", teamId: "teamF" },
  { id: "learner5", name: "Schroeder", score: 820, avatar: "S", departmentId: "dept1", teamId: "teamC" },
  { id: "learner6", name: "Peppermint Patty", score: 790, avatar: "PP", departmentId: "dept2", teamId: "teamE" },
  { id: "learner7", name: "Marcie Carlin", score: 760, avatar: "MC", departmentId: "dept3", teamId: "teamG" },
  { id: "learner8", name: "Franklin Armstrong", score: 730, avatar: "FA", departmentId: "dept1", teamId: "teamA" },
  { id: "learner9", name: "Pig-Pen", score: 700, avatar: "PP", departmentId: "dept2", teamId: "teamD" },
  { id: "learner10", name: "Snoopy", score: 1000, avatar: "SN", departmentId: "dept1", teamId: "teamB" },
];

// Mock data for pending assessments
const pendingAssessments: PendingAssessment[] = [
  { id: "assess1", employeeName: "Sarah Miller", type: "360-Degree Feedback", dueDate: "May 25", status: "in-progress" },
  { id: "assess2", employeeName: "John Davis", type: "Technical Skills Test", dueDate: "May 28", status: "not-started" },
  { id: "assess4", employeeName: "Michael Brown", type: "Learning Retention Quiz", dueDate: "May 5", status: "overdue" },
  { id: "assess6", employeeName: "Ahmed Ali", type: "Skills Gap Analysis", dueDate: "May 22", status: "pending" },
];

// Mock data for analytics insights
const analyticsInsights: AnalyticsInsight[] = [
  { 
    id: "insight1", 
    title: "Course Completion Rate", 
    value: "78%", 
    change: 12, 
    icon: <BookOpen className="h-5 w-5 text-blue-500" />,
    trend: 'up'
  },
  { 
    id: "insight2", 
    title: "Active Learners", 
    value: "425", 
    change: 8, 
    icon: <UserCheck className="h-5 w-5 text-green-500" />,
    trend: 'up'
  },
  { 
    id: "insight3", 
    title: "Avg. Learning Time", 
    value: "3.2 hrs/week", 
    change: -5, 
    icon: <Clock className="h-5 w-5 text-amber-500" />,
    trend: 'down'
  }
];

// Mock data for business outcomes
const businessOutcomes: BusinessOutcome[] = [
  { id: "outcome1", metric: "Employee Retention", before: 82, after: 91, unit: "%", improvement: 11 },
  { id: "outcome2", metric: "Customer Satisfaction", before: 7.2, after: 8.5, unit: "NPS", improvement: 18 },
  { id: "outcome3", metric: "Time to Competency", before: 45, after: 32, unit: "days", improvement: 29 }
];

const TopLearnersList = ({ learners, title }: { learners: LearnerData[], title: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {learners.slice(0, 10).map((learner) => (
          <li key={learner.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold mr-3">
                {learner.avatar || learner.name.substring(0, 2).toUpperCase()}
              </span>
              {learner.id === "emp123" ? (
                <Link href="/platform/mock-employee-profile" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                  {learner.name}
                </Link>
              ) : (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{learner.name} (Profile N/A)</span>
              )}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{learner.score} pts</span>
          </li>
        ))}
      </ul>
      {learners.length === 0 && <p className="text-sm text-muted-foreground">No top learners to display for this selection.</p>}
    </CardContent>
  </Card>
);

// Component for Analytics Insights
const AnalyticsInsightCard = ({ insight }: { insight: AnalyticsInsight }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
      <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
        {insight.icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{insight.value}</div>
      <div className="flex items-center mt-1">
        {insight.trend === 'up' ? (
          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
        ) : insight.trend === 'down' ? (
          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500 mr-1" />
        )}
        <p className={`text-xs ${
          insight.trend === 'up' ? 'text-green-500' : 
          insight.trend === 'down' ? 'text-red-500' : 
          'text-gray-500'
        }`}>
          {insight.change > 0 ? '+' : ''}{insight.change}% from last month
        </p>
      </div>
    </CardContent>
  </Card>
);

// Component for Business Outcomes
const BusinessOutcomeCard = ({ outcome }: { outcome: BusinessOutcome }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{outcome.metric}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Before</span>
        <span className="text-sm font-medium">{outcome.before} {outcome.unit}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">After</span>
        <span className="text-sm font-medium">{outcome.after} {outcome.unit}</span>
      </div>
      <Progress value={outcome.improvement * 3} className="h-2" />
      <div className="flex justify-end">
        <Badge className="bg-green-500">+{outcome.improvement}% Improvement</Badge>
      </div>
    </CardContent>
  </Card>
);

// Component for Pending Assessments
const PendingAssessmentsCard = ({ assessments }: { assessments: PendingAssessment[] }) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg">Pending Assessments</CardTitle>
        <Badge className="bg-amber-500">{assessments.length} Pending</Badge>
      </div>
      <CardDescription>Assessments requiring your attention</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {assessments.map((assessment) => (
          <li key={assessment.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
            <div>
              <div className="flex items-center">
                <span className="text-sm font-medium">{assessment.employeeName}</span>
                {assessment.status === 'overdue' && (
                  <Badge className="ml-2 bg-red-500">Overdue</Badge>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {assessment.type} • Due: {assessment.dueDate}
              </div>
            </div>
            <Button variant="outline" size="sm">
              Review
            </Button>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full" asChild>
        <Link href="/platform/assessments/custom-center">
          View All Assessments
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

// Component for Engagement Overview
const EngagementOverviewCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Engagement Overview</CardTitle>
      <CardDescription>Team learning activity and participation</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Course Participation</span>
          <span className="text-sm font-medium">85%</span>
        </div>
        <Progress value={85} className="h-2" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Discussion Activity</span>
          <span className="text-sm font-medium">62%</span>
        </div>
        <Progress value={62} className="h-2" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Assessment Completion</span>
          <span className="text-sm font-medium">78%</span>
        </div>
        <Progress value={78} className="h-2" />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <Smile className="h-5 w-5 text-amber-500 mr-2" />
          <span className="text-sm font-medium">Team Satisfaction</span>
        </div>
        <div className="flex">
          {[1, 2, 3, 4].map((i) => (
            <ThumbsUp key={i} className="h-4 w-4 text-blue-500 ml-1" />
          ))}
          <ThumbsUp key={5} className="h-4 w-4 text-gray-300 ml-1" />
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full" asChild>
        <Link href="/platform/engagement">
          View Engagement Planner
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

const DashboardPage = () => {
  
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDetail>(departmentDetailsData["dept1"]);
  const [selectedTeam, setSelectedTeam] = useState<TeamDetail>(teamDetailsData["teamA"]);

  const handleDepartmentChange = (departmentId: string) => {
    const newSelectedDepartment = departmentDetailsData[departmentId] || departmentDetailsData["dept1"];
    setSelectedDepartment(newSelectedDepartment);
    const firstTeamOfNewDepartment = newSelectedDepartment.teams?.[0]?.id || Object.keys(teamDetailsData)[0];
    setSelectedTeam(teamDetailsData[firstTeamOfNewDepartment] || teamDetailsData["teamA"]);
  };

  const handleTeamChange = (teamId: string) => {
    setSelectedTeam(teamDetailsData[teamId] || teamDetailsData["teamA"]);
  };

  return (
    <PlatformLayout title="SkillOS Dashboard" currentView="manager">
      {/* Homepage Overview */}
      <div className="space-y-6 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to SkillOS</h2>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium">4 pending tasks</span>
          </div>
        </div>
        
        {/* Analytics Insights */}
        <div>
          <h3 className="text-lg font-medium mb-3">Analytics Insights</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {analyticsInsights.map(insight => (
              <AnalyticsInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* ROI Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">ROI of Learning</CardTitle>
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <CardDescription>Business impact of learning initiatives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall ROI</span>
                <Badge className="bg-green-500">240%</Badge>
              </div>
              <div className="grid gap-3">
                {businessOutcomes.map(outcome => (
                  <div key={outcome.id} className="flex justify-between items-center">
                    <span className="text-sm">{outcome.metric}</span>
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      +{outcome.improvement}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/platform/roi-of-learning">
                  View Full ROI Dashboard
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Engagement Overview */}
          <EngagementOverviewCard />

          {/* Pending Assessments */}
          <PendingAssessmentsCard assessments={pendingAssessments} />
        </div>

        {/* Top Department and Learners */}
        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Top Department</CardTitle>
                <Badge>Engineering</Badge>
              </div>
              <CardDescription>Highest performing department this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Proficiency</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Course Completion</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Engagement Score</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/platform/dashboard?tab=department">
                  View Department Details
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="md:col-span-4">
            <TopLearnersList learners={topLearnersData} title="Top 10 Learners" />
          </div>
        </div>
      </div>

      {/* Original Dashboard Tabs */}
      <Tabs defaultValue="organization" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="department">Department</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="competency">Competency Mgt</TabsTrigger>
        </TabsList>

        {/* Organization View Tab */}
        <TabsContent value="organization" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organizationData.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">All active employees</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Proficiency</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organizationData.averageProficiency}%</div>
                <p className="text-xs text-muted-foreground">Across all skills</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Learning Hours</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organizationData.overallLearningHours.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Logged this year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Department</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organizationData.topPerformingDepartment}</div>
                <p className="text-xs text-muted-foreground">By engagement & proficiency</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Department Overview</CardTitle>
                  <CardDescription>Proficiency and engagement across departments.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[350px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                    <BarChart className="h-16 w-16 text-gray-400" />
                    <p className="ml-2 text-gray-500">Department Proficiency Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <TopLearnersList learners={topLearnersData} title="Top 10 Learners (Organization-Wide)" />
            </div>
          </div>
        </TabsContent>

        {/* Department View Tab */}
        <TabsContent value="department" className="space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="department-select" className="text-sm font-medium">Select Department:</label>
            <select 
              id="department-select"
              value={selectedDepartment.id}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="block w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {organizationData.departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Department: {selectedDepartment.name}</CardTitle>
              <CardDescription>Detailed view of the {selectedDepartment.name} department.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                    <UsersRound className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedDepartment.teamMembers}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Proficiency</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedDepartment.averageProficiency}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      {selectedDepartment.topSkills?.map((skill: string) => <li key={skill}>{skill}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <TopLearnersList learners={topLearnersData.filter(l => l.departmentId === selectedDepartment.id)} title={`Top Learners in ${selectedDepartment.name}`} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team View Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="team-department-select" className="text-sm font-medium">Select Department:</label>
            <select 
              id="team-department-select"
              value={selectedDepartment.id} 
              onChange={(e) => handleDepartmentChange(e.target.value)} 
              className="block w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {organizationData.departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            
            <label htmlFor="team-select" className="text-sm font-medium ml-4">Select Team:</label>
            <select 
              id="team-select"
              value={selectedTeam.id}
              onChange={(e) => handleTeamChange(e.target.value)}
              className="block w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {selectedDepartment.teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Team: {selectedTeam.name}</CardTitle>
              <CardDescription>Detailed view of the {selectedTeam.name} team in {selectedTeam.department}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                    <UsersRound className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedTeam.teamMembers}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Proficiency</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedTeam.averageProficiency}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      {selectedTeam.topSkills?.map((skill: string) => <li key={skill}>{skill}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <TopLearnersList learners={topLearnersData.filter(l => l.teamId === selectedTeam.id)} title={`Top Learners in ${selectedTeam.name}`} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competency Management Tab */}
        <TabsContent value="competency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competency Management</CardTitle>
              <CardDescription>
                Define, track, and manage competencies across your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookMarked className="h-16 w-16 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">Competency Management</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  This feature allows you to define skill frameworks, track competency levels, and manage skill development across your organization.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/platform/competency-management">
                    Go to Competency Management
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PlatformLayout>
  );
};

export default DashboardPage;
