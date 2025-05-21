"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PlatformLayout from '@/components/platform/PlatformLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, Target, TrendingUp, BookOpen, Star, Users, Award, BarChart3, Lightbulb, LinkIcon, CalendarDays, Mail, UserSquare, ShieldCheck } from 'lucide-react';

// Define interfaces for the data structure
interface Skill {
  skill: string;
  level: number;
}

interface CompetencyItem {
  name: string;
  level: string;
  description: string;
}

interface Assessment {
  name: string;
  datePre?: string;
  scorePre?: number;
  datePost?: string;
  scorePost?: number;
  learningIntervention?: string;
}

interface Enrollment {
  courseName: string;
  provider: string;
  progress: number;
  dueDate: string;
}

interface RecommendedCourse {
  id: string;
  name: string;
  provider: string;
  reason: string;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  progress: number;
}

interface EmployeeData {
  employeeId: string;
  name: string;
  email: string;
  role: string;
  team: string;
  manager: string;
  profileImage: string;
  bio: string;
  skills: Skill[];
  competencies: {
    technical: CompetencyItem[];
    behavioural: CompetencyItem[];
  };
  assessments: Assessment[];
  currentEnrollments: Enrollment[];
  performanceMetrics: {
    overallRating: number;
    goalsAchieved: string;
    peerFeedbackSummary: string;
    managerFeedbackSummary: string;
  };
  learningProgress: {
    coursesCompletedThisYear: number;
    hoursLearnedThisYear: number;
    skillsDeveloped: string[];
  };
  strengths: string[];
  recommendedCourses: RecommendedCourse[];
  learningPaths: LearningPath[];
}

