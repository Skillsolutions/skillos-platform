"use client"; // Add use client for useRouter

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation"; // Import useRouter

const HomePage = () => {
  const router = useRouter(); // Initialize router

  const handleSeePlatformClick = () => {
    router.push("/platform/dashboard"); // Navigate to platform dashboard
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Make L&D Measurable, Strategic, and Impactful</h1>
          <p className="text-xl text-gray-600 mb-8">SkillOS gives HR and L&D teams full visibility into skills, learning progress, and ROI—all synced with Udemy Business.</p>
          <div className="space-x-4">
            <button 
              onClick={() => router.push("/demo-request")} // Assuming demo request is a page
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              Book a Free Demo
            </button>
            <button 
              onClick={handleSeePlatformClick} 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold"
            >
              See Platform in Action
            </button>
          </div>
        </section>

        {/* Platform Concept Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">How SkillOS Works</h2>
          <div className="text-center mb-8">

          </div>
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <p className="text-gray-700">[Placeholder for short video or mockup showing dashboards, analytics, and assessments]</p>
          </div>
        </section>

        {/* Top Features Overview */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-blue-500 mb-4 text-4xl"></div>
              <h3 className="text-xl font-semibold mb-2">Org & Team Dashboards</h3>
              <p className="text-gray-600">Filterable by department, role, etc.</p>
            </div>
            <div>
              <div className="text-blue-500 mb-4 text-4xl"></div>
              <h3 className="text-xl font-semibold mb-2">AI-Curated Assessments</h3>
              <p className="text-gray-600">Tailored to roles, goals, or skills.</p>
            </div>
            <div>
              <div className="text-blue-500 mb-4 text-4xl"></div>
              <h3 className="text-xl font-semibold mb-2">Peer & 360° Assessments</h3>
              <p className="text-gray-600">Comprehensive feedback mechanisms.</p>
            </div>
            <div>
              <div className="text-blue-500 mb-4 text-4xl"></div>
              <h3 className="text-xl font-semibold mb-2">Communication Hub</h3>
              <p className="text-gray-600">For training nudges and announcements.</p>
            </div>
            <div>
              <div className="text-blue-500 mb-4 text-4xl"></div>
              <h3 className="text-xl font-semibold mb-2">Engagement Gamification</h3>
              <p className="text-gray-600">Planner for L&D leaders.</p>
            </div>
            <div>
              <div className="text-blue-500 mb-4 text-4xl"></div>
              <h3 className="text-xl font-semibold mb-2">Integrations</h3>
              <p className="text-gray-600">HR, Slack, Calendar, and more.</p>
            </div>
             <div>
              <div className="text-blue-500 mb-4 text-4xl"></div>
              <h3 className="text-xl font-semibold mb-2">ROI Dashboard</h3>
              <p className="text-gray-600">Connect learning to business goals.</p>
            </div>
          </div>
        </section>

        {/* Why SkillOS? Section */}
        <section className="py-16 bg-gray-50 rounded-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why SkillOS?</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">Address L&D Challenges</h3>
              <p className="text-gray-600 mb-2">Low L&D visibility? Learner disengagement? SkillOS provides solutions.</p>
              <h3 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">Achieve Measurable Outcomes</h3>
              <p className="text-gray-600">Enable data-driven L&D, strategic skills planning, and demonstrate measurable ROI.</p>
            </div>
            <div className="text-center">
              <p className="text-gray-700">[Placeholder for Product Screenshots: Dashboards, skill profiles, assessment builder, communication tools, AI suggestions]</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-700">[Placeholder for Customer Logos / Testimonials]</p>
          </div>
        </section>

        {/* Pricing Section Overview */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Flexible Pricing Plans</h2>
          <p className="text-xl text-gray-600 mb-8">Choose the plan that best fits your organization&apos;s needs. Starter, Growth, and Enterprise plans available.</p>
          <div className="space-x-4">
            <button 
              onClick={() => router.push("/pricing")} // Navigate to pricing page
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              View Pricing
            </button>
            <button 
              onClick={() => router.push("/pricing")} // Navigate to pricing page (or a dedicated comparison page if it exists)
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold"
            >
              Compare Plans
            </button>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default HomePage;

