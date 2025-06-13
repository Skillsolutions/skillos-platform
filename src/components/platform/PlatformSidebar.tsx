"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from '@/lib/mock-auth';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart2, 
  Award, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Megaphone,
  Calculator,
  Briefcase,
  Target,
  GitBranch,
  FileText,
  Brain,
  GraduationCap,
  LineChart,
  ChevronDown,
  ChevronRight,
  Route,
  Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PlatformSidebarProps {
  language: string;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  roles: string[];
  children?: NavigationItem[];
}

const PlatformSidebar: React.FC<PlatformSidebarProps> = ({ language }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'learning': true,
    'talent': false,
    'analytics': false,
    'admin': false
  });

  // Get user role from session
  const userRole = session?.user?.role || 'admin';

  // Define navigation items based on user role and logical grouping
  const navigationGroups: { 
    id: string;
    title: string;
    items: NavigationItem[];
  }[] = [
    {
      id: 'learning',
      title: language === 'ar' ? 'التعلم والتطوير' : 'Learning & Development',
      items: [
        {
          name: language === 'ar' ? 'لوحة القيادة' : 'Dashboard',
          href: '/platform/dashboard',
          icon: <LayoutDashboard className="h-5 w-5" />,
          roles: ['admin', 'departmentHead', 'teamLeader', 'employee']
        },
        {
          name: language === 'ar' ? 'كتالوج الدورات' : 'Course Catalogue',
          href: '/platform/course-catalogue',
          icon: <BookOpen className="h-5 w-5" />,
          roles: ['admin', 'departmentHead', 'teamLeader', 'employee']
        },
        {
          name: language === 'ar' ? 'مسارات التعلم' : 'Learning Paths',
          href: '/platform/learning-personalization',
          icon: <Route className="h-5 w-5" />,
          roles: ['admin', 'departmentHead', 'teamLeader', 'employee']
        },
        {
          name: language === 'ar' ? 'مخطط المشاركة' : 'Engagement Planner',
          href: '/platform/engagement-planner',
          icon: <Zap className="h-5 w-5" />,
          roles: ['admin', 'departmentHead', 'teamLeader']
        },
        {
          name: language === 'ar' ? 'مركز التقييم' : 'Assessment Center',
          href: '/platform/assessments/custom-center',
          icon: <Award className="h-5 w-5" />,
          roles: ['admin', 'departmentHead', 'teamLeader']
        }
      ]
    },
    {
      id: 'talent',
      title: language === 'ar' ? 'إدارة المواهب' : 'Talent Management',
      items: [
        {
          name: language === 'ar' ? 'إدارة الفريق' : 'Team Management',
          href: '/platform/team-management',
          icon: <Users className="h-5 w-5" />,
          roles: ['admin', 'departmentHead', 'teamLeader']
        },
        {
          name: language === 'ar' ? 'الأدوار الوظيفية' : 'Job Roles',
          href: '/platform/job-roles',
          icon: <Briefcase className="h-5 w-5" />,
          roles: ['admin', 'departmentHead', 'teamLeader']
        },
        {
          name: language === 'ar' ? 'إدارة الكفاءات' : 'Competency Management',
          href: '/platform/competency-management',
          icon: <Target className="h-5 w-5" />,
          roles: ['admin', 'departmentHead']
        },
        {
          name: language === 'ar' ? 'تخطيط التعاقب' : 'Succession Planning',
          href: '/platform/succession-planning',
          icon: <GitBranch className="h-5 w-5" />,
          roles: ['admin', 'departmentHead']
        }
      ]
    },
    {
      id: 'analytics',
      title: language === 'ar' ? 'التحليلات والرؤى' : 'Analytics & Insights',
      items: [
        {
          name: language === 'ar' ? 'تحليلات الأداء' : 'Performance Analytics',
          href: '/platform/analytics',
          icon: <BarChart2 className="h-5 w-5" />,
          roles: ['admin', 'departmentHead', 'teamLeader']
        },
        {
          name: language === 'ar' ? 'ذكاء المهارات' : 'Skill Intelligence',
          href: '/platform/skill-intelligence',
          icon: <Brain className="h-5 w-5" />,
          roles: ['admin', 'departmentHead', 'teamLeader']
        },
        {
          name: language === 'ar' ? 'تحليلات التأثير' : 'Impact Analytics',
          href: '/platform/impact-analytics',
          icon: <LineChart className="h-5 w-5" />,
          roles: ['admin', 'departmentHead']
        },
        {
          name: language === 'ar' ? 'التقارير' : 'Reports',
          href: '/platform/reports',
          icon: <FileText className="h-5 w-5" />,
          roles: ['admin', 'departmentHead']
        }
      ]
    },
    {
      id: 'admin',
      title: language === 'ar' ? 'الإدارة' : 'Administration',
      items: [
        {
          name: language === 'ar' ? 'الإعدادات' : 'Settings',
          href: '/platform/settings',
          icon: <Settings className="h-5 w-5" />,
          roles: ['admin', 'departmentHead', 'teamLeader', 'employee']
        }
      ]
    }
  ];

  // Toggle a navigation group's expanded state
  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Check if a path is active or one of its children is active
  const isActiveGroup = (items: NavigationItem[]): boolean => {
    return items.some(item => 
      item.href === pathname || 
      (item.children && isActiveGroup(item.children))
    );
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  // Auto-expand the group containing the active page
  useEffect(() => {
    navigationGroups.forEach(group => {
      if (isActiveGroup(group.items)) {
        setOpenGroups(prev => ({
          ...prev,
          [group.id]: true
        }));
      }
    });
  }, [pathname]);

  // Filter navigation items based on user role
  const filteredNavigationGroups = navigationGroups.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(userRole))
  })).filter(group => group.items.length > 0);

  // Render a navigation item
  const renderNavItem = (item: NavigationItem) => (
    <Link
      key={item.name}
      href={item.href || '#'}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        pathname === item.href
          ? 'bg-gray-700 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
      onClick={() => {
        if (sidebarOpen) setSidebarOpen(false);
      }}
    >
      <span className={`${language === 'ar' ? 'ml-3' : 'mr-3'} ${pathname === item.href ? 'text-white' : 'text-gray-400'}`}>
        {item.icon}
      </span>
      {item.name}
    </Link>
  );

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-40 w-full bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-300 hover:text-white focus:outline-none"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="font-semibold text-lg text-white">SkillOS</div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:w-72 lg:bg-gray-800 lg:border-r lg:border-gray-700">
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-700">
          <div className="text-2xl font-bold text-blue-400">SkillOS</div>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-4 py-4">
            {filteredNavigationGroups.map((group, index) => (
              <div key={group.id} className={index > 0 ? "mt-6" : ""}>
                <Collapsible
                  open={openGroups[group.id]}
                  onOpenChange={() => toggleGroup(group.id)}
                  className="space-y-1"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-200 rounded-md hover:bg-gray-700 hover:text-white">
                    <span className="flex items-center">
                      {group.title}
                    </span>
                    <span>
                      {openGroups[group.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-2 space-y-1 mt-1">
                    {group.items.map(renderNavItem)}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700">
            <Button
              variant="outline"
              className="w-full text-red-400 hover:text-red-300 hover:bg-gray-700 border-gray-600"
              onClick={handleLogout}
            >
              <LogOut className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col z-40 w-72 bg-gray-800">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
              <div className="text-2xl font-bold text-blue-400">SkillOS</div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
              <nav className="flex-1 px-4 py-4">
                {filteredNavigationGroups.map((group, index) => (
                  <div key={group.id} className={index > 0 ? "mt-6" : ""}>
                    <Collapsible
                      open={openGroups[group.id]}
                      onOpenChange={() => toggleGroup(group.id)}
                      className="space-y-1"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-200 rounded-md hover:bg-gray-700 hover:text-white">
                        <span className="flex items-center">
                          {group.title}
                        </span>
                        <span>
                          {openGroups[group.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </span>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-2 space-y-1 mt-1">
                        {group.items.map(renderNavItem)}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-700">
                <Button
                  variant="outline"
                  className="w-full text-red-400 hover:text-red-300 hover:bg-gray-700 border-gray-600"
                  onClick={handleLogout}
                >
                  <LogOut className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {language === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlatformSidebar;
