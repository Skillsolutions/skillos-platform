"use client";

import React, { useState, useEffect } from "react";
import PlatformLayout from "@/components/platform/PlatformLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, BookOpen, Zap } from "lucide-react";

interface Course {
  id: string;
  title: string;
  provider: string;
  description: string;
  imageUrl?: string;
  courseUrl: string;
  category: string;
  topics: string[];
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  duration: string;
  rating: number;
}

// Mock team members for assignment
const mockTeamMembers = [
  { id: "emp123", name: "Alex Johnson" },
  { id: "emp456", name: "Brenda Smith" },
  { id: "emp789", name: "Charles Davis" },
  { id: "emp101", name: "Diana Garcia" },
];

// Extended mock courses with more metadata
const mockCourses: Course[] = [
  {
    id: "course1",
    title: "The Complete 2024 Web Development Bootcamp",
    provider: "Udemy",
    description: "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps",
    courseUrl: "#",
    category: "Development",
    topics: ["Web Development", "JavaScript", "React", "Node.js"],
    level: "All Levels",
    duration: "52 hours",
    rating: 4.7
  },
  {
    id: "course2",
    title: "Python for Data Science and Machine Learning Bootcamp",
    provider: "Udemy",
    description: "Learn Python for Data Science and Machine Learning from A-Z. Build data science and machine learning projects.",
    courseUrl: "#",
    category: "Data Science",
    topics: ["Python", "Machine Learning", "Data Analysis"],
    level: "Intermediate",
    duration: "25 hours",
    rating: 4.6
  },
  {
    id: "course3",
    title: "Learning React.js",
    provider: "LinkedIn Learning",
    description: "Get started with React.js, the popular JavaScript library for building user interfaces. Learn the basics of components, props, state, and more.",
    courseUrl: "#",
    category: "Development",
    topics: ["React", "JavaScript", "Frontend"],
    level: "Beginner",
    duration: "3.5 hours",
    rating: 4.5
  },
  {
    id: "course4",
    title: "Strategic Thinking",
    provider: "LinkedIn Learning",
    description: "Learn how to think strategically, analyze complex situations, and make better decisions for your organization.",
    courseUrl: "#",
    category: "Business",
    topics: ["Leadership", "Strategy", "Decision Making"],
    level: "Intermediate",
    duration: "1.5 hours",
    rating: 4.3
  },
  {
    id: "course5",
    title: "Google Data Analytics Professional Certificate",
    provider: "Coursera",
    description: "Gain an immersive understanding of the practices and processes used by a junior or associate data analyst in their day-to-day job.",
    courseUrl: "#",
    category: "Data Science",
    topics: ["Data Analysis", "SQL", "R Programming", "Tableau"],
    level: "Beginner",
    duration: "180 hours",
    rating: 4.8
  },
  {
    id: "course6",
    title: "IBM Full Stack Software Developer Professional Certificate",
    provider: "Coursera",
    description: "Launch your career as a full stack developer. Build job-ready skills for an in-demand role in cloud application development.",
    courseUrl: "#",
    category: "Development",
    topics: ["Full Stack", "Cloud", "DevOps"],
    level: "Intermediate",
    duration: "240 hours",
    rating: 4.6
  },
  {
    id: "course7",
    title: "Leadership Communication Skills",
    provider: "Udemy",
    description: "Master the art of leadership communication to inspire teams, drive change, and achieve organizational goals.",
    courseUrl: "#",
    category: "Leadership",
    topics: ["Communication", "Team Management", "Influence"],
    level: "All Levels",
    duration: "8 hours",
    rating: 4.5
  },
  {
    id: "course8",
    title: "Advanced Excel for Business Analytics",
    provider: "LinkedIn Learning",
    description: "Take your Excel skills to the next level with advanced formulas, pivot tables, and data visualization techniques for business analytics.",
    courseUrl: "#",
    category: "Business",
    topics: ["Excel", "Data Analysis", "Reporting"],
    level: "Advanced",
    duration: "6 hours",
    rating: 4.7
  },
  {
    id: "course9",
    title: "UX Design Fundamentals",
    provider: "Coursera",
    description: "Learn the principles of user experience design and create intuitive, user-friendly digital products.",
    courseUrl: "#",
    category: "Design",
    topics: ["UX", "UI", "Design Thinking", "Wireframing"],
    level: "Beginner",
    duration: "20 hours",
    rating: 4.4
  },
  {
    id: "course10",
    title: "Agile Project Management",
    provider: "Udemy",
    description: "Master Agile methodologies and lead high-performing teams through successful project delivery.",
    courseUrl: "#",
    category: "Project Management",
    topics: ["Agile", "Scrum", "Kanban", "Sprint Planning"],
    level: "Intermediate",
    duration: "12 hours",
    rating: 4.6
  },
  {
    id: "course11",
    title: "Cybersecurity Fundamentals",
    provider: "LinkedIn Learning",
    description: "Build a solid foundation in cybersecurity concepts, threats, and protection strategies for organizations.",
    courseUrl: "#",
    category: "IT & Security",
    topics: ["Cybersecurity", "Network Security", "Risk Management"],
    level: "Beginner",
    duration: "4 hours",
    rating: 4.5
  },
  {
    id: "course12",
    title: "Financial Modeling & Valuation",
    provider: "Coursera",
    description: "Learn to build financial models and value companies using Excel and real-world case studies.",
    courseUrl: "#",
    category: "Finance",
    topics: ["Financial Modeling", "Valuation", "Excel", "Investment Analysis"],
    level: "Advanced",
    duration: "32 hours",
    rating: 4.7
  },
];

