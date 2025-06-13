"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Lightbulb, Briefcase } from 'lucide-react';

// Interfaces (can be moved to a types file)
interface Skill {
  id: string;
  name: string;
  category: string; // e.g., Technical, Soft Skill
}

interface Competency {
  id: string;
  name: string;
  description: string;
  type: 'Behavioral' | 'Technical' | 'Leadership' | 'Other';
}

interface Course {
  id: string;
  title: string;
  provider: string;
  relatedSkills: string[]; // Array of Skill IDs
  relatedCompetencies: string[]; // Array of Competency IDs
}

interface JobRole {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[]; // Array of Skill IDs
  requiredCompetencies: string[]; // Array of Competency IDs
}

interface User {
  id: string;
  name: string;
  currentSkills: string[]; // Array of Skill IDs
  currentCompetencies: string[]; // Array of Competency IDs
  jobRoleId?: string; // Optional: current job role ID
}

// Mock Data (replace with API calls in a real application)
const mockSkills: Skill[] = [
  { id: 's1', name: 'Python Programming', category: 'Technical' },
  { id: 's2', name: 'Data Analysis', category: 'Technical' },
  { id: 's3', name: 'Communication', category: 'Soft Skill' },
  { id: 's4', name: 'Project Management', category: 'Soft Skill' },
  { id: 's5', name: 'Cloud Computing (AWS)', category: 'Technical' },
  { id: 's6', name: 'Cybersecurity Fundamentals', category: 'Technical' },
  { id: 's7', name: 'Leadership', category: 'Soft Skill' },
];

const mockCompetencies: Competency[] = [
  { id: 'c1', name: 'Strategic Thinking', description: 'Ability to plan and execute long-term goals.', type: 'Leadership' },
  { id: 'c2', name: 'Problem Solving', description: 'Identifying and resolving complex issues.', type: 'Behavioral' },
  { id: 'c3', name: 'Software Development Lifecycle (SDLC)', description: 'Understanding of SDLC phases.', type: 'Technical' },
  { id: 'c4', name: 'Client Relationship Management', description: 'Building and maintaining client relations.', type: 'Behavioral' },
];

const mockCourses: Course[] = [
  { id: 'course1', title: 'Advanced Python for Data Science', provider: 'Coursera', relatedSkills: ['s1', 's2'], relatedCompetencies: ['c2'] },
  { id: 'course2', title: 'AWS Certified Solutions Architect - Associate', provider: 'AWS Training', relatedSkills: ['s5'], relatedCompetencies: ['c3'] },
  { id: 'course3', title: 'Effective Communication in the Workplace', provider: 'Internal Workshop', relatedSkills: ['s3'], relatedCompetencies: ['c4'] },
  { id: 'course4', title: 'Cybersecurity for Beginners', provider: 'Cybrary', relatedSkills: ['s6'], relatedCompetencies: [] },
  { id: 'course5', title: 'Introduction to Project Management', provider: 'Udemy', relatedSkills: ['s4'], relatedCompetencies: ['c1'] },
];

const mockJobRoles: JobRole[] = [
  { id: 'jr1', title: 'Software Engineer', description: 'Designs, develops, and maintains software systems.', requiredSkills: ['s1', 's3', 's5'], requiredCompetencies: ['c2', 'c3'] },
  { id: 'jr2', title: 'Data Scientist', description: 'Analyzes complex data sets to derive insights.', requiredSkills: ['s1', 's2'], requiredCompetencies: ['c2'] },
  { id: 'jr3', title: 'IT Project Manager', description: 'Leads and manages IT projects.', requiredSkills: ['s3', 's4'], requiredCompetencies: ['c1', 'c4'] },
  { id: 'jr4', title: 'Cybersecurity Analyst (New Joiner)', description: 'Monitors and protects information systems.', requiredSkills: ['s6'], requiredCompetencies: [] }, 
];

const mockUsers: User[] = [
    { id: 'user1', name: 'Alice Smith', currentSkills: ['s1'], currentCompetencies: [], jobRoleId: 'jr1' },
    { id: 'user2', name: 'Bob Johnson (New Joiner)', currentSkills: [], currentCompetencies: [], jobRoleId: 'jr4' },
    { id: 'user3', name: 'Carol Williams (Cybersecurity Team)', currentSkills: ['s6'], currentCompetencies: [], jobRoleId: 'jr4' },
];

