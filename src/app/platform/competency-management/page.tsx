"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface Competency {
  id: string;
  name: string;
  description: string;
  type: 'Behavioral' | 'Technical' | 'Leadership' | 'Other';
}

interface JobRole {
  id: string;
  title: string;
  description: string;
  linkedCompetencies: string[]; // Array of Competency IDs
}

const CompetencyManagement = () => {
  const [competencies, setCompetencies] = useState<Competency[]>([
    { id: 'c1', name: 'Communication', description: 'Effective communication skills', type: 'Behavioral' },
    { id: 'c2', name: 'Teamwork', description: 'Ability to work well in a team', type: 'Behavioral' },
    { id: 'c3', name: 'Problem Solving', description: 'Analytical and problem-solving skills', type: 'Technical' },
  ]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([
    { id: 'jr1', title: 'Software Engineer', description: 'Develops software applications', linkedCompetencies: ['c3'] },
    { id: 'jr2', title: 'Project Manager', description: 'Manages project timelines', linkedCompetencies: ['c1', 'c2'] },
  ]);

  const [showCompetencyForm, setShowCompetencyForm] = useState(false);
  const [currentCompetency, setCurrentCompetency] = useState<Partial<Competency>>({});
  const [editingCompetencyId, setEditingCompetencyId] = useState<string | null>(null);

  const [showJobRoleForm, setShowJobRoleForm] = useState(false);
  const [currentJobRole, setCurrentJobRole] = useState<Partial<JobRole>>({});
  const [editingJobRoleId, setEditingJobRoleId] = useState<string | null>(null);

  const handleAddCompetency = () => {
    setCurrentCompetency({});
    setEditingCompetencyId(null);
    setShowCompetencyForm(true);
  };

  const handleEditCompetency = (competency: Competency) => {
    setCurrentCompetency(competency);
    setEditingCompetencyId(competency.id);
    setShowCompetencyForm(true);
  };

  const handleDeleteCompetency = (id: string) => {
    setCompetencies(competencies.filter(c => c.id !== id));
    // Also remove from any job roles
    setJobRoles(prevRoles => 
        prevRoles.map(role => ({
            ...role,
            linkedCompetencies: role.linkedCompetencies.filter(compId => compId !== id)
        }))
    );
  };

  const handleSaveCompetency = () => {
    if (!currentCompetency.name || !currentCompetency.type) return; // Basic validation

    if (editingCompetencyId) {
      setCompetencies(competencies.map(c => c.id === editingCompetencyId ? { ...c, ...currentCompetency } as Competency : c));
    } else {
      setCompetencies([...competencies, { ...currentCompetency, id: `comp_${Date.now()}` } as Competency]);
    }
    setShowCompetencyForm(false);
    setCurrentCompetency({});
    setEditingCompetencyId(null);
  };

  const handleAddJobRole = () => {
    setCurrentJobRole({ linkedCompetencies: [] });
    setEditingJobRoleId(null);
    setShowJobRoleForm(true);
  };

  const handleEditJobRole = (jobRole: JobRole) => {
    setCurrentJobRole(jobRole);
    setEditingJobRoleId(jobRole.id);
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
      setJobRoles([...jobRoles, { ...currentJobRole, id: `role_${Date.now()}`, linkedCompetencies: currentJobRole.linkedCompetencies || [] } as JobRole]);
    }
    setShowJobRoleForm(false);
    setCurrentJobRole({});
    setEditingJobRoleId(null);
  };

  const handleLinkCompetencyToRole = (roleId: string, competencyId: string) => {
    setJobRoles(prevRoles => prevRoles.map(role => {
      if (role.id === roleId) {
        const newLinkedCompetencies = role.linkedCompetencies ? [...role.linkedCompetencies] : [];
        if (!newLinkedCompetencies.includes(competencyId)) {
          newLinkedCompetencies.push(competencyId);
        }
        return { ...role, linkedCompetencies: newLinkedCompetencies };
      }
      return role;
    }));
  };

  const handleUnlinkCompetencyFromRole = (roleId: string, competencyId: string) => {
    setJobRoles(prevRoles => prevRoles.map(role => {
      if (role.id === roleId) {
        return { ...role, linkedCompetencies: role.linkedCompetencies.filter(id => id !== competencyId) };
      }
      return role;
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Competency Management</CardTitle>
          <CardDescription>Define and manage competencies for your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAddCompetency} className="mb-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Competency
          </Button>
          {showCompetencyForm && (
            <div className="mb-4 p-4 border rounded-md">
              <h3 className="text-lg font-semibold mb-2">{editingCompetencyId ? 'Edit' : 'Add New'} Competency</h3>
              <div className="space-y-2">
                <div>
                  <label htmlFor="compName" className="block text-sm font-medium text-gray-700">Name</label>
                  <Input id="compName" value={currentCompetency.name || ''} onChange={(e) => setCurrentCompetency({ ...currentCompetency, name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="compDesc" className="block text-sm font-medium text-gray-700">Description</label>
                  <Textarea id="compDesc" value={currentCompetency.description || ''} onChange={(e) => setCurrentCompetency({ ...currentCompetency, description: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="compType" className="block text-sm font-medium text-gray-700">Type</label>
                  <Select value={currentCompetency.type || ''} onValueChange={(value) => setCurrentCompetency({ ...currentCompetency, type: value as Competency['type'] })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Behavioral">Behavioral</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Leadership">Leadership</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCompetencyForm(false)}>Cancel</Button>
                  <Button onClick={handleSaveCompetency}>Save Competency</Button>
                </div>
              </div>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competencies.map((comp) => (
                <TableRow key={comp.id}>
                  <TableCell>{comp.name}</TableCell>
                  <TableCell>{comp.type}</TableCell>
                  <TableCell className="max-w-xs truncate">{comp.description}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEditCompetency(comp)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCompetency(comp.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {competencies.length === 0 && <p className="text-center text-gray-500 mt-4">No competencies defined yet.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Role Management</CardTitle>
          <CardDescription>Define job roles and link them to competencies.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAddJobRole} className="mb-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Job Role
          </Button>
          {showJobRoleForm && (
            <div className="mb-4 p-4 border rounded-md">
              <h3 className="text-lg font-semibold mb-2">{editingJobRoleId ? 'Edit' : 'Add New'} Job Role</h3>
              <div className="space-y-2">
                <div>
                  <label htmlFor="roleTitle" className="block text-sm font-medium text-gray-700">Title</label>
                  <Input id="roleTitle" value={currentJobRole.title || ''} onChange={(e) => setCurrentJobRole({ ...currentJobRole, title: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="roleDesc" className="block text-sm font-medium text-gray-700">Description</label>
                  <Textarea id="roleDesc" value={currentJobRole.description || ''} onChange={(e) => setCurrentJobRole({ ...currentJobRole, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Link Competencies</label>
                  {competencies.map(comp => (
                    <div key={comp.id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`comp-check-${comp.id}`}
                        checked={currentJobRole.linkedCompetencies?.includes(comp.id) || false}
                        onChange={(e) => {
                          const competencyId = comp.id;
                          const isChecked = e.target.checked;
                          setCurrentJobRole(prev => {
                            const currentLinked = prev.linkedCompetencies || [];
                            if (isChecked) {
                              return { ...prev, linkedCompetencies: [...currentLinked, competencyId] };
                            } else {
                              return { ...prev, linkedCompetencies: currentLinked.filter(id => id !== competencyId) };
                            }
                          });
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`comp-check-${comp.id}`}>{comp.name}</label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowJobRoleForm(false)}>Cancel</Button>
                  <Button onClick={handleSaveJobRole}>Save Job Role</Button>
                </div>
              </div>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Linked Competencies</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{role.description}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {role.linkedCompetencies.map(compId => {
                        const comp = competencies.find(c => c.id === compId);
                        return comp ? <li key={compId}>{comp.name}</li> : null;
                      })}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEditJobRole(role)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteJobRole(role.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {jobRoles.length === 0 && <p className="text-center text-gray-500 mt-4">No job roles defined yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetencyManagement;

