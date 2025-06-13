"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronRight, 
  CheckCircle, 
  Play, 
  Users, 
  BarChart, 
  Award, 
  BookOpen,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [activeTab, setActiveTab] = useState('hr');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroTranslateY = useTransform(scrollY, [0, 300], [0, -50]);
  
  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Chief Learning Officer",
      company: "Global Tech Solutions",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      quote: "SkillOS has transformed how we approach learning and development. The skill gap analysis and personalized learning paths have increased course completion rates by 47%."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "HR Director",
      company: "Innovate Financial",
      image: "https://randomuser.me/api/portraits/men/54.jpg",
      quote: "The ROI analytics and competency management features have made it easy to demonstrate the value of our L&D initiatives to executives. A game-changer for our organization."
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Talent Development Manager",
      company: "Horizon Healthcare",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      quote: "The AI-powered skill recommendations and learning path suggestions have helped us upskill our workforce efficiently. Our employees love the personalized experience."
    }
  ];
  
  // Stats
  const stats = [
    { id: 1, value: "87%", label: "Increase in course completion rates" },
    { id: 2, value: "42%", label: "Reduction in skill gaps" },
    { id: 3, value: "3.2x", label: "Return on learning investment" },
    { id: 4, value: "68%", label: "Improvement in employee retention" }
  ];
  
  // Features
  const features = [
    {
      id: 1,
      title: "AI-Powered Skill Mapping",
      description: "Automatically map courses to skills using advanced AI and established frameworks like SFIA and O*NET.",
      icon: <BookOpen className="h-12 w-12 text-blue-500" />
    },
    {
      id: 2,
      title: "Personalized Learning Paths",
      description: "Create custom learning journeys based on role requirements, existing skills, and career aspirations.",
      icon: <Award className="h-12 w-12 text-green-500" />
    },
    {
      id: 3,
      title: "Comprehensive Analytics",
      description: "Gain insights into learning effectiveness, skill development, and ROI with powerful reporting tools.",
      icon: <BarChart className="h-12 w-12 text-purple-500" />
    },
    {
      id: 4,
      title: "Team Collaboration",
      description: "Foster collaborative learning with team-based goals, challenges, and shared resources.",
      icon: <Users className="h-12 w-12 text-amber-500" />
    }
  ];
  
  return (
    <div className="bg-gray-900 text-gray-50 min-h-screen">
      {/* Header */}
      <header className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-500">
                SkillOS
              </Link>
              <nav className="hidden md:flex ml-10 space-x-8">
                <Link href="#features" className="text-gray-300 hover:text-gray-50 transition">
                  Features
                </Link>
                <Link href="#solutions" className="text-gray-300 hover:text-gray-50 transition">
                  Solutions
                </Link>
                <Link href="#testimonials" className="text-gray-300 hover:text-gray-50 transition">
                  Testimonials
                </Link>
                <Link href="#pricing" className="text-gray-300 hover:text-gray-50 transition">
                  Pricing
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-300 hover:text-gray-50 transition">
                Log in
              </Link>
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-gray-50 px-4 py-2 rounded-md transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden"
        style={{ opacity: heroOpacity, y: heroTranslateY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Transform Your Workforce with AI-Powered Learning
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              SkillOS helps organizations identify skill gaps, create personalized learning paths, and measure the impact of learning initiatives.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Request Demo <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 hover:bg-gray-800 text-gray-200">
                Watch Overview <Play className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Video Modal */}
        {isVideoPlaying && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <button 
              className="absolute top-4 right-4 text-gray-50 hover:text-gray-300"
              onClick={() => setIsVideoPlaying(false)}
            >
              <X className="h-8 w-8" />
            </button>
            <div className="relative pb-[56.25%] h-0 w-full max-w-4xl">
              <iframe 
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="SkillOS Overview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <motion.div 
                key={stat.id}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Learning</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              SkillOS combines AI technology with proven learning methodologies to deliver a comprehensive platform for skill development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <motion.div 
                key={feature.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Solutions for Every Role</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Whether you're in HR, L&D, or leadership, SkillOS provides tailored solutions to meet your specific needs.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex flex-wrap border-b border-gray-700 mb-8">
              <button 
                className={`px-6 py-3 font-medium ${activeTab === 'hr' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('hr')}
              >
                HR Leaders
              </button>
              <button 
                className={`px-6 py-3 font-medium ${activeTab === 'ld' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('ld')}
              >
                L&D Teams
              </button>
              <button 
                className={`px-6 py-3 font-medium ${activeTab === 'managers' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('managers')}
              >
                Team Managers
              </button>
              <button 
                className={`px-6 py-3 font-medium ${activeTab === 'employees' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('employees')}
              >
                Employees
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
              {activeTab === 'hr' && (
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">HR Leaders</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Align learning initiatives with organizational goals</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Track and measure the ROI of learning programs</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Identify and address critical skill gaps</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Support succession planning with skill-based insights</span>
                      </li>
                    </ul>
                    <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                      Learn More
                    </Button>
                  </div>
                  <div className="md:w-1/2">
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                        alt="HR Leaders using SkillOS" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'ld' && (
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">L&D Teams</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Create and manage personalized learning paths</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Track engagement and completion metrics</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Curate and recommend relevant content</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Generate comprehensive learning reports</span>
                      </li>
                    </ul>
                    <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                      Learn More
                    </Button>
                  </div>
                  <div className="md:w-1/2">
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                        alt="L&D Teams using SkillOS" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'managers' && (
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">Team Managers</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Monitor team skill development progress</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Assign targeted learning to address skill gaps</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Receive recommendations for team development</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Track learning application in daily work</span>
                      </li>
                    </ul>
                    <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                      Learn More
                    </Button>
                  </div>
                  <div className="md:w-1/2">
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                        alt="Team Managers using SkillOS" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'employees' && (
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">Employees</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Access personalized learning recommendations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Track progress toward career goals</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Discover relevant learning opportunities</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Showcase skills and achievements</span>
                      </li>
                    </ul>
                    <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                      Learn More
                    </Button>
                  </div>
                  <div className="md:w-1/2">
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                        alt="Employees using SkillOS" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join hundreds of organizations that are transforming their learning and development with SkillOS.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div 
                key={testimonial.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that's right for your organization's size and needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <div className="text-3xl font-bold mb-4">$5<span className="text-lg text-gray-400">/user/mo</span></div>
                <p className="text-gray-400 mb-6">Perfect for small teams getting started with structured learning.</p>
                <Button className="w-full bg-gray-700 hover:bg-gray-600">
                  Get Started
                </Button>
              </div>
              <div className="border-t border-gray-700 p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Up to 50 users</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Basic skill mapping</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Standard reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Email support</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Professional Plan */}
            <div className="bg-gray-900 border-2 border-blue-500 rounded-lg overflow-hidden transform md:scale-105 z-10 shadow-xl">
              <div className="bg-blue-600 text-center py-2">
                <span className="text-sm font-medium">MOST POPULAR</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Professional</h3>
                <div className="text-3xl font-bold mb-4">$12<span className="text-lg text-gray-400">/user/mo</span></div>
                <p className="text-gray-400 mb-6">Ideal for growing organizations focused on skill development.</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </div>
              <div className="border-t border-gray-700 p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Up to 500 users</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Advanced skill mapping & AI recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Custom reports & analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>API access</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <div className="text-3xl font-bold mb-4">Custom</div>
                <p className="text-gray-400 mb-6">For large organizations with complex learning needs.</p>
                <Button className="w-full bg-gray-700 hover:bg-gray-600">
                  Contact Sales
                </Button>
              </div>
              <div className="border-t border-gray-700 p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Unlimited users</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Full AI suite & custom integrations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Advanced analytics & custom dashboards</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Custom development & white labeling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning & Development?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join hundreds of organizations using SkillOS to develop their workforce and drive business results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
              Request Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-gray-50 hover:bg-blue-800/30">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <div className="text-2xl font-bold text-blue-500 mb-4">SkillOS</div>
              <p className="text-gray-400 mb-4">
                The complete platform for workforce development and learning management.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-gray-300">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gray-300">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gray-300">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gray-300">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-gray-300">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gray-300">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gray-300">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gray-300">Webinars</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-gray-300">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gray-300">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gray-300">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gray-300">Partners</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} SkillOS. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
