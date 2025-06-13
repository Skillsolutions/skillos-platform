"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Plus,
  Play,
  Download
} from "lucide-react";

export default function CourseCataloguePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Mock course data
  const courses = [
    {
      id: 1,
      title: "Advanced React Development",
      description: "Master advanced React concepts including hooks, context, and performance optimization",
      instructor: "Sarah Johnson",
      duration: "8 hours",
      level: "Advanced",
      category: "Development",
      rating: 4.8,
      enrollments: 156,
      thumbnail: "/api/placeholder/300/200",
      skills: ["React", "JavaScript", "Frontend Development"],
      price: "Free"
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      description: "Introduction to data science concepts, tools, and methodologies",
      instructor: "Dr. Michael Chen",
      duration: "12 hours",
      level: "Beginner",
      category: "Data Science",
      rating: 4.6,
      enrollments: 142,
      thumbnail: "/api/placeholder/300/200",
      skills: ["Python", "Statistics", "Data Analysis"],
      price: "Free"
    },
    {
      id: 3,
      title: "Leadership Essentials",
      description: "Develop core leadership skills for managing teams and driving results",
      instructor: "Emily Davis",
      duration: "6 hours",
      level: "Intermediate",
      category: "Leadership",
      rating: 4.7,
      enrollments: 134,
      thumbnail: "/api/placeholder/300/200",
      skills: ["Leadership", "Management", "Communication"],
      price: "Free"
    },
    {
      id: 4,
      title: "Machine Learning Basics",
      description: "Get started with machine learning algorithms and applications",
      instructor: "Alex Thompson",
      duration: "10 hours",
      level: "Intermediate",
      category: "Data Science",
      rating: 4.5,
      enrollments: 128,
      thumbnail: "/api/placeholder/300/200",
      skills: ["Machine Learning", "Python", "AI"],
      price: "Free"
    },
    {
      id: 5,
      title: "Project Management Fundamentals",
      description: "Learn essential project management methodologies and tools",
      instructor: "David Wilson",
      duration: "7 hours",
      level: "Beginner",
      category: "Business",
      rating: 4.4,
      enrollments: 118,
      thumbnail: "/api/placeholder/300/200",
      skills: ["Project Management", "Planning", "Agile"],
      price: "Free"
    },
    {
      id: 6,
      title: "Digital Marketing Strategy",
      description: "Comprehensive guide to modern digital marketing techniques",
      instructor: "Lisa Brown",
      duration: "9 hours",
      level: "Intermediate",
      category: "Marketing",
      rating: 4.6,
      enrollments: 95,
      thumbnail: "/api/placeholder/300/200",
      skills: ["Digital Marketing", "SEO", "Social Media"],
      price: "Free"
    }
  ];

  const categories = ["all", "Development", "Data Science", "Leadership", "Business", "Marketing"];
  const levels = ["all", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Catalogue</h1>
          <p className="text-gray-600">Discover and enroll in courses to advance your skills</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a New Course</DialogTitle>
              <DialogDescription>
                Can't find what you're looking for? Request a new course and we'll consider adding it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="course-title">Course Title</Label>
                <Input id="course-title" placeholder="Enter course title" />
              </div>
              <div>
                <Label htmlFor="course-description">Description</Label>
                <Textarea id="course-description" placeholder="Describe what you'd like to learn" />
              </div>
              <div>
                <Label htmlFor="course-category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search courses, skills, or instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level === "all" ? "All Levels" : level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="h-12 w-12 text-gray-400" />
              </div>
              <Badge className="absolute top-2 right-2" variant="secondary">
                {course.level}
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <Badge variant="outline">{course.price}</Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {course.enrollments}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  {course.rating}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {course.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {course.skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{course.skills.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Enroll
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or request a new course.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Request Course</Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