// All available providers, categories, and topics for filtering
const allProviders = Array.from(new Set(mockCourses.map(course => course.provider)));
const allCategories = Array.from(new Set(mockCourses.map(course => course.category)));
const allTopics = Array.from(new Set(mockCourses.flatMap(course => course.topics)));
const allLevels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

const CourseCard = ({ course }: { course: Course }) => {
  const { userRole } = useAuth();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const handleAssignClick = () => {
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignment = () => {
    if (selectedMember) {
      alert(`Course "${course.title}" assigned to ${mockTeamMembers.find(m => m.id === selectedMember)?.name}. (Mock Action)`);
      setIsAssignModalOpen(false);
      setSelectedMember(null);
    } else {
      alert("Please select a team member to assign the course.");
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="p-0 relative h-48">
        {course.imageUrl ? (
          <Image 
            src={course.imageUrl} 
            alt={course.title} 
            layout="fill" 
            objectFit="cover" 
            unoptimized={true} 
          />
        ) : (
          <div className="h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <BookOpen className="h-12 w-12 text-gray-400" />
              <span className="text-gray-500 mt-2">{course.provider}</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="w-fit">{course.provider}</Badge>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-1">{course.rating}</span>
            <span className="text-yellow-500">★</span>
          </div>
        </div>
        <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge variant="secondary" className="w-fit">{course.category}</Badge>
          <Badge variant="secondary" className="w-fit">{course.level}</Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground mb-3 flex-grow min-h-[60px]">
          {course.description.length > 100 ? course.description.substring(0, 97) + "..." : course.description}
        </CardDescription>
        <div className="mt-2 mb-3">
          <span className="text-xs text-muted-foreground">Duration: {course.duration}</span>
        </div>
        <div className="mt-auto flex space-x-2">
          <Button asChild className="flex-1">
            <a href={course.courseUrl} target="_blank" rel="noopener noreferrer">View Course</a>
          </Button>
          {(userRole === "admin" || userRole === "department_head" || userRole === "team_leader") && (
            <Button onClick={handleAssignClick} variant="outline" className="flex-1">
              Assign
            </Button>
          )}
        </div>
      </CardContent>
      {isAssignModalOpen && (
        <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Course: {course.title}</DialogTitle>
              <DialogDescription>
                Select a team member to assign this course to.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select onValueChange={setSelectedMember} value={selectedMember || undefined}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
              <Button onClick={handleConfirmAssignment}>Confirm Assignment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

const CourseCataloguePage = () => {
  const { userRole } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createMethod, setCreateMethod] = useState<"manual" | "ai">("manual");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  
  // Filtered courses
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>(mockCourses);
  const [coursesCount, setCoursesCount] = useState(mockCourses.length);
  const [totalCoursesCount] = useState(30000); // Simulating 30,000+ courses
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 12;

  // Apply filters and search
  useEffect(() => {
    let results = mockCourses;
    
    // Apply provider filter
    if (selectedProviders.length > 0) {
      results = results.filter(course => selectedProviders.includes(course.provider));
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter(course => selectedCategories.includes(course.category));
    }
    
    // Apply topic filter
    if (selectedTopics.length > 0) {
      results = results.filter(course => 
        course.topics.some(topic => selectedTopics.includes(topic))
      );
    }
    
    // Apply level filter
    if (selectedLevels.length > 0) {
      results = results.filter(course => selectedLevels.includes(course.level));
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query) ||
        course.topics.some(topic => topic.toLowerCase().includes(query))
      );
    }
    
    setFilteredCourses(results);
    setCoursesCount(results.length);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedProviders, selectedCategories, selectedTopics, selectedLevels, searchQuery]);

  // Update displayed courses based on pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    setDisplayedCourses(filteredCourses.slice(startIndex, endIndex));
  }, [filteredCourses, currentPage]);

  const handleCreateCourse = () => {
    alert(`Custom course creation using ${createMethod === "manual" ? "manual" : "AI-assisted"} method would be implemented here. (Mock Action)`);
    setIsCreateModalOpen(false);
  };

  const toggleProviderFilter = (provider: string) => {
    setSelectedProviders(prev => 
      prev.includes(provider) 
        ? prev.filter(p => p !== provider) 
        : [...prev, provider]
    );
  };

  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const toggleTopicFilter = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    );
  };

  const toggleLevelFilter = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
  };

  const clearAllFilters = () => {
    setSelectedProviders([]);
    setSelectedCategories([]);
    setSelectedTopics([]);
    setSelectedLevels([]);
    setSearchQuery("");
  };

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <PlatformLayout title="Course Catalogue" currentView="manager">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Course Catalogue</h1>
          <p className="text-muted-foreground">
            Explore {totalCoursesCount.toLocaleString()}+ courses from leading platforms like Udemy, LinkedIn Learning, and Coursera.
          </p>
        </div>
        {(userRole === "admin" || userRole === "department_head") && (
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Create Custom Course
          </Button>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search courses by title, description, or topic..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {(selectedProviders.length > 0 || selectedCategories.length > 0 || selectedTopics.length > 0 || selectedLevels.length > 0) && (
              <Badge className="ml-1 bg-blue-500">
                {selectedProviders.length + selectedCategories.length + selectedTopics.length + selectedLevels.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filter Courses</h3>
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-sm h-8">
                Clear All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Provider Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Source</h4>
                <div className="space-y-2">
                  {allProviders.map(provider => (
                    <div key={provider} className="flex items-center">
                      <Checkbox 
                        id={`provider-${provider}`} 
                        checked={selectedProviders.includes(provider)}
                        onCheckedChange={() => toggleProviderFilter(provider)}
                      />
                      <label htmlFor={`provider-${provider}`} className="ml-2 text-sm">
                        {provider}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Category</h4>
                <div className="space-y-2">
                  {allCategories.map(category => (
                    <div key={category} className="flex items-center">
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategoryFilter(category)}
                      />
                      <label htmlFor={`category-${category}`} className="ml-2 text-sm">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topic Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Topics</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {allTopics.map(topic => (
                    <div key={topic} className="flex items-center">
                      <Checkbox 
                        id={`topic-${topic}`} 
                        checked={selectedTopics.includes(topic)}
                        onCheckedChange={() => toggleTopicFilter(topic)}
                      />
                      <label htmlFor={`topic-${topic}`} className="ml-2 text-sm">
                        {topic}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Level</h4>
                <div className="space-y-2">
                  {allLevels.map(level => (
                    <div key={level} className="flex items-center">
                      <Checkbox 
                        id={`level-${level}`} 
                        checked={selectedLevels.includes(level)}
                        onCheckedChange={() => toggleLevelFilter(level)}
                      />
                      <label htmlFor={`level-${level}`} className="ml-2 text-sm">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(selectedProviders.length > 0 || selectedCategories.length > 0 || selectedTopics.length > 0 || selectedLevels.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {selectedProviders.map(provider => (
              <Badge key={`filter-${provider}`} variant="secondary" className="flex items-center gap-1">
                {provider}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleProviderFilter(provider)}
                />
              </Badge>
            ))}
            {selectedCategories.map(category => (
              <Badge key={`filter-${category}`} variant="secondary" className="flex items-center gap-1">
                {category}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleCategoryFilter(category)}
                />
              </Badge>
            ))}
            {selectedTopics.map(topic => (
              <Badge key={`filter-${topic}`} variant="secondary" className="flex items-center gap-1">
                {topic}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleTopicFilter(topic)}
                />
              </Badge>
            ))}
            {selectedLevels.map(level => (
              <Badge key={`filter-${level}`} variant="secondary" className="flex items-center gap-1">
                {level}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleLevelFilter(level)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {displayedCourses.length} of {coursesCount} courses
          {coursesCount < totalCoursesCount && " (filtered)"}
        </p>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Course Grid */}
      {displayedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No courses found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Create Custom Course Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Custom Course</DialogTitle>
            <DialogDescription>
              Create a custom course tailored to your organization's specific needs.
            </DialogDescription>
          </DialogHeader>
          
          {/* Creation Method Tabs */}
          <Tabs defaultValue="manual" className="mt-4" onValueChange={(value) => setCreateMethod(value as "manual" | "ai")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Manual Create
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Create with AI
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {createMethod === "manual" ? (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="course-title" className="text-sm font-medium">Course Title</label>
                <Input 
                  id="course-title"
                  placeholder="Enter course title" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="course-description" className="text-sm font-medium">Description</label>
                <textarea 
                  id="course-description"
                  placeholder="Enter course description" 
                  className="w-full p-2 border rounded-md h-24"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="course-category" className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="course-level" className="text-sm font-medium">Level</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                    <SelectContent>
                      {allLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="course-duration" className="text-sm font-medium">Estimated Duration</label>
                <div className="flex gap-2">
                  <Input 
                    id="course-duration"
                    type="number" 
                    placeholder="Duration" 
                    className="w-24"
                  />
                  <Select defaultValue="hours">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="ai-course-title" className="text-sm font-medium">Course Title or Topic</label>
                <Input 
                  id="ai-course-title"
                  placeholder="E.g., Advanced Leadership Skills" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="ai-target-audience" className="text-sm font-medium">Target Audience</label>
                <Input 
                  id="ai-target-audience"
                  placeholder="E.g., Mid-level managers" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="ai-learning-objectives" className="text-sm font-medium">Learning Objectives</label>
                <textarea 
                  id="ai-learning-objectives"
                  placeholder="E.g., Develop strategic thinking, improve team communication" 
                  className="w-full p-2 border rounded-md h-24"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label htmlFor="ai-course-format" className="text-sm font-medium">Preferred Format</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Lessons</SelectItem>
                    <SelectItem value="interactive">Interactive Modules</SelectItem>
                    <SelectItem value="workshop">Workshop Style</SelectItem>
                    <SelectItem value="mixed">Mixed Format</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCourse}>
              {createMethod === "manual" ? "Create Course" : "Generate with AI"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PlatformLayout>
  );
};

export default CourseCataloguePage;
