"use client";

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from './toast';

/**
 * Form Validation Utilities
 * 
 * This file provides standardized form validation patterns and components
 * for consistent form handling throughout the SkillOS platform.
 */

/**
 * Common validation schemas
 */
export const validationSchemas = {
  // Email validation
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  
  // Password validation (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number)
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  
  // Name validation (2-50 chars, letters, spaces, hyphens, apostrophes)
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Name can only contain letters, spaces, hyphens, and apostrophes" }),
  
  // URL validation
  url: z.string()
    .url({ message: "Invalid URL format" })
    .optional()
    .or(z.literal('')),
  
  // Phone number validation (simple format check)
  phone: z.string()
    .regex(/^\+?[0-9\s()-]{7,20}$/, { message: "Invalid phone number format" })
    .optional()
    .or(z.literal('')),
  
  // Date validation (YYYY-MM-DD format)
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format" }),
};

/**
 * Example Form Component with Validation
 */
export const ExampleValidatedForm = () => {
  const { addToast } = useToast();
  
  // Define form schema
  const formSchema = z.object({
    name: validationSchemas.name,
    email: validationSchemas.email,
    password: validationSchemas.password,
    bio: z.string().min(10, { message: "Bio must be at least 10 characters" }).max(500, { message: "Bio must be less than 500 characters" }),
    role: z.string().min(1, { message: "Please select a role" }),
    agreeTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions" })
  });
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      bio: "",
      role: "",
      agreeTerms: false
    },
  });
  
  // Form submission handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    addToast({
      title: "Form submitted successfully",
      description: "Your information has been saved.",
      type: "success"
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                Enter your full name as it appears on official documents.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Email field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormDescription>
                We'll never share your email with anyone else.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Password field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormDescription>
                Must be at least 8 characters with uppercase, lowercase, and numbers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Bio field */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us a little about yourself..." 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A brief description about yourself (10-500 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Role field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="learner">Learner</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select your role in the organization.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Terms checkbox */}
        <FormField
          control={form.control}
          name="agreeTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the terms and conditions
                </FormLabel>
                <FormDescription>
                  You must agree to our terms and conditions to continue.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        {/* Submit button */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

/**
 * Form validation utility functions
 */
export const formUtils = {
  /**
   * Format validation errors for display
   * @param errors - Validation errors object
   * @returns Formatted error messages
   */
  formatErrors: (errors: Record<string, any>) => {
    return Object.entries(errors).reduce((acc, [key, value]) => {
      acc[key] = value.message;
      return acc;
    }, {} as Record<string, string>);
  },
  
  /**
   * Check if a form has any validation errors
   * @param errors - Validation errors object
   * @returns Boolean indicating if form has errors
   */
  hasErrors: (errors: Record<string, any>) => {
    return Object.keys(errors).length > 0;
  }
};

export default {
  validationSchemas,
  ExampleValidatedForm,
  formUtils
};
