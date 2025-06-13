"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  Loader2, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Plus, 
  Trash, 
  Edit, 
  Download, 
  Upload, 
  Settings, 
  User, 
  LogOut 
} from 'lucide-react';

/**
 * Component Library Documentation
 * 
 * This file serves as both documentation and a source of standardized component usage
 * throughout the SkillOS platform. It defines consistent styling, spacing, and usage
 * patterns for all common UI components.
 */

// Standard spacing values in pixels (converted to rem in actual usage)
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  xxl: '3rem',     // 48px
};

// Standard color palette
export const colors = {
  // Primary colors
  primary: {
    light: '#4B91F1',
    main: '#1A73E8',
    dark: '#0D47A1',
    contrast: '#FFFFFF',
  },
  // Secondary colors
  secondary: {
    light: '#B39DDB',
    main: '#673AB7',
    dark: '#4527A0',
    contrast: '#FFFFFF',
  },
  // Success colors
  success: {
    light: '#81C784',
    main: '#4CAF50',
    dark: '#2E7D32',
    contrast: '#FFFFFF',
  },
  // Error colors
  error: {
    light: '#E57373',
    main: '#F44336',
    dark: '#C62828',
    contrast: '#FFFFFF',
  },
  // Warning colors
  warning: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#EF6C00',
    contrast: '#000000',
  },
  // Info colors
  info: {
    light: '#64B5F6',
    main: '#2196F3',
    dark: '#0D47A1',
    contrast: '#FFFFFF',
  },
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    lightest: '#F5F5F5',
    lighter: '#E0E0E0',
    light: '#BDBDBD',
    medium: '#9E9E9E',
    dark: '#757575',
    darker: '#424242',
    darkest: '#212121',
    black: '#000000',
  },
  // Background colors
  background: {
    default: '#121212',
    paper: '#1E1E1E',
    elevated: '#2D2D2D',
  },
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    disabled: '#6C6C6C',
  },
};

// Standard border radius values
export const borderRadius = {
  none: '0',
  sm: '0.125rem',  // 2px
  md: '0.25rem',   // 4px
  lg: '0.5rem',    // 8px
  xl: '1rem',      // 16px
  full: '9999px',  // Fully rounded (for circles/pills)
};

// Standard shadow values
export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
};

// Standard transition values
export const transitions = {
  fast: '0.1s ease',
  normal: '0.2s ease',
  slow: '0.3s ease',
};

/**
 * Standard Button Variants
 */
export const ButtonExamples = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Primary Buttons</h3>
      <div className="flex flex-wrap gap-2">
        <Button>Default</Button>
        <Button variant="default" size="sm">Small</Button>
        <Button variant="default" size="lg">Large</Button>
        <Button variant="default" disabled>Disabled</Button>
        <Button variant="default">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading
        </Button>
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Secondary Buttons</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary" size="sm">Small</Button>
        <Button variant="secondary" size="lg">Large</Button>
        <Button variant="secondary" disabled>Disabled</Button>
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Outline Buttons</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline">Outline</Button>
        <Button variant="outline" size="sm">Small</Button>
        <Button variant="outline" size="lg">Large</Button>
        <Button variant="outline" disabled>Disabled</Button>
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Ghost Buttons</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost">Ghost</Button>
        <Button variant="ghost" size="sm">Small</Button>
        <Button variant="ghost" size="lg">Large</Button>
        <Button variant="ghost" disabled>Disabled</Button>
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Link Buttons</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="link">Link</Button>
        <Button variant="link" size="sm">Small</Button>
        <Button variant="link" size="lg">Large</Button>
        <Button variant="link" disabled>Disabled</Button>
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Destructive Buttons</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="destructive">Destructive</Button>
        <Button variant="destructive" size="sm">Small</Button>
        <Button variant="destructive" size="lg">Large</Button>
        <Button variant="destructive" disabled>Disabled</Button>
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Icon Buttons</h3>
      <div className="flex flex-wrap gap-2">
        <Button size="icon">
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

/**
 * Standard Card Variants
 */
export const CardExamples = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>This is a standard card with header, content, and footer.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card. It can contain text, images, or other components.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
    
    <Card className="border-blue-500 bg-blue-950/20">
      <CardHeader>
        <CardTitle>Highlighted Card</CardTitle>
        <CardDescription>This card has a colored border and background.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Use this style for cards that need to stand out or represent a specific category.</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">Metric Card</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">87%</div>
        <p className="text-green-500 flex items-center mt-2">
          <ChevronRight className="h-4 w-4 rotate-90" />
          12% from last month
        </p>
      </CardContent>
    </Card>
    
    <Card className="bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Glass Card</CardTitle>
        <CardDescription>A card with a glass-like effect.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This style works well for overlay cards or when placed on top of images.</p>
      </CardContent>
    </Card>
  </div>
);

