"use client";

import React, { useState, useEffect } from 'react';
import { UdemyConnector } from '../../../lib/udemy/connector';

// Skills Gap Analysis component for SkillOS platform
export function SkillsGapAnalysis({ udemyConnector }) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState(null);

  // Load user skills on component mount
  useEffect(() => {
    // Mock user skills for demonstration
    const mockUserSkills = [
      { id: 'javascript', name: 'JavaScript', proficiency: 'intermediate' },
      { id: 'react', name: 'React', proficiency: 'beginner' },
      { id: 'python', name: 'Python', proficiency: 'advanced' },
      { id: 'data-analysis', name: 'Data Analysis', proficiency: 'beginner' },
      { id: 'leadership', name: 'Leadership', proficiency: 'intermediate' },
      { id: 'communication', name: 'Communication', proficiency: 'advanced' },
      { id: 'project-management', name: 'Project Management', proficiency: 'intermediate' },
      { id: 'machine-learning', name: 'Machine Learning', proficiency: 'beginner' }
    ];
    
    setUserSkills(mockUserSkills);
  }, []);

  // Toggle skill selection
  const toggleSkillSelection = (skillId) => {
    setSelectedSkills(prev => {
      if (prev.includes(skillId)) {
        return prev.filter(id => id !== skillId);
      } else {
        return [...prev, skillId];
      }
    });
  };

  // Get course recommendations based on selected skills
  const getRecommendations = async () => {
    if (selectedSkills.length === 0) {
      setError('Please select at least one skill to get recommendations.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, we would get the actual user ID
      const userId = 'current_user_id';
      
      // Get recommendations from Udemy API
      const results = await udemyConnector.getRecommendations(userId, selectedSkills);
      
      // Add source property to identify Udemy courses
      const udemyRecommendations = results.map(course => ({
        ...course,
        source: 'udemy'
      }));
      
      setRecommendations(udemyRecommendations);
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError('Failed to get course recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle course launch
  const handleCourseLaunch = async (course) => {
    try {
      // In a real implementation, we would get the actual user ID
      const userId = 'current_user_id';
      const ssoUrl = await udemyConnector.generateCourseSSO(course.id, userId);
      
      // Open the course in a new tab
      window.open(ssoUrl, '_blank');
    } catch (err) {
      console.error('Error launching course:', err);
      setError('Failed to launch course. Please try again.');
    }
  };

  return (
    <div className="skills-gap-analysis">
      <h2 className="text-2xl font-bold mb-6">Skills Gap Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skills selection panel */}
        <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Select Skills to Develop</h3>
          
          <div className="space-y-3 mb-6">
            {userSkills.map(skill => (
              <div key={skill.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`skill-${skill.id}`}
                  checked={selectedSkills.includes(skill.id)}
                  onChange={() => toggleSkillSelection(skill.id)}
                  className="mr-2"
                />
                <label htmlFor={`skill-${skill.id}`} className="flex-1">
                  {skill.name}
                </label>
                <span className={`text-xs px-2 py-1 rounded ${
                  skill.proficiency === 'beginner' ? 'bg-red-100 text-red-800' :
                  skill.proficiency === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {skill.proficiency}
                </span>
              </div>
            ))}
          </div>
          
          <button
            onClick={getRecommendations}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:bg-blue-300"
          >
            {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
          </button>
        </div>
        
        {/* Recommendations panel */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Recommended Courses</h3>
          
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
            /* Recommendations list */
            <div className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map(course => (
                  <div key={course.id} className="border rounded-lg overflow-hidden shadow-sm flex">
                    <img 
                      src={course.image_480x270} 
                      alt={course.title}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="p-4 flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold">{course.title}</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {course.source === 'udemy' ? 'Udemy Business' : 'Internal'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm my-1">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{course.rating}</span>
                        <span className="mx-2">•</span>
                        <span>{course.content_info}</span>
                      </div>
                      
                      <div className="flex justify-between items-end mt-2">
                        <div className="text-xs">
                          <span className="font-semibold">Skills match: </span>
                          {course.skillMatch?.join(', ')}
                        </div>
                        <button
                          onClick={() => handleCourseLaunch(course)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded"
                        >
                          Launch Course
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    {selectedSkills.length > 0 
                      ? 'No recommendations found. Try selecting different skills.'
                      : 'Select skills to get personalized course recommendations.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
