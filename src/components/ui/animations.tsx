"use client";

import React, { ReactNode, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, Variants } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useMediaQuery';

interface FadeProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export const FadeIn = ({ children, duration = 0.3, delay = 0, className = '' }: FadeProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const FadeInUp = ({ children, duration = 0.3, delay = 0, className = '' }: FadeProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn = ({ children, duration = 0.3, delay = 0, className = '' }: FadeProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`page-transition-${Math.random()}`}
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

interface ButtonAnimationProps {
  children: ReactNode;
  className?: string;
}

export const ButtonAnimation = ({ children, className = '' }: ButtonAnimationProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface CardAnimationProps {
  children: ReactNode;
  className?: string;
}

export const CardAnimation = ({ children, className = '' }: CardAnimationProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : { y: -5, boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.2)' }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ListAnimationProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export const ListAnimation = ({ children, staggerDelay = 0.05, className = '' }: ListAnimationProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : index * staggerDelay }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

interface TabAnimationProps {
  children: ReactNode;
  isActive: boolean;
  className?: string;
}

export const TabAnimation = ({ children, isActive, className = '' }: TabAnimationProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: prefersReducedMotion ? 0 : 5 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// New animations for state changes

interface ProgressAnimationProps {
  children: ReactNode;
  value: number;
  duration?: number;
  className?: string;
}

export const ProgressAnimation = ({ children, value, duration = 1, className = '' }: ProgressAnimationProps) => {
  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimation();
  const prevValue = useRef(0);
  
  useEffect(() => {
    if (prefersReducedMotion) {
      controls.set({ width: `${value}%` });
      return;
    }
    
    controls.start({
      width: `${value}%`,
      transition: { duration, ease: "easeOut" }
    });
    
    prevValue.current = value;
  }, [value, duration, controls, prefersReducedMotion]);
  
  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ width: `${prevValue.current}%` }}
        animate={controls}
        className="absolute top-0 left-0 bottom-0"
      >
        {children}
      </motion.div>
    </div>
  );
};

interface CountAnimationProps {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
  className?: string;
}

export const CountAnimation = ({ value, duration = 1, formatter, className = '' }: CountAnimationProps) => {
  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimation();
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : 0);
  
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }
    
    let startTime: number;
    let startValue = displayValue;
    const endValue = value;
    
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentValue = Math.floor(startValue + progress * (endValue - startValue));
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    
    requestAnimationFrame(animateCount);
  }, [value, duration, prefersReducedMotion]);
  
  return (
    <span className={className}>
      {formatter ? formatter(displayValue) : displayValue}
    </span>
  );
};

interface DialogAnimationProps {
  children: ReactNode;
  isOpen: boolean;
  className?: string;
}

export const DialogAnimation = ({ children, isOpen, className = '' }: DialogAnimationProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  const variants: Variants = {
    hidden: prefersReducedMotion 
      ? { opacity: 0 } 
      : { opacity: 0, scale: 0.95, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 500 
      }
    },
    exit: prefersReducedMotion 
      ? { opacity: 0 } 
      : { 
          opacity: 0, 
          scale: 0.95, 
          y: 10,
          transition: { duration: 0.2 } 
        }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface FilterChangeAnimationProps {
  children: ReactNode;
  dependencies: any[];
  className?: string;
}

export const FilterChangeAnimation = ({ children, dependencies, className = '' }: FilterChangeAnimationProps) => {
  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimation();
  
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const animate = async () => {
      await controls.start({ opacity: 0.5, scale: 0.98, transition: { duration: 0.15 } });
      await controls.start({ opacity: 1, scale: 1, transition: { duration: 0.2 } });
    };
    
    animate();
  }, [...dependencies]);
  
  return (
    <motion.div
      animate={controls}
      initial={false}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface NotificationAnimationProps {
  children: ReactNode;
  isVisible: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

export const NotificationAnimation = ({ 
  children, 
  isVisible, 
  position = 'top-right', 
  className = '' 
}: NotificationAnimationProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  const getPositionVariants = (): Variants => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
      };
    }
    
    switch (position) {
      case 'top-right':
        return {
          hidden: { opacity: 0, x: 20, y: 0 },
          visible: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: 20, y: 0 }
        };
      case 'top-left':
        return {
          hidden: { opacity: 0, x: -20, y: 0 },
          visible: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: -20, y: 0 }
        };
      case 'bottom-right':
        return {
          hidden: { opacity: 0, x: 20, y: 0 },
          visible: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: 20, y: 0 }
        };
      case 'bottom-left':
        return {
          hidden: { opacity: 0, x: -20, y: 0 },
          visible: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: -20, y: 0 }
        };
      case 'top-center':
        return {
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 }
        };
      case 'bottom-center':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 20 }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={getPositionVariants()}
          transition={{ duration: 0.2 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Missing import
import { useState } from 'react';

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
