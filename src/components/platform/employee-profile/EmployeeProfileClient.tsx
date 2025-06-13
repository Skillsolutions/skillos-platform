"use client";

import React, { useState, useEffect } from 'react';
import PlatformLayout from "@/components/platform/PlatformLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Briefcase, Target, Star, BookOpen, TrendingUp, CheckCircle, Award, Brain, Lightbulb } from 'lucide-react';

// This component will receive employee data as a prop
interface EmployeeProfileClientProps {
  employeeData: {
    id: string;
    name: string;
    role: string;
    employeeId: string;
    avatarUrl?: string;
    skills: Array<{
      skillName: string;
      proficiency: number;
    }>;
    competencies: Array<{
      competencyId: string;
      competencyName: string;
      type: string;
      assessmentResults: Array<{
        assessmentName: string;
        score: number;
        date: string;
        improvement?: number;
      }>;
    }>;
    currentEnrollments: Array<{
      courseId: string;
      courseName: string;
      provider: string;
      status: string;
      dueDate?: string;
      progress: number;
    }>;
    completedCourses: Array<{
      courseId: string;
      courseName: string;
      dateCompleted: string;
    }>;
    learningMetrics: {
      totalCoursesCompleted: number;
      totalLearningHours: number;
      averageAssessmentScoreImprovement: number;
      badgesEarned: number;
    };
    performanceMetrics: {
      overallPerformanceRating: string;
      lastReviewDate: string;
      keyAchievements: string[];
    };
    strengths: string[];
    areasForDevelopment: string[];
    recommendedCourses: Array<{
      courseId: string;
      courseName: string;
      provider: string;
      reasonForRecommendation: string;
    }>;
  };
  employeeId: string;
}

const EmployeeProfileClient: React.FC<EmployeeProfileClientProps> = ({ employeeData, employeeId }) => {
  const [employee, setEmployee] = useState(employeeData);

  useEffect(() => {
    setEmployee(employeeData);
  }, [employeeData]);

  if (!employee || employee.id === "default" || employee.id !== employeeId) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Employee Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The profile for the specified employee ID could not be found.</p>
            </CardContent>
          </Card>
        </div>
      </PlatformLayout>
    );
  }

  const radarChartData = employee.skills.map((skill: { skillName: string; proficiency: number; }) => ({
    subject: skill.skillName,
    A: skill.proficiency,
    fullMark: 100,
  }));

  return (
    <PlatformLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-center space-x-0 md:space-x-6">
            <Avatar className="h-24 w-24 mb-4 md:mb-0">
              <AvatarImage src={employee.avatarUrl || `https://ui-avatars.com/api/?name=${employee.name.replace(" ", "+")}&background=random`} alt={employee.name} />
              <AvatarFallback>{employee.name.split(" ").map((n:string)=>n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <CardTitle className="text-3xl">{employee.name}</CardTitle>
              <CardDescription className="text-lg">{employee.role} (ID: {employee.employeeId})</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column / Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Brain className="mr-2 h-5 w-5" />Skills Overview</CardTitle>
              </CardHeader>
              <CardContent style={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name={employee.name} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Competencies & Assessments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Award className="mr-2 h-5 w-5" />Competencies & Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                {employee.competencies.map((comp: {
                  competencyId: string;
                  competencyName: string;
                  type: string;
                  assessmentResults: Array<{
                    assessmentName: string;
                    score: number;
                    date: string;
                    improvement?: number;
                  }>;
                }) => (
                  <div key={comp.competencyId} className="mb-4 p-3 border rounded-md">
                    <h4 className="font-semibold text-md mb-1">{comp.competencyName} <Badge variant="outline">{comp.type}</Badge></h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assessment</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Improvement</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {comp.assessmentResults.map((res: {
                          assessmentName: string;
                          score: number;
                          date: string;
                          improvement?: number;
                        }, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell>{res.assessmentName}</TableCell>
                            <TableCell>{res.score}</TableCell>
                            <TableCell>{res.date}</TableCell>
                            <TableCell>{res.improvement ? `${res.improvement}%` : "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Current Enrollments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5" />Current Learning Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                {employee.currentEnrollments.map((enrollment: {
                  courseId: string;
                  courseName: string;
                  provider: string;
                  status: string;
                  dueDate?: string;
                  progress: number;
                }) => (
                  <div key={enrollment.courseId} className="mb-3 p-3 border rounded-md">
                    <h4 className="font-semibold">{enrollment.courseName} <Badge variant="secondary">{enrollment.provider}</Badge></h4>
                    <p className="text-sm text-muted-foreground">Status: {enrollment.status} - Due: {enrollment.dueDate || "N/A"}</p>
                    <Progress value={enrollment.progress} className="mt-1 h-2" />
                  </div>
                ))}
                 {employee.currentEnrollments.length === 0 && <p className="text-muted-foreground">No current enrollments.</p>}
              </CardContent>
            </Card>
             {/* Completed Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><CheckCircle className="mr-2 h-5 w-5" />Completed Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                {employee.completedCourses.map((course: {
                  courseId: string;
                  courseName: string;
                  dateCompleted: string;
                }) => (
                    <li key={course.courseId} className="text-sm">
                        {course.courseName} (Completed: {course.dateCompleted})
                    </li>
                ))}
                </ul>
                {employee.completedCourses.length === 0 && <p className="text-muted-foreground">No courses completed yet.</p>}
              </CardContent>
            </Card>

          </div>

          {/* Right Column / Summary Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5" />Learning Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Courses Completed:</strong> {employee.learningMetrics.totalCoursesCompleted}</p>
                <p><strong>Total Learning Hours:</strong> {employee.learningMetrics.totalLearningHours} hrs</p>
                <p><strong>Avg. Assessment Improvement:</strong> {employee.learningMetrics.averageAssessmentScoreImprovement}%</p>
                <p><strong>Badges Earned:</strong> {employee.learningMetrics.badgesEarned}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5" />Performance Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Overall Rating:</strong> {employee.performanceMetrics.overallPerformanceRating}</p>
                <p><strong>Last Review:</strong> {employee.performanceMetrics.lastReviewDate}</p>
                <h5 className="font-semibold mt-2">Key Achievements:</h5>
                <ul className="list-disc pl-5">
                  {employee.performanceMetrics.keyAchievements.map((ach: string, idx: number) => <li key={idx}>{ach}</li>)}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Star className="mr-2 h-5 w-5" />Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {employee.strengths.map((strength: string, idx: number) => <li key={idx}>{strength}</li>)}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Target className="mr-2 h-5 w-5" />Areas for Development</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {employee.areasForDevelopment.map((area: string, idx: number) => <li key={idx}>{area}</li>)}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5" />Recommended Learning</CardTitle>
              </CardHeader>
              <CardContent>
                {employee.recommendedCourses.map((course: {
                  courseId: string;
                  courseName: string;
                  provider: string;
                  reasonForRecommendation: string;
                }) => (
                  <div key={course.courseId} className="mb-3 p-2 border-b last:border-b-0">
                    <h4 className="font-semibold text-sm">{course.courseName} <Badge variant="outline">{course.provider}</Badge></h4>
                    <p className="text-xs text-muted-foreground">{course.reasonForRecommendation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};

export default EmployeeProfileClient;

