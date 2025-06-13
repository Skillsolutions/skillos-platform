// Mock authentication hook
export const useAuth = () => {
  // In a real app, this would come from a context, Zustand, Redux, or an API call
  
  // To test different roles, uncomment the desired role and comment out the others.
  // Make sure only one role is active at a time for predictable testing.
  const mockUser = {
    role: "admin", // Set to "admin" for manager view testing
    // role: "department_head",
    // role: "team_leader",
    // role: "learner", 
    jobTitle: "", // Initialize jobTitle
  };

  // Assign jobTitle based on role
  if (mockUser.role === "learner") {
    mockUser.jobTitle = "Software Development Intern";
  } else if (mockUser.role === "admin") {
    mockUser.jobTitle = "Platform Administrator";
  } else if (mockUser.role === "departmentHead") {
    mockUser.jobTitle = "Head of Department";
  } else if (mockUser.role === "teamLeader") {
    mockUser.jobTitle = "Team Leader";
  } else {
    mockUser.jobTitle = "Valued Member"; // Fallback job title
  }

  const logout = () => {
    console.log("User logged out (mock function)");
    // In a real app, you would clear session/token and redirect.
    // For example, if using Next.js router:
    // import { useRouter } from "next/navigation";
    // const router = useRouter();
    // router.push("/login");
    // Or, for simple redirection:
    // if (typeof window !== "undefined") {
    //   window.location.href = "/login";
    // }
    alert("Logged out successfully! (Mock action)");
  };

  return {
    userRole: mockUser.role,
    userId: "user123", // Example user ID
    jobTitle: mockUser.jobTitle,
    loading: false, // Simulate loading state if needed
    logout, // Provide the mock logout function
  };
};

