"use client";

import React, { useState } from "react";
import PlatformLayout from "@/components/platform/PlatformLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Added for template categories
import { PlusCircle, Edit, Trash2, Send, Trophy, CalendarPlus, Award, BellRing, Megaphone } from "lucide-react";

// Mock data - replace with API calls in a real application
const mockScheduledActivities = [
  { id: "act1", type: "Assessment Reminder", assignedTo: "Eleanor Boxton", date: "2025-05-15", status: "Scheduled", details: "Reminder for Q2 Skills Assessment" },
  { id: "act2", type: "New Course Announcement", assignedTo: "All Engineering", date: "2025-05-18", status: "Scheduled", details: "Announce new Advanced TypeScript course" },
  { id: "act3", type: "Gamified Challenge Start", assignedTo: "Sales Team", date: "2025-05-20", status: "Scheduled", details: "Kick off May Sales Challenge" },
];

const mockLeaderboards = {
  courseCompletion: [
    { rank: 1, name: "John Smith", score: "24 courses", avatar: "JS" },
    { rank: 2, name: "Emma Johnson", score: "18 courses", avatar: "EJ" },
    { rank: 3, name: "Michael Chen", score: "15 courses", avatar: "MC" },
  ],
  skillProgress: [
    { rank: 1, name: "Alice Wonderland", score: "+150 skill points", avatar: "AW" },
    { rank: 2, name: "Bob The Builder", score: "+120 skill points", avatar: "BB" },
    { rank: 3, name: "Carol Danvers", score: "+100 skill points", avatar: "CD" },
  ],
};

type TemplateCategory = "Congrats" | "Reminders" | "Announcements";

const mockMessageTemplates: { id: string; name: string; subject: string; body: string; category: TemplateCategory }[] = [
  {
    id: "tpl1",
    name: "Course Completion Congrats",
    subject: "Congratulations on completing [Course Name]!",
    body: "Hi [Learner Name],\n\nGreat job completing [Course Name]! We're impressed with your dedication. Keep up the fantastic work!\n\nBest,\n[Your Name]",
    category: "Congrats"
  },
  {
    id: "tpl2",
    name: "Upcoming Deadline Reminder",
    subject: "Reminder: [Task Name] is due soon!",
    body: "Hi [Learner Name],\n\nJust a friendly reminder that [Task Name] is due on [Due Date]. Let us know if you need any support.\n\nThanks,\n[Your Name]",
    category: "Reminders"
  },
  {
    id: "tpl3",
    name: "New Feature Announcement",
    subject: "Exciting New Feature Unveiled: [Feature Name]!",
    body: "Hello Team,\n\nWe're thrilled to announce the launch of [Feature Name]! Explore its benefits and how it can help you achieve more.\n\nRegards,\nThe SkillOS Team",
    category: "Announcements"
  },
  {
    id: "tpl4",
    name: "Milestone Achievement Congrats",
    subject: "Well Done on Reaching [Milestone]!",
    body: "Hi [Learner Name],\n\nCongratulations on achieving [Milestone]! Your progress is inspiring.\n\nCheers,\n[Your Name]",
    category: "Congrats"
  },
  {
    id: "tpl5",
    name: "Scheduled Maintenance Reminder",
    subject: "Important: Scheduled Maintenance on [Date]",
    body: "Dear Users,\n\nPlease be advised of scheduled maintenance for the SkillOS platform on [Date] at [Time]. We anticipate minimal disruption.\n\nThank you for your understanding,\nSkillOS Support",
    category: "Reminders"
  }
];

const EngagementPlannerPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activities] = useState(mockScheduledActivities);
  const [leaderboardType, setLeaderboardType] = useState<keyof typeof mockLeaderboards>("courseCompletion");
  const [templates] = useState(mockMessageTemplates);

  const renderTemplatesByCategory = (category: TemplateCategory) => {
    const filteredTemplates = templates.filter(template => template.category === category);
    if (filteredTemplates.length === 0) {
      return <p className="text-sm text-muted-foreground p-4 text-center">No {category.toLowerCase()} templates available.</p>;
    }
    return (
      <ul className="space-y-3 p-1">
        {filteredTemplates.map(template => (
          <li key={template.id} className="p-4 border dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-md">{template.name}</h4>
            <p className="text-sm text-muted-foreground truncate mt-1">Subject: {template.subject}</p>
            <div className="mt-3 space-x-2">
              <Button size="sm" variant="outline"><Send className="mr-1.5 h-4 w-4"/> Use Template</Button>
              <Button size="sm" variant="ghost"><Edit className="h-4 w-4 mr-1.5"/> Edit</Button>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <PlatformLayout title="Engagement Planner">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-semibold">Engagement Planner</h2>
            <p className="text-muted-foreground">Schedule activities, create leaderboards, and send motivational messages.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Dialog>
              <DialogTrigger asChild>
                <Button><CalendarPlus className="mr-2 h-4 w-4" /> Schedule Activity</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Schedule New Activity</DialogTitle>
                  <DialogDescription>Set up a new engagement activity for your learners.</DialogDescription>
                </DialogHeader>
                <p className="text-center py-8">Activity scheduling form will be here.</p>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit">Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline"><Trophy className="mr-2 h-4 w-4" /> Create Leaderboard</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Leaderboard</DialogTitle>
                  <DialogDescription>Set up a new leaderboard to drive friendly competition.</DialogDescription>
                </DialogHeader>
                <p className="text-center py-8">Leaderboard creation form will be here.</p>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline"><Send className="mr-2 h-4 w-4" /> Send Message</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Send Motivational Message</DialogTitle>
                  <DialogDescription>Use a template or craft a new message.</DialogDescription>
                </DialogHeader>
                <p className="text-center py-8">Message sending form with template selection will be here.</p>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit">Send</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Scheduled Activities Section */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Activities</CardTitle>
            <CardDescription>View and manage upcoming engagement activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input type="date" className="w-full md:w-auto" defaultValue={selectedDate?.toISOString().substring(0, 10)} onChange={(e) => setSelectedDate(new Date(e.target.value))} />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.filter(act => !selectedDate || new Date(act.date).toDateString() === selectedDate.toDateString()).map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.type}</TableCell>
                    <TableCell>{activity.assignedTo}</TableCell>
                    <TableCell>{activity.date}</TableCell>
                    <TableCell><span className={`px-2 py-1 text-xs rounded-full ${activity.status === "Scheduled" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{activity.status}</span></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {activities.filter(act => !selectedDate || new Date(act.date).toDateString() === selectedDate.toDateString()).length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">No activities scheduled for this date.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Leaderboards Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Leaderboards</CardTitle>
              <Select value={leaderboardType} onValueChange={(value) => setLeaderboardType(value as keyof typeof mockLeaderboards)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Leaderboard Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="courseCompletion">Course Completion</SelectItem>
                  <SelectItem value="skillProgress">Skill Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>Track top performers and foster healthy competition.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Learner</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeaderboards[leaderboardType].map((learner) => (
                  <TableRow key={learner.rank}>
                    <TableCell className="font-bold">{learner.rank}</TableCell>
                    <TableCell>
                        <div className="flex items-center">
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold mr-3">
                                {learner.avatar || learner.name.substring(0,2).toUpperCase()}
                            </span>
                            {learner.name}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">{learner.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-center mt-4">
                <Button variant="link">View Full {leaderboardType === "courseCompletion" ? "Course Completion" : "Skill Progress"} Leaderboard</Button>
            </div>
          </CardContent>
        </Card>

        {/* Communication Templates Section */}
        <Card>
          <CardHeader>
            <CardTitle>Communication Templates</CardTitle>
            <CardDescription>Quickly send pre-defined messages or create new ones. Categorized for your convenience.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="congrats" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="congrats"><Award className="mr-2 h-4 w-4"/>Congrats</TabsTrigger>
                <TabsTrigger value="reminders"><BellRing className="mr-2 h-4 w-4"/>Reminders</TabsTrigger>
                <TabsTrigger value="announcements"><Megaphone className="mr-2 h-4 w-4"/>Announcements</TabsTrigger>
              </TabsList>
              <TabsContent value="congrats">
                {renderTemplatesByCategory("Congrats")}
              </TabsContent>
              <TabsContent value="reminders">
                {renderTemplatesByCategory("Reminders")}
              </TabsContent>
              <TabsContent value="announcements">
                {renderTemplatesByCategory("Announcements")}
              </TabsContent>
            </Tabs>
            <Button className="mt-6 w-full md:w-auto"><PlusCircle className="mr-2 h-4 w-4"/> Create New Template</Button>
          </CardContent>
        </Card>

      </div>
    </PlatformLayout>
  );
};

export default EngagementPlannerPage;

