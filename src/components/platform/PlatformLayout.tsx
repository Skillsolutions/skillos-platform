import PlatformSidebar from "@/components/platform/PlatformSidebar";
import { useAuth } from "@/hooks/useAuth";
import { ShieldCheck, Eye, LogOut, HomeIcon } from "lucide-react"; // Added LogOut, HomeIcon
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PlatformLayoutProps {
  children: React.ReactNode;
  title: string;
  requiredRole?: string | string[];
  currentView?: "learner" | "manager";
}

const PlatformLayout: React.FC<PlatformLayoutProps> = ({ children, title, requiredRole, currentView = "manager" }) => {
  const { userRole, jobTitle, loading, logout } = useAuth(); // Added jobTitle and logout

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <p>Loading user information...</p>
      </div>
    );
  }

  const hasAccess = () => {
    if (!requiredRole) return true;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    return userRole === requiredRole;
  };

  const isManager = ["admin", "departmentHead", "teamLeader"].includes(userRole);

  const handleViewSwitch = () => {
    if (currentView === "manager") {
      alert("Switching to Learner View (mock action). You might be redirected to /platform/learner-profile or a learner dashboard.");
      // Example: window.location.href = "/platform/learner-profile"; // This would be a real navigation
    } else {
      alert("Switching to Manager View (mock action). You might be redirected to /platform/dashboard.");
      // Example: window.location.href = "/platform/dashboard"; // This would be a real navigation
    }
  };

  const handleLogout = () => {
    logout();
    // alert("Logged out successfully! (Mock action)"); // Alert is now in useAuth's mock logout
    // window.location.href = "/login"; // Redirect to login page after logout
  };

  if (!hasAccess()) {
    return (
      <div className="flex h-screen bg-gray-100">
        {currentView !== "learner" && <PlatformSidebar currentView={currentView} />}
        <main className={`flex-1 p-8 ${currentView !== "learner" ? "ml-64" : "ml-0"} overflow-y-auto flex flex-col items-center justify-center`}>
            <ShieldCheck className="w-24 h-24 text-red-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Access Denied</h1>
            <p className="text-lg text-muted-foreground mb-8">You do not have the necessary permissions to view this page.</p>
            <Button onClick={() => window.history.back()} className="mt-6">Go Back</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {currentView !== "learner" && <PlatformSidebar currentView={currentView} />}
      <main className={`flex-1 p-8 ${currentView !== "learner" ? "ml-72" : "ml-0 md:ml-8 lg:ml-16 xl:ml-24"} overflow-y-auto`}> {/* Adjusted margin for learner view to provide some padding */} 
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
          <div className="flex items-center space-x-3">
            {isManager && (
              <Button onClick={handleViewSwitch} variant="outline" className="bg-gray-800 text-white hover:bg-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600">
                <Eye className="mr-2 h-4 w-4" />
                {currentView === "manager" ? "Switch to Learner View" : "Switch to Manager View"}
              </Button>
            )}
            {currentView === "learner" && (
              <>
                <Button onClick={handleLogout} variant="outline" size="icon" title="Log Out">
                  <LogOut className="h-5 w-5" />
                </Button>
                <Link href="/" passHref>
                  <Button variant="outline" size="icon" title="Back to Main Site">
                    <HomeIcon className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>
        <div className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 ${currentView === "learner" ? "mx-auto max-w-5xl" : "" }`}> {/* Centering content for learner view */} 
          {children}
        </div>
      </main>
    </div>
  );
};

export default PlatformLayout;

