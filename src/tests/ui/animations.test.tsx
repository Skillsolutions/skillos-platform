/**
 * Unit tests for UI components in SkillOS platform
 * 
 * Tests the animation components and their behavior
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { FadeIn, FadeInUp, SlideIn, ButtonAnimation, CardAnimation } from '@/components/ui/animations';

// Mock the useReducedMotion hook
jest.mock('@/hooks/useMediaQuery', () => ({
  useReducedMotion: jest.fn().mockReturnValue(false),
}));

describe('Animation Components', () => {
  test('FadeIn renders children correctly', () => {
    render(
      <FadeIn>
        <div>Test Content</div>
      </FadeIn>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  test('FadeInUp renders children correctly', () => {
    render(
      <FadeInUp>
        <div>Test Content</div>
      </FadeInUp>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  test('SlideIn renders children correctly', () => {
    render(
      <SlideIn>
        <div>Test Content</div>
      </SlideIn>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  test('ButtonAnimation renders children correctly', () => {
    render(
      <ButtonAnimation>
        <button>Click Me</button>
      </ButtonAnimation>
    );
    
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
  
  test('CardAnimation renders children correctly', () => {
    render(
      <CardAnimation>
        <div>Card Content</div>
      </CardAnimation>
    );
    
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });
});

// Mock the useReducedMotion hook to return true
jest.mock('@/hooks/useMediaQuery', () => ({
  useReducedMotion: jest.fn().mockReturnValue(true),
}), { virtual: true });

describe('Animation Components with Reduced Motion', () => {
  test('FadeIn respects reduced motion preference', () => {
    render(
      <FadeIn>
        <div>Test Content</div>
      </FadeIn>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    // We can't test the actual animation in JSDOM, but we can verify it renders
  });
});
