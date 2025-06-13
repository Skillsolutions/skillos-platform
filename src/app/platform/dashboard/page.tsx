"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Award,
  BarChart3,
  Target,
  Zap,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { 
  useOrganizationMetrics, 
  useTopLearners, 
  useRecentActivity 
} from "@/lib/xapi/hooks";

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState('test-org'); // Default org ID for testing
  
  // Use real-time xAPI data hooks instead of mock data
  const metrics = useOrganizationMetrics(organizationId);
  const topLearners = useTopLearners(organizationId, 5);
  const recentActivity = useRecentActivity(organizationId, 4);

  // Trigger test data generation on initial load (for development only)
  useEffect(() => {
    const loadTestData = async () => {
      try {
        // In development, generate test data if none exists
        if (process.env.NODE_ENV !== 'production') {
          const response = await fetch(`/api/xapi/test?organizationId=${organizationId}&userCount=10&courseCount=5`);
          if (response.ok) {
            console.log('Test data generated successfully');
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating test data:', error);
        setIsLoading(false);
      }
    };
    
    loadTestData();
  }, [organizationId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Format recent activity from xAPI events
  const formattedRecentActivity = recentActivity.map(event => {
    let action = 'interacted with';
    if (event.eventType === 'completion') action = 'completed';
    if (event.eventType === 'enrollment') action = 'enrolled in';
    if (event.eventType === 'progress') action = 'progressed on';
    
    // Format timestamp as relative time
    const timeAgo = getTimeAgo(event.timestamp);
    
    return {
      user: event.userName || event.userEmail || 'Anonymous User',
      action,
      course: event.courseName || 'Unknown Course',
      time: timeAgo
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your learning overview.</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button>Export Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniqueUsers || 0}</div>
            <div className="text-sm text-green-600 flex items-center mt-1">
              <ArrowUp className="h-4 w-4 mr-1" />
              Active learners
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completions?.toLocaleString() || 0}</div>
            <div className="text-sm text-green-600 flex items-center mt-1">
              <ArrowUp className="h-4 w-4 mr-1" />
              {metrics.uniqueCourses || 0} unique courses
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(metrics.totalDuration || 0)}
            </div>
            <div className="text-sm text-green-600 flex items-center mt-1">
              <ArrowUp className="h-4 w-4 mr-1" />
              Total learning time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateCompletionRate(metrics)}%
            </div>
            <Progress value={calculateCompletionRate(metrics)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Learning metrics by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metrics.byDepartment || {}).map(([deptName, deptData]) => (
                <div key={deptName} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{deptName}</h4>
                    <p className="text-sm text-gray-600">
                      {deptData.events} events • {deptData.completions} completions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {calculateDeptCompletionRate(deptData)}% completion
                    </p>
                    <div className="text-sm flex items-center text-green-600">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      Active
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Show placeholder if no department data */}
              {Object.keys(metrics.byDepartment || {}).length === 0 && (
                <div className="p-3 border rounded-lg text-center text-gray-500">
                  No department data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Learners */}
        <Card>
          <CardHeader>
            <CardTitle>Top Learners</CardTitle>
            <CardDescription>Most active learners this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLearners.map((learner, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {getInitials(learner.userName || learner.userEmail || 'U')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {learner.userName || formatEmail(learner.userEmail) || 'Anonymous User'}
                      </p>
                      <p className="text-sm text-gray-600">{learner.department || 'No Department'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{learner.completions} courses</p>
                    <p className="text-sm text-gray-600">
                      {formatDuration(learner.totalDuration)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Show placeholder if no learner data */}
              {topLearners.length === 0 && (
                <div className="p-3 border rounded-lg text-center text-gray-500">
                  No learner data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest learning activities across your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formattedRecentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                    <span className="font-medium">{activity.course}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
            
            {/* Show placeholder if no activity data */}
            {formattedRecentActivity.length === 0 && (
              <div className="p-3 border rounded-lg text-center text-gray-500">
                No recent activity available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions

/**
 * Calculate completion rate from metrics
 */
function calculateCompletionRate(metrics: any): number {
  if (!metrics.completions || !metrics.enrollments || metrics.enrollments === 0) {
    return 0;
  }
  return Math.min(100, Math.round((metrics.completions / metrics.enrollments) * 100));
}

/**
 * Calculate department completion rate
 */
function calculateDeptCompletionRate(deptData: { events: number, completions: number }): number {
  if (!deptData.completions || !deptData.events || deptData.events === 0) {
    return 0;
  }
  return Math.min(100, Math.round((deptData.completions / deptData.events) * 100));
}

/**
 * Format duration in seconds to human-readable format
 */
function formatDuration(seconds: number): string {
  if (!seconds) return '0 hrs';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours === 0) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
  
  if (minutes === 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
}

/**
 * Get initials from name
 */
function getInitials(name: string): string {
  if (!name) return 'U';
  
  // If it's an email, use first letter
  if (name.includes('@')) {
    return name.charAt(0).toUpperCase();
  }
  
  // Otherwise get initials from name
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Format email for display
 */
function formatEmail(email: string | undefined): string {
  if (!email) return '';
  
  // If it contains @ symbol, it's an email
  if (email.includes('@')) {
    const parts = email.split('@');
    return parts[0]; // Just show the username part
  }
  
  return email;
}

/**
 * Get relative time string
 */
function getTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  
  return 'just now';
}
