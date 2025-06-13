import { Skill } from '@/lib/ai/skillTagging';

export interface Course {
  id: string;
  title: string;
  description?: string;
  objectives?: string[];
  topics?: string[];
  keywords?: string[];
  durationHours?: number;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
  subcategory?: string;
  instructors?: {
    name: string;
    bio?: string;
    expertise?: string;
    image?: string;
  }[];
  rating?: number;
  reviewCount?: number;
  enrollmentCount?: number;
  completionRate?: number;
  lastUpdated?: string;
  language?: string;
  skills?: Skill[];
  prerequisites?: string[];
  certification?: boolean;
  price?: number;
  discountPrice?: number;
  imageUrl?: string;
  videoUrl?: string;
  url?: string;
  provider?: 'udemy' | 'internal' | 'linkedin' | 'coursera' | 'other';
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
  recommended?: boolean;
}
