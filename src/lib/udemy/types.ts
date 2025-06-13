/**
 * Udemy Business API Types
 * TypeScript definitions for Udemy Business API responses and data structures
 */

// Authentication Types
export interface UdemyAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  created_at: number;
}

export interface UdemyAuthRequest {
  client_id: string;
  client_secret: string;
  grant_type: 'client_credentials';
}

// Course Types
export interface UdemyCourse {
  id: number;
  title: string;
  url: string;
  is_paid: boolean;
  price: string;
  price_detail: {
    amount: number;
    currency: string;
    price_string: string;
    currency_symbol: string;
  };
  price_serve_tracking_id: string;
  visible_instructors: UdemyInstructor[];
  image_125_H: string;
  image_240x135: string;
  image_480x270: string;
  published_title: string;
  tracking_id: string;
  locale: {
    locale: string;
    title: string;
    english_title: string;
  };
  headline: string;
  num_subscribers: number;
  avg_rating: number;
  avg_rating_recent: number;
  rating: number;
  num_reviews: number;
  is_wishlisted: boolean;
  num_published_lectures: number;
  num_published_practice_tests: number;
  content_length_practice_test_questions: number;
  estimated_content_length: number;
  content_info: string;
  content_info_short: string;
  has_certificate: boolean;
  instructional_level: string;
  instructional_level_simple: string;
  content_length_video: number;
  has_closed_caption: boolean;
  caption_languages: string[];
  created: string;
  published_time: string;
  last_update_date: string;
  preview_url: string;
  learn_url: string;
  predictive_score: number;
  relevancy_score: number;
  input_features: string;
  lecture_search_result: any;
  curriculum_lectures: any[];
  order_in_results: number;
  curriculum_items: UdemyCurriculumItem[];
  objectives: string[];
  prerequisites: string[];
  target_audiences: string[];
  primary_category: UdemyCategory;
  primary_subcategory: UdemyCategory;
  all_course_categories: UdemyCategory[];
  visible_instructors_display_name: string;
  has_sufficient_preview_length: boolean;
  course_has_labels: boolean;
  is_recently_published: boolean;
  last_update_date_fuzzy: string;
  published_time_fuzzy: string;
  created_fuzzy: string;
  enrollment_time: string;
  is_enrolled: boolean;
  last_accessed_time: string;
  completion_ratio: number;
  archive_time: string;
  is_archived: boolean;
  is_deleted: boolean;
  favorite_time: string;
  is_favorite: boolean;
  features: {
    wishlist: boolean;
    wishlist_url: string;
    add_to_cart: boolean;
    add_to_cart_url: string;
    cache_buster: string;
    recommendations: boolean;
    left_nav: boolean;
    reviews: boolean;
  };
}

export interface UdemyInstructor {
  id: number;
  title: string;
  name: string;
  display_name: string;
  job_title: string;
  image_50x50: string;
  image_100x100: string;
  initials: string;
  url: string;
}

export interface UdemyCurriculumItem {
  id: number;
  title: string;
  description: string;
  object_index: number;
  asset: any;
  supplementary_assets: any[];
  is_published: boolean;
  sort_order: number;
  created: string;
  asset_type: string;
  estimated_content_length: number;
  data: any;
  course: number;
  last_watched_second: number;
}

export interface UdemyCategory {
  id: number;
  title: string;
  title_cleaned: string;
  url: string;
  icon_class: string;
  absolute_url: string;
}

// User Types
export interface UdemyUser {
  id: number;
  title: string;
  name: string;
  display_name: string;
  job_title: string;
  image_50x50: string;
  image_100x100: string;
  initials: string;
  url: string;
  email: string;
  is_banned: boolean;
  is_organization_eligible: boolean;
  organization_role: string;
  organization: UdemyOrganization;
  deactivated: string;
  last_seen: string;
  date_joined: string;
  locale: string;
  timezone: string;
  has_available_credits: boolean;
  purchase_requests: any[];
  job_role: string;
  department: string;
  employee_id: string;
  manager_email: string;
  custom_fields: Record<string, any>;
}

export interface UdemyOrganization {
  id: number;
  title: string;
  name: string;
  domain_name: string;
  logo_url: string;
  website: string;
  locale: string;
  currency: string;
  is_enterprise_china: boolean;
}

// Progress and Analytics Types
export interface UdemyUserCourseActivity {
  user: UdemyUser;
  course: UdemyCourse;
  enrollment_time: string;
  start_time: string;
  last_accessed_time: string;
  completion_time: string;
  completion_ratio: number;
  is_assigned: boolean;
  assignment_details: UdemyAssignmentDetails;
  estimated_content_length: number;
  time_spent: number;
  num_video_consumed_minutes: number;
  num_practice_activities_completed: number;
  num_practice_activities_incorrect: number;
  num_practice_activities_correct: number;
  is_enrolled: boolean;
  is_favorite: boolean;
  archive_time: string;
  is_archived: boolean;
}

export interface UdemyAssignmentDetails {
  assigned_by: UdemyUser;
  assignment_time: string;
  due_date: string;
  notes: string;
}

// Learning Path Types
export interface UdemyLearningPath {
  id: number;
  title: string;
  description: string;
  image_url: string;
  estimated_content_length: number;
  num_items: number;
  is_published: boolean;
  created: string;
  modified: string;
  organization: number;
  items: UdemyLearningPathItem[];
  enrollment_time: string;
  completion_time: string;
  completion_ratio: number;
  is_enrolled: boolean;
  is_assigned: boolean;
  assignment_details: UdemyAssignmentDetails;
}

export interface UdemyLearningPathItem {
  id: number;
  object_type: 'course' | 'assessment';
  object_id: number;
  sort_order: number;
  is_required: boolean;
  course?: UdemyCourse;
  assessment?: any;
}

// Search and Filter Types
export interface UdemyCourseSearchParams {
  search?: string;
  category?: string;
  subcategory?: string;
  instructional_level?: 'all' | 'beginner' | 'intermediate' | 'expert' | 'all_levels';
  duration?: 'extra_short' | 'short' | 'medium' | 'long' | 'extra_long';
  language?: string;
  price?: 'price-free' | 'price-paid';
  has_closed_caption?: boolean;
  has_coding_exercises?: boolean;
  has_quizzes?: boolean;
  sort?: 'relevance' | 'popularity' | 'rating' | 'newest' | 'price_low_to_high' | 'price_high_to_low';
  page?: number;
  page_size?: number;
}

export interface UdemyCourseSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UdemyCourse[];
  aggregations: {
    instructional_level: Array<{ key: string; doc_count: number }>;
    category: Array<{ key: string; doc_count: number }>;
    subcategory: Array<{ key: string; doc_count: number }>;
    language: Array<{ key: string; doc_count: number }>;
    duration: Array<{ key: string; doc_count: number }>;
    price: Array<{ key: string; doc_count: number }>;
    features: Array<{ key: string; doc_count: number }>;
  };
}

// API Response Types
export interface UdemyApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface UdemyApiError {
  detail: string;
  error_code?: string;
  field_errors?: Record<string, string[]>;
}

// Skills and Competency Types
export interface UdemySkill {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  related_courses: number[];
}

export interface UdemyCompetencyMapping {
  skill_id: number;
  course_id: number;
  relevance_score: number;
  learning_objectives: string[];
}

