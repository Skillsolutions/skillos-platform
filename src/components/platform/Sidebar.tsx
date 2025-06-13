import React from 'react';
import { 
  Home, 
  BarChart3, 
  BookOpen, 
  Users, 
  Settings, 
  Award, 
  TrendingUp, 
  MessageSquare,
  Target,
  Building,
  UserCheck,
  FileText,
  LogOut,
  User
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const navigationItems = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", href: "/platform/dashboard", icon: Home },
        { name: "Analytics", href: "/platform/analytics", icon: BarChart3 },
      ]
    },
    {
      title: "Learning & Development",
      items: [
        { name: "Course Catalogue", href: "/platform/course-catalogue", icon: BookOpen },
        { name: "Learning Personalization", href: "/platform/learning-personalization", icon: Target },
        { name: "Engagement Planner", href: "/platform/engagement/planner", icon: MessageSquare },
        { name: "ROI of Learning", href: "/platform/roi-of-learning", icon: TrendingUp },
      ]
    },
    {
      title: "Learning Paths",
      items: [
        { name: "Skills Gap Analysis", href: "/platform/skills-gap", icon: Target },
        { name: "Skill Intelligence", href: "/platform/skill-intelligence", icon: TrendingUp },
      ]
    },
    {
      title: "Assessment & Evaluation",
      items: [
        { name: "Assessment Center", href: "/platform/assessments/custom-center", icon: Award },
        { name: "AI Builder", href: "/platform/assessments/ai-builder", icon: Award },
      ]
    },
    {
      title: "Management",
      items: [
        { name: "Team Management", href: "/platform/team-management", icon: Users },
        { name: "Competency Management", href: "/platform/competency-management", icon: UserCheck },
        { name: "Job Roles", href: "/platform/job-roles", icon: Building },
        { name: "Succession Planning", href: "/platform/succession-planning", icon: Users },
      ]
    },
    {
      title: "Reports & Communication",
      items: [
        { name: "Reports", href: "/platform/reports", icon: FileText },
        { name: "Communication Hub", href: "/platform/communication/hub", icon: MessageSquare },
        { name: "Impact Analytics", href: "/platform/impact-analytics", icon: BarChart3 },
      ]
    }
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">SkillOS</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-6">
              {navigationItems.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`
                            flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                            ${isActive(item.href) 
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }
                          `}
                          onClick={onClose}
                        >
                          <Icon className="mr-3 h-4 w-4" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-400 truncate">
                  admin@skillsolutions.io
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <Link
                href="/platform/settings"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
                onClick={onClose}
              >
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Link>
              
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => {
                  // Handle logout
                  window.location.href = '/login';
                }}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

