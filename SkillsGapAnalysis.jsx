"use client";

import React, { useState } from 'react';

export function SkillsGapAnalysis({ udemyConnector }) {
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  // Mock skills data
  const availableSkills = [
    { id: 'skill1', name: 'JavaScript', category: 'Development' },
    { id: 'skill2', name: 'Python', category: 'Development' },
    { id: 'skill3', name: 'Data Analysis', category: 'Data Science' },
    { id: 'skill4', name: 'Leadership', category: 'Management' },
    { id: 'skill5', name: 'Communication', category: 'Soft Skills' },
    { id: 'skill6', name: 'Project Management', category: 'Management' },
    { id: 'skill7', name: 'UX Design', category: 'Design' },
    { id: 'skill8', name: 'Digital Marketing', category: 'Marketing' }
  ];

  // Handle skill selection
  const handleSkillSelect = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  // Get recommendations based on selected skills
  const getRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call the Udemy API
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock recommendations
      const mockRecommendations = [
        {
          id: 'course1',
          title: 'Advanced JavaScript',
          headline: 'Take your JavaScript skills to the next level',
          image_480x270: '/images/courses/advanced-js.jpg',
          rating: 4.8,
          num_reviews: 950,
          content_info: '10 hours',
          instructors: [{ name: 'JavaScript Expert' }],
          skills: ['JavaScript'],
          source: 'udemy'
        },
        {
          id: 'course2',
          title: 'Python for Data Analysis',
          headline: 'Learn how to analyze data with Python',
          image_480x270: '/images/courses/python-data.jpg',
          rating: 4.7,
          num_reviews: 820,
          content_info: '8 hours',
          instructors: [{ name: 'Data Analyst Pro' }],
          skills: ['Python', 'Data Analysis'],
          source: 'udemy'
        },
        {
          id: 'course3',
          title: 'Leadership Essentials',
          headline: 'Core skills for effective leadership',
          image_480x270: '/images/courses/leadership.jpg',
          rating: 4.9,
          num_reviews: 1200,
          content_info: '6 hours',
          instructors: [{ name: 'Leadership Coach' }],
          skills: ['Leadership', 'Communication'],
          source: 'internal'
        }
      ];
      
      setRecommendations(mockRecommendations);
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skills-gap-analysis">
      <h2 className="text-2xl font-bold mb-6">Skills Gap Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-4">Select Skills to Develop</h3>
            
            <div className="space-y-3">
              {availableSkills.map(skill => (
                <div key={skill.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={skill.id}
                    checked={selectedSkills.includes(skill.id)}
                    onChange={() => handleSkillSelect(skill.id)}
                    className="mr-2"
                  />
                  <label htmlFor={skill.id} className="flex-grow">
                    {skill.name}
                  </label>
                  <span className="text-xs text-gray-500">{skill.category}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={getRecommendations}
              disabled={selectedSkills.length === 0 || loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
            </button>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-4">Recommended Courses</h3>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map(course => (
                    <div key={course.id} className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 bg-gray-100">
                          <div className="h-full flex items-center justify-center p-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-blue-600">85%</div>
                              <div className="text-sm text-gray-500">Match</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3 p-4">
                          <div className="flex justify-between">
                            <h4 className="font-bold">{course.title}</h4>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {course.source === 'udemy' ? 'Udemy Business' : 'Internal'}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">{course.headline}</p>
                          
                          <div className="flex items-center mt-2 text-sm">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>{course.rating}</span>
                            <span className="text-gray-500 ml-1">({course.num_reviews} reviews)</span>
                            <span className="mx-2">•</span>
                            <span>{course.content_info}</span>
                          </div>
                          
                          <div className="mt-3">
                            <div className="text-xs text-gray-500 mb-1">Relevant Skills:</div>
                            <div className="flex flex-wrap gap-1">
                              {course.skills.map(skill => (
                                <span key={skill} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm">
                            View Course
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Select skills and click "Get Recommendations" to see courses that match your needs.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
