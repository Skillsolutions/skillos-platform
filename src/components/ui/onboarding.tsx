"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  element?: string; // CSS selector for the element to highlight
  position?: 'top' | 'right' | 'bottom' | 'left';
}

interface GuidedTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  tourId: string; // Unique identifier for this tour
}

/**
 * GuidedTour Component
 * 
 * A component that provides step-by-step guided tours of the application.
 * It highlights UI elements and provides explanations to help users learn
 * how to use the platform.
 */
export const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  tourId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  
  // Reset step when tour opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);
  
  // Handle highlighting the current element
  useEffect(() => {
    if (!isOpen || !steps[currentStep]?.element) {
      if (highlightedElement) {
        highlightedElement.classList.remove('guided-tour-highlight');
      }
      setHighlightedElement(null);
      return;
    }
    
    // Remove highlight from previous element
    if (highlightedElement) {
      highlightedElement.classList.remove('guided-tour-highlight');
    }
    
    // Add highlight to current element
    const element = document.querySelector(steps[currentStep].element!) as HTMLElement;
    if (element) {
      element.classList.add('guided-tour-highlight');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedElement(element);
    }
    
    return () => {
      if (highlightedElement) {
        highlightedElement.classList.remove('guided-tour-highlight');
      }
    };
  }, [currentStep, isOpen, steps]);
  
  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle tour completion
  const handleComplete = () => {
    // Save tour completion to localStorage
    const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
    if (!completedTours.includes(tourId)) {
      completedTours.push(tourId);
      localStorage.setItem('completedTours', JSON.stringify(completedTours));
    }
    
    onComplete();
    onClose();
  };
  
  // Handle tour skip
  const handleSkip = () => {
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{steps[currentStep]?.title}</DialogTitle>
          <DialogDescription>
            {steps[currentStep]?.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Skip tour
          </Button>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ContextualHelpProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * ContextualHelp Component
 * 
 * A component that provides contextual help tooltips for UI elements.
 * It shows a help icon that, when hovered or clicked, displays helpful
 * information about the feature.
 */
export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  title,
  description,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-64 p-4 mt-2 bg-gray-800 rounded-md shadow-lg border border-gray-700">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-white">{title}</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-300">{description}</p>
        </div>
      )}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * EmptyState Component
 * 
 * A component that provides helpful guidance when there is no data to display.
 * It shows a message and optional action to help users get started.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
};

/**
 * Check if a tour has been completed
 * @param tourId - Unique identifier for the tour
 * @returns Boolean indicating if the tour has been completed
 */
export const isTourCompleted = (tourId: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
  return completedTours.includes(tourId);
};

/**
 * Reset all completed tours
 */
export const resetAllTours = (): void => {
  localStorage.removeItem('completedTours');
};

export default {
  GuidedTour,
  ContextualHelp,
  EmptyState,
  isTourCompleted,
  resetAllTours
};
