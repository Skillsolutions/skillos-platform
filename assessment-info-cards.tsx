import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info, AlertTriangle, Clock, Users, Brain, BarChart, FileText, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AssessmentInfoCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  benefits: string[];
  useCases: string[];
  timeToComplete: string;
  onClick: (id: string) => void;
}

export const AssessmentInfoCard = ({
  id,
  title,
  description,
  icon,
  color,
  benefits,
  useCases,
  timeToComplete,
  onClick
}: AssessmentInfoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card 
      className={`border-2 transition-all ${isHovered ? `border-${color}-500 shadow-lg` : "border-gray-200"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className={`bg-${color}-100 dark:bg-${color}-900/30`}>
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-full bg-${color}-500/20`}>
            {icon}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">More info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-2">
                  <p className="font-medium">About {title}</p>
                  <p className="text-sm">{description}</p>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {timeToComplete} to complete
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {isHovered && (
            <>
              <div>
                <h4 className="text-sm font-medium mb-2">Benefits</h4>
                <ul className="text-sm space-y-1">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Use Cases</h4>
                <ul className="text-sm space-y-1">
                  {useCases.map((useCase, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-500 shrink-0 mt-0.5" />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          {!isHovered && (
            <p className="text-sm text-center text-muted-foreground">
              Hover for more details or click below to select
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <Button 
          onClick={() => onClick(id)}
          variant={isHovered ? "default" : "outline"}
          className={isHovered ? `bg-${color}-500 hover:bg-${color}-600` : ""}
        >
          Select This Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};

export const assessmentInfoData = [
  {
    id: "360-feedback",
    title: "360-Degree Feedback",
    description: "Collect feedback from peers, managers, and direct reports",
    icon: <Users className="h-6 w-6 text-blue-500" />,
    color: "blue",
    benefits: [
      "Provides a well-rounded view of performance",
      "Identifies blind spots in self-perception",
      "Promotes open communication and feedback culture"
    ],
    useCases: [
      "Leadership development programs",
      "Performance reviews",
      "Team building initiatives"
    ],
    timeToComplete: "15-20 minutes"
  },
  {
    id: "technical-skills",
    title: "Technical Skills Test",
    description: "Evaluate specific technical competencies and knowledge",
    icon: <Brain className="h-6 w-6 text-purple-500" />,
    color: "purple",
    benefits: [
      "Objectively measures technical proficiency",
      "Identifies skill gaps for targeted training",
      "Validates learning from technical courses"
    ],
    useCases: [
      "Role readiness evaluation",
      "Technical certification preparation",
      "Project team formation"
    ],
    timeToComplete: "30-45 minutes"
  },
  {
    id: "skills-gap",
    title: "Skills Gap Analysis",
    description: "Identify gaps between current and required skill levels",
    icon: <BarChart className="h-6 w-6 text-green-500" />,
    color: "green",
    benefits: [
      "Aligns employee development with business needs",
      "Prioritizes training investments",
      "Creates targeted individual development plans"
    ],
    useCases: [
      "Annual development planning",
      "Career progression mapping",
      "Organizational capability assessment"
    ],
    timeToComplete: "25-30 minutes"
  },
  {
    id: "learning-retention",
    title: "Learning Retention Quiz",
    description: "Measure knowledge retention after training or courses",
    icon: <FileText className="h-6 w-6 text-amber-500" />,
    color: "amber",
    benefits: [
      "Reinforces key learning points",
      "Measures training effectiveness",
      "Identifies areas needing reinforcement"
    ],
    useCases: [
      "Post-training evaluation",
      "Compliance knowledge verification",
      "Spaced learning reinforcement"
    ],
    timeToComplete: "10-15 minutes"
  },
  {
    id: "soft-skills",
    title: "Soft Skills Assessment",
    description: "Evaluate communication, collaboration, and adaptability",
    icon: <Zap className="h-6 w-6 text-rose-500" />,
    color: "rose",
    benefits: [
      "Highlights interpersonal strengths and weaknesses",
      "Improves team dynamics and collaboration",
      "Develops future leaders and managers"
    ],
    useCases: [
      "Leadership potential identification",
      "Team role assignment",
      "Communication skills development"
    ],
    timeToComplete: "20-25 minutes"
  }
];
