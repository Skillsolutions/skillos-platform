/**
 * Udemy Business API Client for SkillOS
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface UdemyClientConfig {
  clientId: string;
  clientSecret: string;
  organizationId?: string;
  baseUrl?: string;
}

export class UdemyClient {
  private client: AxiosInstance;
  private config: UdemyClientConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: UdemyClientConfig) {
    this.config = {
      baseUrl: 'https://api.udemy.com/organizations',
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    } );

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      async (config) => {
        // Ensure we have a valid token
        if (!this.accessToken || Date.now() > this.tokenExpiry) {
          await this.authenticate();
        }

        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Authenticate with Udemy Business API
   */
  private async authenticate(): Promise<void> {
    try {
      const response = await axios.post(
        'https://api.udemy.com/oauth2/token',
        {
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          scope: 'read write',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
       );

      this.accessToken = response.data.access_token;
      // Set expiry to 5 minutes before actual expiry to be safe
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
    } catch (error) {
      console.error('Failed to authenticate with Udemy Business API:', error);
      throw new Error('Authentication failed');
    }
  }

  /**
   * Make a GET request to the Udemy Business API
   */
  async get(path: string, params?: Record<string, any>): Promise<any> {
    try {
      const config: AxiosRequestConfig = {};
      if (params) {
        config.params = params;
      }

      const response = await this.client.get(path, config);
      return response.data;
    } catch (error) {
      console.error(`Failed to GET ${path}:`, error);
      throw error;
    }
  }

  /**
   * Make a POST request to the Udemy Business API
   */
  async post(path: string, data: any): Promise<any> {
    try {
      const response = await this.client.post(path, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to POST ${path}:`, error);
      throw error;
    }
  }

  /**
   * Make a PUT request to the Udemy Business API
   */
  async put(path: string, data: any): Promise<any> {
    try {
      const response = await this.client.put(path, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to PUT ${path}:`, error);
      throw error;
    }
  }

  /**
   * Make a DELETE request to the Udemy Business API
   */
  async delete(path: string): Promise<any> {
    try {
      const response = await this.client.delete(path);
      return response.data;
    } catch (error) {
      console.error(`Failed to DELETE ${path}:`, error);
      throw error;
    }
  }

  /**
   * Get organization information
   */
  async getOrganizationInfo() {
    const response = await this.get('/organizations/me/');
    return {
      id: response.id,
      name: response.name,
      // Add any other fields you need
    };
  }

  /**
   * Get all courses
   */
  async getCourses(params?: Record<string, any>): Promise<any> {
    return this.get('/courses/', params);
  }

  /**
   * Get course details
   */
  async getCourse(courseId: string): Promise<any> {
    return this.get(`/courses/${courseId}/`);
  }

  /**
   * Get all users
   */
  async getUsers(params?: Record<string, any>): Promise<any> {
    return this.get('/users/', params);
  }

  /**
   * Get user details
   */
  async getUser(userId: string): Promise<any> {
    return this.get(`/users/${userId}/`);
  }

  /**
   * Get all groups
   */
  async getGroups(params?: Record<string, any>): Promise<any> {
    return this.get('/groups/', params);
  }

  /**
   * Get group details
   */
  async getGroup(groupId: string): Promise<any> {
    return this.get(`/groups/${groupId}/`);
  }

  /**
   * Get all enrollments
   */
  async getEnrollments(params?: Record<string, any>): Promise<any> {
    return this.get('/enrollments/', params);
  }

  /**
   * Get user enrollments
   */
  async getUserEnrollments(userId: string, params?: Record<string, any>): Promise<any> {
    return this.get(`/users/${userId}/enrollments/`, params);
  }

  /**
   * Get course analytics
   */
  async getCourseAnalytics(courseId: string, params?: Record<string, any>): Promise<any> {
    return this.get(`/courses/${courseId}/analytics/`, params);
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(userId: string, params?: Record<string, any>): Promise<any> {
    return this.get(`/users/${userId}/analytics/`, params);
  }
}

/**
 * Create a new Udemy Business API client
 */
export function createUdemyClient(config: UdemyClientConfig): UdemyClient {
  return new UdemyClient(config);
}