const JobRoleManager = () => {
  const [jobRoles, setJobRoles] = useState<JobRole[]>(mockJobRoles);
  const [skills] = useState<Skill[]>(mockSkills);
  const [competencies] = useState<Competency[]>(mockCompetencies);
  const [courses] = useState<Course[]>(mockCourses);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const [showJobRoleForm, setShowJobRoleForm] = useState(false);
  const [currentJobRole, setCurrentJobRole] = useState<Partial<JobRole>>({});
  const [editingJobRoleId, setEditingJobRoleId] = useState<string | null>(null);

  const [selectedUserForTagging, setSelectedUserForTagging] = useState<string | null>(null);
  const [skillToTag, setSkillToTag] = useState<string | null>(null);
  const [coursesForSelectedSkill, setCoursesForSelectedSkill] = useState<Course[]>([]);

  const [recommendationTarget, setRecommendationTarget] = useState<'new_joiner' | 'cybersecurity_team' | null>(null);
  const [recommendedLearningPaths, setRecommendedLearningPaths] = useState<Course[]>([]);

  // CRUD for Job Roles
  const handleAddJobRole = () => {
    setCurrentJobRole({ requiredSkills: [], requiredCompetencies: [] });
    setEditingJobRoleId(null);
    setShowJobRoleForm(true);
  };

  const handleEditJobRole = (role: JobRole) => {
    setCurrentJobRole(role);
    setEditingJobRoleId(role.id);
    setShowJobRoleForm(true);
  };

  const handleDeleteJobRole = (id: string) => {
    setJobRoles(jobRoles.filter(jr => jr.id !== id));
  };

  const handleSaveJobRole = () => {
    if (!currentJobRole.title) return; // Basic validation
    if (editingJobRoleId) {
      setJobRoles(jobRoles.map(jr => jr.id === editingJobRoleId ? { ...jr, ...currentJobRole } as JobRole : jr));
    } else {
      setJobRoles([...jobRoles, { ...currentJobRole, id: `jr_${Date.now()}` } as JobRole]);
    }
    setShowJobRoleForm(false);
    setCurrentJobRole({});
    setEditingJobRoleId(null);
  };

  // Skill Tagging & Course Display
  useEffect(() => {
    if (skillToTag) {
      const relevantCourses = courses.filter(course => 
        course.relatedSkills.includes(skillToTag) || 
        course.relatedCompetencies.some(() => {
            // This is a simplification; ideally, skills would be linked to competencies more directly
            // For now, let's assume if a course is related to a competency, and that competency is often found with the skill, it's relevant.
            return true; // Simplified logic
        })
      );
      setCoursesForSelectedSkill(relevantCourses);
    } else {
      setCoursesForSelectedSkill([]);
    }
  }, [skillToTag, courses, competencies]);

  const handleTagSkillToUser = () => {
    if (selectedUserForTagging && skillToTag) {
      setUsers(users.map(user => 
        user.id === selectedUserForTagging 
          ? { ...user, currentSkills: Array.from(new Set([...user.currentSkills, skillToTag])) } 
          : user
      ));
      alert(`Skill tagged to user. Courses related to this skill are shown below.`);
    }
  };

  // Recommendation System Logic (Simplified)
  const generateRecommendations = (target: 'new_joiner' | 'cybersecurity_team') => {
    let path: Course[] = [];
    if (target === 'new_joiner') {
      // Example: Recommend foundational courses
      path = courses.filter(c => c.title.toLowerCase().includes('intro') || c.title.toLowerCase().includes('fundamentals') || c.title.toLowerCase().includes('beginners'));
    } else if (target === 'cybersecurity_team') {
      // Example: Recommend cybersecurity-specific courses
      path = courses.filter(c => c.relatedSkills.includes('s6') || c.title.toLowerCase().includes('cyber'));
    }
    setRecommendedLearningPaths(path.slice(0, 3)); // Show top 3 recommendations
    setRecommendationTarget(target);
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Job Role Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5" /> Job Role Repository</CardTitle>
          <CardDescription>Define and manage job roles, required skills, and competencies.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAddJobRole} className="mb-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Job Role
          </Button>
          {showJobRoleForm && (
              <div className="mb-6 p-4 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{editingJobRoleId ? 'Edit' : 'Add New'} Job Role</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="roleTitle" className="block text-sm font-medium mb-1">Title</label>
                    <Input id="roleTitle" value={currentJobRole.title || ''} onChange={(e) => setCurrentJobRole({ ...currentJobRole, title: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="roleDesc" className="block text-sm font-medium mb-1">Description</label>
                    <Textarea id="roleDesc" value={currentJobRole.description || ''} onChange={(e) => setCurrentJobRole({ ...currentJobRole, description: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Required Skills</label>
                    <Select
                      onValueChange={(value) => {
                          const currentSkills = currentJobRole.requiredSkills || [];
                          if (!currentSkills.includes(value)) {
                              setCurrentJobRole({ ...currentJobRole, requiredSkills: [...currentSkills, value] })
                          }
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Add a skill..." /></SelectTrigger>
                      <SelectContent>
                        {skills.map(skill => (
                          <SelectItem key={skill.id} value={skill.id} disabled={currentJobRole.requiredSkills?.includes(skill.id)}>{skill.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 space-x-1">
                      {currentJobRole.requiredSkills?.map(skillId => {
                          const skill = skills.find(s => s.id === skillId);
                          return skill ? <Button key={skillId} variant="outline" size="sm" onClick={() => setCurrentJobRole({...currentJobRole, requiredSkills: currentJobRole.requiredSkills?.filter(id => id !== skillId)})}>{skill.name} &times;</Button> : null;
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Required Competencies</label>
                     <Select
                      onValueChange={(value) => {
                          const currentComps = currentJobRole.requiredCompetencies || [];
                          if (!currentComps.includes(value)) {
                              setCurrentJobRole({ ...currentJobRole, requiredCompetencies: [...currentComps, value] })
                          }
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Add a competency..." /></SelectTrigger>
                      <SelectContent>
                        {competencies.map(comp => (
                          <SelectItem key={comp.id} value={comp.id} disabled={currentJobRole.requiredCompetencies?.includes(comp.id)}>{comp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 space-x-1">
                      {currentJobRole.requiredCompetencies?.map(compId => {
                          const comp = competencies.find(c => c.id === compId);
                          return comp ? <Button key={compId} variant="outline" size="sm" onClick={() => setCurrentJobRole({...currentJobRole, requiredCompetencies: currentJobRole.requiredCompetencies?.filter(id => id !== compId)})}>{comp.name} &times;</Button> : null;
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setShowJobRoleForm(false)}>Cancel</Button>
                  <Button onClick={handleSaveJobRole}>Save Job Role</Button>
                </div>
              </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Competencies</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{role.description}</TableCell>
                  <TableCell className="text-xs">{role.requiredSkills.map(id => skills.find(s=>s.id===id)?.name).join(', ')}</TableCell>
                  <TableCell className="text-xs">{role.requiredCompetencies.map(id => competencies.find(c=>c.id===id)?.name).join(', ')}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEditJobRole(role)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteJobRole(role.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {jobRoles.length === 0 && <p className="text-center text-muted-foreground mt-4">No job roles defined yet.</p>}
        </CardContent>
      </Card>

      {/* Section 2: Skill Tagging & Course Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">Skill Tagging & Course Discovery</CardTitle>
          <CardDescription>Tag skills to users and see relevant courses.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="user-select" className="block text-sm font-medium mb-1">Select User</label>
            <Select onValueChange={setSelectedUserForTagging}>
              <SelectTrigger><SelectValue placeholder="Select a user..." /></SelectTrigger>
              <SelectContent>
                {users.map(user => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {selectedUserForTagging && (
                <p className="text-xs mt-1 text-muted-foreground">Current skills: {users.find(u=>u.id === selectedUserForTagging)?.currentSkills.map(sId => skills.find(s=>s.id === sId)?.name).join(', ') || 'None'}</p>
            )}
          </div>
          <div>
            <label htmlFor="skill-select" className="block text-sm font-medium mb-1">Select Skill to Tag</label>
            <Select onValueChange={setSkillToTag}>
              <SelectTrigger><SelectValue placeholder="Select a skill..." /></SelectTrigger>
              <SelectContent>
                {skills.map(skill => <SelectItem key={skill.id} value={skill.id}>{skill.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button onClick={handleTagSkillToUser} disabled={!selectedUserForTagging || !skillToTag}>Tag Skill to User</Button>
          </div>
          {coursesForSelectedSkill.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Recommended Courses for Selected Skill</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coursesForSelectedSkill.map(course => (
                  <Card key={course.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">{course.title}</CardTitle>
                      <CardDescription>{course.provider}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs">Related Skills: {course.relatedSkills.map(id => skills.find(s=>s.id===id)?.name).join(', ')}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: Learning Path Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5" /> Learning Path Recommendations</CardTitle>
          <CardDescription>Generate learning paths for specific user groups.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button onClick={() => generateRecommendations('new_joiner')} variant="outline">
              Generate for New Joiners
            </Button>
            <Button onClick={() => generateRecommendations('cybersecurity_team')} variant="outline">
              Generate for Cybersecurity Team
            </Button>
          </div>
          
          {recommendationTarget && (
            <div>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p className="text-center text-muted-foreground mt-4">Are you sure you want to create a "{recommendationTarget === 'new_joiner' ? 'New Joiner' : 'Cybersecurity Team'}" learning path?</p>
                <div className="flex justify-center space-x-4 mt-4">
                  <Button variant="outline" onClick={() => setRecommendationTarget(null)}>Cancel</Button>
                  <Button>Confirm & Create Path</Button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Recommended Learning Path</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedLearningPaths.map((course, index) => (
                  <Card key={course.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Step {index + 1}: {course.title}</CardTitle>
                      <CardDescription>{course.provider}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs">Related Skills: {course.relatedSkills.map(id => skills.find(s=>s.id===id)?.name).join(', ')}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {recommendedLearningPaths.length === 0 && <p className="text-center text-muted-foreground">No suitable courses found for this learning path.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobRoleManager;
