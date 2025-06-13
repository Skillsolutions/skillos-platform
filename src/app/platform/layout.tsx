"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  BookOpen, 
  BarChart2, 
  Users, 
  Settings, 
  FileText, 
  Award, 
  Briefcase, 
  Layers, 
  TrendingUp, 
  Calendar, 
  Brain, 
  User, 
  LogOut,
  ChevronDown,
  ChevronRight,
  BarChart,
  Activity,
  Box,
  Cog
} from 'lucide-react';

// Simplified platform layout without auth
export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State for collapsible sections
  const [learningExpanded, setLearningExpanded] = useState(true);
  const [talentExpanded, setTalentExpanded] = useState(false);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(false);
  
  // Mock user data
  const mockUser = {
    name: "Demo User",
    email: "demo@acme.com",
    role: "Admin"
  };
  
  // Render platform layout with sidebar and children
  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-4 flex justify-center">
          <span className="text-3xl font-bold text-blue-400">SkillOS</span>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {/* Learning & Development Section */}
          <div className="mb-2">
            <button 
              onClick={() => setLearningExpanded(!learningExpanded)}
              className="flex items-center justify-between w-full px-4 py-3 text-left text-lg font-medium hover:bg-gray-800"
            >
              <span>Learning & Development</span>
              {learningExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            
            {learningExpanded && (
              <div className="pl-4">
                <Link href="/platform/dashboard" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <Home className="mr-3 h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/platform/course-catalogue" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <BookOpen className="mr-3 h-5 w-5" />
                  <span>Course Catalogue</span>
                </Link>
                <Link href="/platform/learning-personalization" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <Layers className="mr-3 h-5 w-5" />
                  <span>Manage Learning</span>
                </Link>
                <Link href="/platform/engagement-planner" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <Calendar className="mr-3 h-5 w-5" />
                  <span>Engagement Planner</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Talent Management Section */}
          <div className="mb-2">
            <button 
              onClick={() => setTalentExpanded(!talentExpanded)}
              className="flex items-center justify-between w-full px-4 py-3 text-left text-lg font-medium hover:bg-gray-800"
            >
              <span>Talent Management</span>
              {talentExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            
            {talentExpanded && (
              <div className="pl-4">
                <Link href="/platform/team-management" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <Users className="mr-3 h-5 w-5" />
                  <span>Team Management</span>
                </Link>
                <Link href="/platform/job-roles" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <Briefcase className="mr-3 h-5 w-5" />
                  <span>Job Roles</span>
                </Link>
                <Link href="/platform/competency-management" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <Box className="mr-3 h-5 w-5" />
                  <span>Competency Management</span>
                </Link>
                <Link href="/platform/succession-planning" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <Activity className="mr-3 h-5 w-5" />
                  <span>Succession Planning</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Analytics & Insights Section */}
          <div className="mb-2">
            <button 
              onClick={() => setAnalyticsExpanded(!analyticsExpanded)}
              className="flex items-center justify-between w-full px-4 py-3 text-left text-lg font-medium hover:bg-gray-800"
            >
              <span>Analytics & Insights</span>
              {analyticsExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            
            {analyticsExpanded && (
              <div className="pl-4">
                <Link href="/platform/analytics" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <BarChart className="mr-3 h-5 w-5" />
                  <span>Performance Analytics</span>
                </Link>
                <Link href="/platform/skill-intelligence" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <Brain className="mr-3 h-5 w-5" />
                  <span>Skill Intelligence</span>
                </Link>
                <Link href="/platform/impact-analytics" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <TrendingUp className="mr-3 h-5 w-5" />
                  <span>Impact Analytics</span>
                </Link>
                <Link href="/platform/reports" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <FileText className="mr-3 h-5 w-5" />
                  <span>Reports</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Administration Section */}
          <div className="mb-2">
            <button 
              onClick={() => setAdminExpanded(!adminExpanded)}
              className="flex items-center justify-between w-full px-4 py-3 text-left text-lg font-medium hover:bg-gray-800"
            >
              <span>Administration</span>
              {adminExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            
            {adminExpanded && (
              <div className="pl-4">
                <Link href="/platform/settings" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-md">
                  <Cog className="mr-3 h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {mockUser.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{mockUser.name || 'User'}</p>
              <p className="text-xs text-gray-400">{mockUser.email}</p>
            </div>
          </div>
          <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 max-w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}

