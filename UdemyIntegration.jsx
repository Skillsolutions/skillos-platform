"use client";

import React, { useState, useEffect } from 'react';
import { UdemyConnector } from '../../../lib/udemy/connector';

// SkillOS Course Catalogue integration with Udemy Business API
export default function UdemyIntegration() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    skillLevel: '',
    duration: '',
    source: 'udemy' // Default to Udemy source
  });
  const [error, setError] = useState(null);

  // Initialize the Udemy connector
  const udemyConnector = new UdemyConnector({
    // Config will be loaded from environment variables in production
    mockMode: process.env.NODE_ENV !== 'production'
  });

  // Load courses on component mount and when filters change
  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        setError(null);
        
        // Initialize the connector if needed
        if (!udemyConnector.auth.token) {
          await udemyConnector.initialize();
        }
        
        // Search for courses with current filters
        const searchParams = {
          query: searchQuery,
          categoryIds: filters.category ? [filters.category] : [],
          // Map SkillOS skill levels to Udemy filter parameters
          skillLevel: filters.skillLevel
        };
        
        const results = await udemyConnector.searchCourses(searchParams);
        setCourses(results.items || []);
      } catch (err) {
        console.error('Error loading Udemy courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadCourses();
  }, [searchQuery, filters]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Generate SSO URL for course launch
  const handleCourseLaunch = async (courseId) => {
    try {
      // In a real implementation, we would get the actual user ID
      const userId = 'current_user_id';
      const ssoUrl = await udemyConnector.generateCourseSSO(courseId, userId);
      
      // Open the course in a new tab
      window.open(ssoUrl, '_blank');
    } catch (err) {
      console.error('Error launching course:', err);
      setError('Failed to launch course. Please try again.');
    }
  };

  return (
    <div className="udemy-integration">
      <h2 className="text-2xl font-bold mb-6">Udemy Business Courses</h2>
      
      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search Udemy courses..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 p-2 border rounded"
          />
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setSearchQuery(searchQuery)}
          >
            Search
          </button>
        </div>
        
        <div className="flex gap-4">
          <select 
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="development">Development</option>
            <option value="business">Business</option>
            <option value="it-and-software">IT & Software</option>
            <option value="data-science">Data Science</option>
          </select>
          
          <select 
            value={filters.skillLevel}
            onChange={(e) => handleFilterChange('skillLevel', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Advanced</option>
          </select>
          
          <select 
            value={filters.duration}
            onChange={(e) => handleFilterChange('duration', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Any Duration</option>
            <option value="short">0-3 Hours</option>
            <option value="medium">3-6 Hours</option>
            <option value="long">6+ Hours</option>
          </select>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        /* Course grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course.id} className="border rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={course.image_480x270} 
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{course.headline}</p>
                  
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{course.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({course.num_reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>{course.content_info}</span>
                    <span className="mx-2">•</span>
                    <span>{course.instructors[0]?.name}</span>
                  </div>
                  
                  <button
                    onClick={() => handleCourseLaunch(course.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                  >
                    Launch Course
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">No courses found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
