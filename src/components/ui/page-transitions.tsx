"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { PageTransition } from '@/components/ui/animations';
import { useReducedMotion } from '@/hooks/useMediaQuery';

interface PageWrapperProps {
  children: React.ReactNode;
  transitionType?: 'fade' | 'slide' | 'scale' | 'none';
}

/**
 * PageWrapper component that adds smooth page transitions
 * This component should wrap the main content of each page
 */
export const PageWrapper = ({ 
  children, 
  transitionType = 'fade' 
}: PageWrapperProps) => {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  
  // Skip animations if reduced motion is preferred
  if (prefersReducedMotion || transitionType === 'none') {
    return <>{children}</>;
  }
  
  // Define different transition variants
  const getVariants = (): Variants => {
    switch (transitionType) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case 'slide':
        return {
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.96 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.96 }
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
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={getVariants()}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Higher-order component to add page transitions to any page component
 * Fixed generic type constraints to properly handle component props
 */
export function withPageTransition<T extends object>(
  Component: React.ComponentType<T>, 
  transitionType: 'fade' | 'slide' | 'scale' | 'none' = 'fade'
) {
  // Use React.FC with generic type to ensure proper props handling
  return function WithPageTransition(props: T) {
    return (
      <PageWrapper transitionType={transitionType}>
        <Component {...(props as React.ComponentProps<typeof Component>)} />
      </PageWrapper>
    );
  };
}

/**
 * Hook to detect navigation direction for directional transitions
 */
export const useNavigationDirection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [prevPathname, setPrevPathname] = useState<string | null>(null);
  
  useEffect(() => {
    if (prevPathname) {
      // Simple heuristic: if current path is shorter, assume going back
      // This could be enhanced with actual browser history tracking
      if (pathname.length < prevPathname.length) {
        setDirection('backward');
      } else {
        setDirection('forward');
      }
    }
    
    setPrevPathname(pathname);
  }, [pathname]);
  
  return direction;
};

/**
 * Directional page transition component that animates based on navigation direction
 */
export const DirectionalPageTransition = ({ children }: { children: React.ReactNode }) => {
  const direction = useNavigationDirection();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <>{children}</>;
  }
  
  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      x: direction === 'forward' ? 20 : -20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      x: direction === 'forward' ? -20 : 20,
      transition: {
        duration: 0.2
      }
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Hook to add scroll animations to elements as they enter the viewport
 */
export const useScrollAnimation = (ref: React.RefObject<HTMLElement>, threshold = 0.1) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold]);
};

/**
 * Hook to add staggered animations to a list of elements
 */
export const useStaggeredAnimation = (refs: React.RefObject<HTMLElement>[], staggerDelay = 0.1) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, index * staggerDelay * 1000);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    
    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [refs, staggerDelay]);
};

/**
 * Hook to add hover animations to an element
 */
export const useHoverAnimation = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const element = ref.current;
    
    const handleMouseEnter = () => {
      element.classList.add('hover-animate');
    };
    
    const handleMouseLeave = () => {
      element.classList.remove('hover-animate');
    };
    
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref]);
};

/**
 * TabTransition component for smooth tab content transitions
 */
export const TabTransition = ({ children, visible }: { children: React.ReactNode, visible: boolean }) => {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return visible ? <>{children}</> : null;
  }
  
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * BreadcrumbTransition component for smooth breadcrumb updates
 */
export const BreadcrumbTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <>{children}</>;
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