const EmployeeProfilePage = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you might fetch this based on an ID from the route
        // For this mock, we directly import the JSON.
        const response = await fetch('/api/mock-employee-profile'); // Assuming you set up an API route
        if (!response.ok) {
            // Fallback to direct import if API route fails during dev/static export
            console.warn("API route for mock data failed, attempting direct import.");
            const staticData = await import('@/app/platform/employee-profile-mock-data.json');
            setEmployeeData(staticData.default || staticData);
            setIsLoading(false);
            return;
        }
        const data = await response.json();
        setEmployeeData(data);
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError("Failed to load employee profile. Trying static data.");
        // Fallback for static export or if API route is not available
        try {
            const staticData = await import('@/app/platform/employee-profile-mock-data.json');
            setEmployeeData(staticData.default || staticData);
        } catch (staticErr) {
            console.error("Error fetching static employee data:", staticErr);
            setError("Failed to load employee profile data.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <PlatformLayout title="Employee Profile"><div className="flex justify-center items-center h-64"><p>Loading profile...</p></div></PlatformLayout>;
  }

  if (error || !employeeData) {
    return <PlatformLayout title="Employee Profile"><div className="text-red-500 text-center p-8">{error || "Employee data could not be loaded."}</div></PlatformLayout>;
  }

  const { 
    name, email, employeeId, role, bio, skills, competencies, assessments, 
    currentEnrollments, performanceMetrics, learningProgress, strengths, 
    recommendedCourses, learningPaths, profileImage 
  } = employeeData;

  return (
    <PlatformLayout title={`${name} - Profile`} currentView="manager">
      <div className="container mx-auto py-8 px-4 md:px-0">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-6 flex flex-col md:flex-row items-center">
            <div className="md:mr-8 mb-4 md:mb-0 flex-shrink-0">
              <Image 
                src={profileImage || "/images/mock/default_avatar.png"} 
                alt={`${name}'s profile`} 
                width={150} 
                height={150} 
                className="rounded-full border-4 border-gray-200 dark:border-gray-700 shadow-lg"
                onError={(e) => { e.currentTarget.src = "/images/mock/default_avatar.png"; }} // Fallback for broken image
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{name}</h1>
              <p className="text-xl text-indigo-600 dark:text-indigo-400 font-medium">{role}</p>
              <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center"><Mail className="mr-2 h-4 w-4" /> {email}</p>
                <p className="flex items-center"><UserSquare className="mr-2 h-4 w-4" /> Employee ID: {employeeId}</p>
              </div>
              <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{bio}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (or first in single column) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills & Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Target className="mr-2 h-6 w-6 text-blue-500" />Skills Overview</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  {skills.map(skill => (
                    <div key={skill.skill} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.skill}</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} aria-label={`${skill.skill} proficiency ${skill.level}%`} className="h-3" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg min-h-[300px]">
                  <Image 
                    src="/images/mock/employee_skills_radar_chart.png" 
                    alt="Skills Radar Chart" 
                    width={350} 
                    height={350} 
                    className="object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<p class=\"text-center text-gray-500\">(Radar chart image not available)</p>'; }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Competencies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-6 w-6 text-green-500" />Competencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Technical</h3>
                  {competencies.technical.map(comp => (
                    <div key={comp.name} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <p className="font-medium text-gray-800 dark:text-gray-100">{comp.name} <Badge variant={comp.level === 'Expert' ? 'destructive' : comp.level === 'Advanced' ? 'default' : 'secondary'}>{comp.level}</Badge></p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{comp.description}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Behavioural</h3>
                  {competencies.behavioural.map(comp => (
                    <div key={comp.name} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <p className="font-medium text-gray-800 dark:text-gray-100">{comp.name} <Badge variant={comp.level === 'Expert' ? 'destructive' : comp.level === 'Advanced' ? 'default' : 'secondary'}>{comp.level}</Badge></p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{comp.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assessment Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Award className="mr-2 h-6 w-6 text-yellow-500" />Assessment Results (Impact Validation)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assessments.map(assessment => (
                  <div key={assessment.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">{assessment.name}</h4>
                    {assessment.learningIntervention && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Intervention: {assessment.learningIntervention}</p>}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">Pre-Learning: {assessment.scorePre !== undefined ? `${assessment.scorePre}%` : 'N/A'} {assessment.datePre && `(${assessment.datePre})`}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">Post-Learning: {assessment.scorePost !== undefined ? `${assessment.scorePost}%` : 'N/A'} {assessment.datePost && `(${assessment.datePost})`}</p>
                      </div>
                    </div>
                    {assessment.scorePre !== undefined && assessment.scorePost !== undefined && (
                        <div className="mt-2">
                            <p className={`text-sm font-medium ${assessment.scorePost > assessment.scorePre ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                Impact: {assessment.scorePost - assessment.scorePre}%
                            </p>
                        </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column (or second in single column) */}
          <div className="lg:col-span-1 space-y-8">
            {/* Current Enrollments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><BookOpen className="mr-2 h-6 w-6 text-purple-500" />Current Enrollments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentEnrollments.map(enrollment => (
                  <div key={enrollment.courseName}>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{enrollment.courseName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Provider: {enrollment.provider} - Due: {enrollment.dueDate}</p>
                    <Progress value={enrollment.progress} className="mt-1 h-2" aria-label={`${enrollment.courseName} progress ${enrollment.progress}%`} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance & Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-6 w-6 text-teal-500" />Performance & Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong className="text-gray-700 dark:text-gray-300">Overall Rating:</strong> <Badge>{performanceMetrics.overallRating}/5</Badge></p>
                <p><strong className="text-gray-700 dark:text-gray-300">Goals Achieved:</strong> {performanceMetrics.goalsAchieved}</p>
                <Separator className="my-2" />
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Learning Metrics:</h4>
                <ul className="list-disc list-inside pl-1 text-gray-600 dark:text-gray-400">
                  <li>Courses Completed (Year): {learningProgress.coursesCompletedThisYear}</li>
                  <li>Hours Learned (Year): {learningProgress.hoursLearnedThisYear}</li>
                  <li>New Skills Developed: {learningProgress.skillsDeveloped.join(', ')}</li>
                </ul>
                <Separator className="my-2" />
                 <h4 className="font-semibold text-gray-700 dark:text-gray-300">Feedback Summary:</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Peer:</strong> {performanceMetrics.peerFeedbackSummary}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Manager:</strong> {performanceMetrics.managerFeedbackSummary}</p>
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Star className="mr-2 h-6 w-6 text-amber-500" />Highlighted Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {strengths.map((strength, i) => <li key={i}>{strength}</li>)}
                </ul>
              </CardContent>
            </Card>

            {/* Recommended Courses/Learning Paths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-6 w-6 text-cyan-500" />Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Courses:</h4>
                {recommendedCourses.map(course => (
                  <Alert key={course.id} className="mb-3 bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-700">
                    <LinkIcon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    <AlertTitle className="text-cyan-800 dark:text-cyan-200">{course.name} <span className="text-xs text-cyan-600 dark:text-cyan-400">({course.provider})</span></AlertTitle>
                    <AlertDescription className="text-xs text-cyan-700 dark:text-cyan-300">{course.reason}</AlertDescription>
                  </Alert>
                ))}
                <Separator className="my-4" />
                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Learning Paths:</h4>
                {learningPaths.map(path => (
                  <div key={path.id} className="mb-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <p className="font-medium text-gray-800 dark:text-gray-100">{path.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{path.description}</p>
                    <Progress value={path.progress} className="mt-1 h-2" aria-label={`${path.name} progress ${path.progress}%`} />
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

export default EmployeeProfilePage;

