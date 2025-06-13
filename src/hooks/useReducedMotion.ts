"use client";

import { useMediaQuery } from './useMediaQuery';

/**
 * Hook to detect if the user prefers reduced motion
 * This is used throughout the application to respect user preferences for animations
 * 
 * @returns boolean - true if the user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Hook to get appropriate animation duration based on user preferences
 * Returns 0 for users who prefer reduced motion, otherwise returns the provided duration
 * 
 * @param defaultDuration - The default animation duration in seconds
 * @returns number - 0 if reduced motion is preferred, otherwise the default duration
 */
export function useAnimationDuration(defaultDuration: number = 0.3): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? 0 : defaultDuration;
}
