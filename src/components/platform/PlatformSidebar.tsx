import Link from 'next/link';
import { Home, BarChart2, Settings, Calendar, Zap, LayoutDashboard, CheckSquare, Edit3, DollarSign, BookMarked, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";

interface PlatformSidebarProps {
  currentView?: "learner" | "manager";
}

const PlatformSidebar: React.FC<PlatformSidebarProps> = ({ currentView = "manager" }) => {
  const { userRole, jobTitle, logout } = useAuth();

  const allNavItems = [
    // Manager View Items
    { href: '/platform/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ["admin", "departmentHead", "teamLeader"], views: ["manager"] },
    { href: '/platform/course-catalogue', label: 'Course Catalogue', icon: BookMarked, roles: ["admin", "departmentHead", "teamLeader", "learner"], views: ["manager", "learner"] },
    { href: '/platform/assessments/custom-center', label: 'Assessment Center', icon: Edit3, roles: ["admin", "departmentHead", "teamLeader"], views: ["manager"] },
    { href: '/platform/engagement/planner', label: 'Engagement Planner', icon: Calendar, roles: ["admin", "departmentHead", "teamLeader"], views: ["manager"] },
    { href: '/platform/roi-of-learning', label: 'ROI of Learning', icon: DollarSign, roles: ["admin", "departmentHead", "teamLeader"], views: ["manager"] },
    { href: '/platform/analytics', label: 'Analytics', icon: BarChart2, roles: ["admin", "departmentHead", "teamLeader"], views: ["manager"] },
    { href: '/platform/settings', label: 'Settings', icon: Settings, roles: ["admin"], views: ["manager"] },
    // Learner View Items (only shown if currentView is 'learner' and userRole is 'learner')
    { href: '/platform/learner-profile', label: 'My Profile', icon: UserCircle, roles: ["learner"], views: ["learner"] },
  ];

  // Filter items: must match user's role AND the current view context.
  let visibleNavItems = allNavItems.filter(item => 
    item.roles.includes(userRole) && item.views.includes(currentView)
  );

  const handleLogout = () => {
    logout(); 
  };

  return (
    <aside className="w-72 bg-gray-800 text-white p-6 fixed h-full flex flex-col dark:bg-slate-900">
      <div className="mb-10">
        <Link href={currentView === "learner" ? "/platform/learner-profile" : "/platform/dashboard"} className="text-3xl font-bold text-white hover:text-gray-300 flex items-center">
          <CheckSquare className="mr-3 h-8 w-8 text-green-400" />
          SkillOS
        </Link>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Role: {jobTitle || (userRole.charAt(0).toUpperCase() + userRole.slice(1))}</p>
        {/* Optional: Display current view for debugging if needed, but not for prod 
        {currentView && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">View: {currentView.charAt(0).toUpperCase() + currentView.slice(1)}</p>}*/}
      </div>
      <nav className="flex-grow">
        <ul>
          {visibleNavItems.map((item) => (
            <li key={item.label} className="mb-3">
              <Link href={item.href} className="flex items-center py-2 px-3 hover:bg-gray-700 dark:hover:bg-slate-700 rounded-md transition-colors duration-150 ease-in-out text-sm">
                <item.icon className="mr-4 h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-6 border-t border-gray-700 dark:border-slate-700">
        <button onClick={handleLogout} className="flex items-center py-2 px-3 text-sm hover:bg-gray-700 dark:hover:bg-slate-700 rounded-md transition-colors duration-150 ease-in-out w-full text-left">
          <LogOut className="mr-4 h-5 w-5 flex-shrink-0" />
          Log Out
        </button>
        <Link href="/" className="flex items-center py-2 px-3 text-sm hover:bg-gray-700 dark:hover:bg-slate-700 rounded-md transition-colors duration-150 ease-in-out mt-2">
          <Home className="mr-4 h-5 w-5 flex-shrink-0" />
          Back to Main Site
        </Link>
      </div>
    </aside>
  );
};

export default PlatformSidebar;

