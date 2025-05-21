"use client";

import React from "react";
import PlatformLayout from "@/components/platform/PlatformLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Share2, Linkedin, Twitter, Facebook, Award, Star, BookOpen } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: React.ElementType;
}

interface LearnerProfileData {
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
  bio: string;
  skills: string[];
  achievements: Achievement[];
  currentCourses: { title: string; progress: number }[];
}

const mockLearnerProfile: LearnerProfileData = {
  name: "Alex Johnson (Learner)",
  role: "Software Development Intern",
  email: "alex.johnson@example.com",
  avatarUrl: "/images/avatars/learner_alex.png",
  bio: "Passionate about learning new technologies and building innovative solutions. Currently focusing on full-stack development and cloud computing.",
  skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
  achievements: [
    { id: "ach1", title: "Completed: Web Development Bootcamp", description: "Finished the intensive 12-week web development bootcamp.", date: "2024-04-15", icon: Award },
    { id: "ach2", title: "Top Performer: Q1 Learning Challenge", description: "Achieved the highest score in the quarterly learning challenge.", date: "2024-03-30", icon: Star },
    { id: "ach3", title: "Certified: AWS Cloud Practitioner", description: "Successfully passed the AWS Certified Cloud Practitioner exam.", date: "2024-05-01", icon: BookOpen },
  ],
  currentCourses: [
    { title: "Advanced React Patterns", progress: 65 },
    { title: "Microservices with Node.js", progress: 40 },
  ],
};

const LearnerProfilePage = () => {
  const profile = mockLearnerProfile;

  const handleShare = (platform: string) => {
    alert(`Sharing profile to ${platform}! (Mock action)`);
  };

  return (
    <PlatformLayout title="My Learner Profile" currentView="learner">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-24 w-24">
              {profile.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt={profile.name} /> : <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>}
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription>{profile.role}</CardDescription>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button variant="outline" size="icon" onClick={() => handleShare("LinkedIn")}><Linkedin className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("Twitter")}><Twitter className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("Facebook")}><Facebook className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("Link")}><Share2 className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{profile.bio}</p>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => <Badge key={skill}>{skill}</Badge>)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your completed milestones and recognitions.</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.achievements.length > 0 ? (
              <ul className="space-y-4">
                {profile.achievements.map(ach => (
                  <li key={ach.id} className="flex items-start gap-4 p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <ach.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">{ach.title}</h4>
                      <p className="text-sm text-muted-foreground">{ach.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{ach.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No achievements yet. Keep learning!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Learning</CardTitle>
            <CardDescription>Courses you are currently enrolled in.</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.currentCourses.length > 0 ? (
              <ul className="space-y-3">
                {profile.currentCourses.map(course => (
                  <li key={course.title}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{course.title}</span>
                      <span className="text-sm text-muted-foreground">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Not enrolled in any courses currently.</p>
            )}
          </CardContent>
        </Card>

      </div>
    </PlatformLayout>
  );
};

export default LearnerProfilePage;

