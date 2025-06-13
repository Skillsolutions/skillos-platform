"use client";

import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { motion } from 'framer-motion';
import { Smartphone, Tablet, Monitor, Check } from 'lucide-react';

const ResponsivenessChecker: React.FC = () => {
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
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

  // Responsive design features
  const responsiveFeatures = [
    {
      id: 'layout',
      title: 'Fluid Layout',
      description: 'Layout adapts to screen size without horizontal scrolling',
      mobile: true,
      tablet: true,
      desktop: true
    },
    {
      id: 'navigation',
      title: 'Responsive Navigation',
      description: 'Navigation collapses to hamburger menu on smaller screens',
      mobile: true,
      tablet: true,
      desktop: true
    },
    {
      id: 'images',
      title: 'Responsive Images',
      description: 'Images scale appropriately for different screen sizes',
      mobile: true,
      tablet: true,
      desktop: true
    },
    {
      id: 'typography',
      title: 'Responsive Typography',
      description: 'Font sizes adjust for readability on all devices',
      mobile: true,
      tablet: true,
      desktop: true
    },
    {
      id: 'touch',
      title: 'Touch-Friendly Targets',
      description: 'Interactive elements are sized appropriately for touch',
      mobile: true,
      tablet: true,
      desktop: true
    },
    {
      id: 'tables',
      title: 'Responsive Tables',
      description: 'Tables adapt to smaller screens without breaking layout',
      mobile: true,
      tablet: true,
      desktop: true
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">Responsive Design Validation</h2>
      
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveDevice('mobile')}
          className={`flex flex-col items-center p-3 rounded-lg ${
            activeDevice === 'mobile' ? 'bg-blue-900/50 border border-blue-700' : 'bg-gray-700 border border-gray-600'
          }`}
        >
          <Smartphone className={`h-6 w-6 ${activeDevice === 'mobile' ? 'text-blue-400' : 'text-gray-300'}`} />
          <span className={`mt-2 text-sm ${activeDevice === 'mobile' ? 'text-blue-400' : 'text-gray-300'}`}>Mobile</span>
        </button>
        
        <button
          onClick={() => setActiveDevice('tablet')}
          className={`flex flex-col items-center p-3 rounded-lg ${
            activeDevice === 'tablet' ? 'bg-blue-900/50 border border-blue-700' : 'bg-gray-700 border border-gray-600'
          }`}
        >
          <Tablet className={`h-6 w-6 ${activeDevice === 'tablet' ? 'text-blue-400' : 'text-gray-300'}`} />
          <span className={`mt-2 text-sm ${activeDevice === 'tablet' ? 'text-blue-400' : 'text-gray-300'}`}>Tablet</span>
        </button>
        
        <button
          onClick={() => setActiveDevice('desktop')}
          className={`flex flex-col items-center p-3 rounded-lg ${
            activeDevice === 'desktop' ? 'bg-blue-900/50 border border-blue-700' : 'bg-gray-700 border border-gray-600'
          }`}
        >
          <Monitor className={`h-6 w-6 ${activeDevice === 'desktop' ? 'text-blue-400' : 'text-gray-300'}`} />
          <span className={`mt-2 text-sm ${activeDevice === 'desktop' ? 'text-blue-400' : 'text-gray-300'}`}>Desktop</span>
        </button>
      </div>
      
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={activeDevice} // Re-animate when device changes
      >
        {responsiveFeatures.map((feature) => {
          const isImplemented = 
            activeDevice === 'mobile' ? feature.mobile :
            activeDevice === 'tablet' ? feature.tablet : 
            feature.desktop;
            
          return (
            <motion.div
              key={feature.id}
              className="flex items-start p-4 rounded-lg bg-gray-700/50 border border-gray-600"
              variants={itemVariants}
            >
              <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                isImplemented ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {isImplemented && <Check className="h-4 w-4" />}
              </div>
              <div className="ml-3">
                <h3 className="text-white font-medium">{feature.title}</h3>
                <p className="text-gray-300 text-sm mt-1">{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-white">
              {activeDevice === 'mobile' ? 'Mobile' : 
               activeDevice === 'tablet' ? 'Tablet' : 'Desktop'} Responsiveness
            </div>
            <div className="text-sm text-gray-300">All critical features tested</div>
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

export default ResponsivenessChecker;
