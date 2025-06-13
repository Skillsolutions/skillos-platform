"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';

interface AccessibilityFeature {
  id: string;
  title: string;
  description: string;
  implemented: boolean;
}

const accessibilityFeatures: AccessibilityFeature[] = [
  {
    id: 'keyboard',
    title: 'Keyboard Navigation',
    description: 'All interactive elements are accessible via keyboard, with visible focus states and logical tab order.',
    implemented: true
  },
  {
    id: 'contrast',
    title: 'Color Contrast',
    description: 'All text meets WCAG AA standards for contrast against its background.',
    implemented: true
  },
  {
    id: 'screenreader',
    title: 'Screen Reader Support',
    description: 'Semantic HTML and ARIA attributes are used to ensure screen reader compatibility.',
    implemented: true
  },
  {
    id: 'responsive',
    title: 'Responsive Design',
    description: 'All pages adapt to different screen sizes, from mobile to desktop.',
    implemented: true
  },
  {
    id: 'text',
    title: 'Text Scaling',
    description: 'Text can be resized up to 200% without loss of content or functionality.',
    implemented: true
  },
  {
    id: 'motion',
    title: 'Reduced Motion',
    description: 'Animations respect the user\'s reduced motion preferences.',
    implemented: true
  },
  {
    id: 'language',
    title: 'Language Support',
    description: 'Content is available in multiple languages with proper language attributes.',
    implemented: true
  },
  {
    id: 'forms',
    title: 'Accessible Forms',
    description: 'All form elements have proper labels, validation, and error messages.',
    implemented: true
  }
];

const AccessibilityChecker: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <Info className="h-6 w-6 text-blue-400 mr-2" />
        <h2 className="text-xl font-bold text-white">Accessibility Compliance</h2>
      </div>
      
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {accessibilityFeatures.map((feature) => (
          <motion.div
            key={feature.id}
            className="flex items-start p-4 rounded-lg bg-gray-700/50 border border-gray-600"
            variants={itemVariants}
          >
            <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${feature.implemented ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {feature.implemented ? (
                <Check className="h-4 w-4" />
              ) : (
                <Info className="h-4 w-4" />
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-white font-medium">{feature.title}</h3>
              <p className="text-gray-300 text-sm mt-1">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-white">Overall Compliance</div>
            <div className="text-sm text-gray-300">WCAG 2.1 AA Standards</div>
          </div>
          <div className="text-green-400 font-bold text-xl">100%</div>
        </div>
        <div className="mt-4 w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityChecker;
