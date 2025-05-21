"use client";

import PlatformLayout from "@/components/platform/PlatformLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AIBuilderPage = () => {
  return (
    <PlatformLayout title="AI Assessment Builder">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Assessment</CardTitle>
            <CardDescription>Use AI to generate assessments based on various criteria.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="assessmentName">Assessment Name</Label>
              <Input id="assessmentName" placeholder="e.g., Q3 Software Engineering Skills Test" />
            </div>
            <div>
              <Label htmlFor="assessmentDescription">Description/Purpose</Label>
              <Textarea id="assessmentDescription" placeholder="Briefly describe this assessment." />
            </div>

            <RadioGroup defaultValue="roleBased" className="space-y-2">
              <Label>Generation Method</Label>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="roleBased" id="roleBased" />
                <Label htmlFor="roleBased">Based on Job Role</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="projectBased" id="projectBased" />
                <Label htmlFor="projectBased">Based on Project Requirements</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="skillBased" id="skillBased" />
                <Label htmlFor="skillBased">Based on Specific Skills</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="udemyBased" id="udemyBased" />
                <Label htmlFor="udemyBased">Based on Udemy Course Content</Label>
              </div>
            </RadioGroup>

            {/* Placeholder for conditional inputs based on generation method */}
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="text-sm text-gray-500">Conditional input fields for the selected generation method will appear here (e.g., Role Name, Project Description, Skills List, Udemy Course URL).</p>
            </div>

            <div>
              <Label>Question Types to Include</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="mcq" />
                  <Label htmlFor="mcq">Multiple Choice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="trueFalse" />
                  <Label htmlFor="trueFalse">True/False</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="scenario" />
                  <Label htmlFor="scenario">Scenario-based</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="shortAnswer" />
                  <Label htmlFor="shortAnswer">Short Answer (AI Evaluated)</Label>
                </div>
              </div>
            </div>
            <Button>Generate Assessment Preview</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Saved Assessments</CardTitle>
            <CardDescription>Manage your previously created assessments.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for list of saved assessments */}
            <div className="p-4 border rounded-md bg-gray-50 text-center">
              <p className="text-sm text-gray-500">A list of saved assessments will appear here, with options to edit, delete, assign, or view results.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PlatformLayout>
  );
};

export default AIBuilderPage;