/**
 * Standard Badge Variants
 */
export const BadgeExamples = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Default Badges</h3>
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Skill Badges</h3>
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-blue-600 hover:bg-blue-700">JavaScript</Badge>
        <Badge className="bg-green-600 hover:bg-green-700">React</Badge>
        <Badge className="bg-purple-600 hover:bg-purple-700">UI Design</Badge>
        <Badge className="bg-amber-600 hover:bg-amber-700">Leadership</Badge>
        <Badge className="bg-rose-600 hover:bg-rose-700">Communication</Badge>
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Status Badges</h3>
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>
        <Badge className="bg-amber-600 hover:bg-amber-700">In Progress</Badge>
        <Badge className="bg-blue-600 hover:bg-blue-700">Not Started</Badge>
        <Badge className="bg-red-600 hover:bg-red-700">Overdue</Badge>
        <Badge className="bg-gray-600 hover:bg-gray-700">Cancelled</Badge>
      </div>
    </div>
  </div>
);

/**
 * Standard Form Elements
 */
export const FormExamples = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Text Inputs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="default-input">Default Input</Label>
          <Input id="default-input" placeholder="Enter text here..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="disabled-input">Disabled Input</Label>
          <Input id="disabled-input" placeholder="Disabled input" disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="error-input">Input with Error</Label>
          <Input id="error-input" placeholder="Error state" className="border-red-500 focus-visible:ring-red-500" />
          <p className="text-sm text-red-500">This field is required</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="success-input">Input with Success</Label>
          <Input id="success-input" placeholder="Success state" className="border-green-500 focus-visible:ring-green-500" />
          <p className="text-sm text-green-500">Looks good!</p>
        </div>
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Input with Icon</h3>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input placeholder="Search..." className="pl-8" />
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Input with Button</h3>
      <div className="flex space-x-2">
        <Input placeholder="Enter email..." />
        <Button>Subscribe</Button>
      </div>
    </div>
  </div>
);

/**
 * Standard Alert Variants
 */
export const AlertExamples = () => (
  <div className="space-y-4">
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is an informational alert with neutral styling.
      </AlertDescription>
    </Alert>
    
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        This is an error alert with destructive styling.
      </AlertDescription>
    </Alert>
    
    <Alert className="border-yellow-600 bg-yellow-900/20 text-yellow-200">
      <AlertTriangle className="h-4 w-4 text-yellow-400" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        This is a warning alert with custom styling.
      </AlertDescription>
    </Alert>
    
    <Alert className="border-green-600 bg-green-900/20 text-green-200">
      <CheckCircle className="h-4 w-4 text-green-400" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        This is a success alert with custom styling.
      </AlertDescription>
    </Alert>
  </div>
);

/**
 * Standard Tab Variants
 */
export const TabExamples = () => (
  <Tabs defaultValue="overview" className="w-full">
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
      <TabsTrigger value="reports">Reports</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
    <TabsContent value="overview" className="p-4 border rounded-md mt-2">
      <h3 className="text-lg font-medium mb-2">Overview Content</h3>
      <p>This is the overview tab content.</p>
    </TabsContent>
    <TabsContent value="analytics" className="p-4 border rounded-md mt-2">
      <h3 className="text-lg font-medium mb-2">Analytics Content</h3>
      <p>This is the analytics tab content.</p>
    </TabsContent>
    <TabsContent value="reports" className="p-4 border rounded-md mt-2">
      <h3 className="text-lg font-medium mb-2">Reports Content</h3>
      <p>This is the reports tab content.</p>
    </TabsContent>
    <TabsContent value="settings" className="p-4 border rounded-md mt-2">
      <h3 className="text-lg font-medium mb-2">Settings Content</h3>
      <p>This is the settings tab content.</p>
    </TabsContent>
  </Tabs>
);

/**
 * Component Library Documentation Page
 */
export default function ComponentLibrary() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">SkillOS Component Library</h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">Buttons</h2>
          <p className="mb-4">Use these standardized button styles throughout the application.</p>
          <ButtonExamples />
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Cards</h2>
          <p className="mb-4">Cards are used to group related content and actions.</p>
          <CardExamples />
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Badges</h2>
          <p className="mb-4">Badges are used to highlight status, categories, or counts.</p>
          <BadgeExamples />
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Form Elements</h2>
          <p className="mb-4">Standardized form elements for consistent user input.</p>
          <FormExamples />
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Alerts</h2>
          <p className="mb-4">Alerts provide contextual feedback messages for user actions.</p>
          <AlertExamples />
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Tabs</h2>
          <p className="mb-4">Tabs organize content into separate views.</p>
          <TabExamples />
        </section>
      </div>
    </div>
  );
}
