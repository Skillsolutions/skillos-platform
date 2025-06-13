"use client";

import React, { useState, useEffect } from 'react';
import { UdemyConnector } from '../../../lib/udemy/connector';

// Analytics Dashboard component for SkillOS platform
export function AnalyticsDashboard({ udemyConnector }) {
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [organization, setOrganization] = useState('all');
  const [department, setDepartment] = useState('all');
  const [team, setTeam] = useState('all');
  const [error, setError] = useState(null);

  // Load analytics data when filters change
  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, organization, department, team]);

  // Fetch analytics data from Udemy API
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert date range to actual dates
      let startDate, endDate;
      const today = new Date();
      
      switch (dateRange) {
        case 'last7days':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 7);
          endDate = today;
          break;
        case 'last30days':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 30);
          endDate = today;
          break;
        case 'last90days':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 90);
          endDate = today;
          break;
        case 'lastYear':
          startDate = new Date(today);
          startDate.setFullYear(today.getFullYear() - 1);
          endDate = today;
          break;
        default:
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 30);
          endDate = today;
      }
      
      // Format dates for API
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      // Get analytics data from Udemy API
      const params = {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      };
      
      const data = await udemyConnector.getAnalytics(params);
      
      // Process data for display
      // In a real implementation, we would filter by org/dept/team here
      
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle export analytics data
  const handleExport = (format) => {
    if (!analyticsData) return;
    
    try {
      // In a real implementation, we would generate the export file
      // For now, just show a success message
      alert(`Analytics data exported as ${format.toUpperCase()}`);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data. Please try again.');
    }
  };

  return (
    <div className="analytics-dashboard">
      <h2 className="text-2xl font-bold mb-6">Learning Analytics</h2>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select 
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="last90days">Last 90 Days</option>
          <option value="lastYear">Last Year</option>
        </select>
        
        <select 
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Organizations</option>
          <option value="org1">Organization 1</option>
          <option value="org2">Organization 2</option>
        </select>
        
        <select 
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Departments</option>
          <option value="engineering">Engineering</option>
          <option value="marketing">Marketing</option>
          <option value="sales">Sales</option>
          <option value="hr">Human Resources</option>
        </select>
        
        <select 
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Teams</option>
          <option value="team1">Team 1</option>
          <option value="team2">Team 2</option>
          <option value="team3">Team 3</option>
        </select>
        
        <div className="ml-auto">
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              id="export-menu"
              aria-expanded="true"
              aria-haspopup="true"
            >
              Export
              <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="export-menu">
                <button
                  onClick={() => handleExport('csv')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Export as Excel
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
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
        /* Analytics dashboard */
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-3xl font-bold">500</p>
              <p className="text-sm text-green-600 mt-2">↑ 12% from previous period</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Active Learners</h3>
              <p className="text-3xl font-bold">350</p>
              <p className="text-sm text-green-600 mt-2">↑ 8% from previous period</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Course Enrollments</h3>
              <p className="text-3xl font-bold">1,200</p>
              <p className="text-sm text-green-600 mt-2">↑ 15% from previous period</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Course Completions</h3>
              <p className="text-3xl font-bold">450</p>
              <p className="text-sm text-green-600 mt-2">↑ 5% from previous period</p>
            </div>
          </div>
          
          {/* Charts and tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course engagement chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Course Engagement</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Course engagement chart would appear here</p>
              </div>
            </div>
            
            {/* Learning hours chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Learning Hours</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Learning hours chart would appear here</p>
              </div>
            </div>
          </div>
          
          {/* Top courses table */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-4">Top Courses</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollments
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">JavaScript Fundamentals</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Udemy
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      120
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      85
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      4.8
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Python for Data Science</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Udemy
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      95
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      42
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      4.7
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Leadership Fundamentals</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Internal
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      85
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      60
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      4.9
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
