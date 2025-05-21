import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductPage = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-12">
        <section className="py-12">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">SkillOS Product Features</h1>
          
          {/* Feature 1: Org & Team Dashboards */}
          <div className="mb-16 p-6 border rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">📊 Org & Team Dashboards</h2>
            <p className="text-gray-600 mb-4">Gain comprehensive insights into learning progress across your entire organization or specific teams. Dashboards are filterable by department, role, and other custom criteria, providing a clear view of skill development and engagement levels.</p>
            <div className="bg-gray-100 p-4 rounded text-center text-gray-500">[Placeholder for Dashboard Screenshot/Mockup]</div>
          </div>

          {/* Feature 2: AI-Curated Assessments */}
          <div className="mb-16 p-6 border rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">🧠 AI-Curated Assessments</h2>
            <p className="text-gray-600 mb-4">Leverage the power of AI to create assessments tailored to specific job roles, learning objectives, or identified skill gaps. These assessments can be generated based on content from Udemy Business courses and aligned with your organization&apos;s strategic goals.</p>
            <div className="bg-gray-100 p-4 rounded text-center text-gray-500">[Placeholder for AI Assessment Builder Screenshot/Mockup]</div>
          </div>

          {/* Feature 3: Peer & 360° Assessments */}
          <div className="mb-16 p-6 border rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">👥 Peer & 360° Assessments</h2>
            <p className="text-gray-600 mb-4">Facilitate comprehensive feedback with peer and 360-degree assessment capabilities. Gather diverse perspectives to help employees understand their strengths and areas for development from multiple viewpoints.</p>
            <div className="bg-gray-100 p-4 rounded text-center text-gray-500">[Placeholder for Peer Assessment Feature Screenshot/Mockup]</div>
          </div>

          {/* Feature 4: Communication Hub */}
          <div className="mb-16 p-6 border rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">💬 Communication Hub</h2>
            <p className="text-gray-600 mb-4">Keep learners engaged and informed with a centralized communication hub. Send out training nudges, important announcements, and updates directly through SkillOS, integrated with email and Slack.</p>
            <div className="bg-gray-100 p-4 rounded text-center text-gray-500">[Placeholder for Communication Hub Screenshot/Mockup]</div>
          </div>

          {/* Feature 5: Engagement Gamification Planner */}
          <div className="mb-16 p-6 border rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">🎮 Engagement Gamification Planner</h2>
            <p className="text-gray-600 mb-4">Boost learner motivation and participation with our engagement gamification planner. L&D leaders can design and implement gamified learning experiences, track progress, and reward achievements.</p>
            <div className="bg-gray-100 p-4 rounded text-center text-gray-500">[Placeholder for Gamification Planner Screenshot/Mockup]</div>
          </div>

          {/* Feature 6: HR & Slack/Calendar Integrations */}
          <div className="mb-16 p-6 border rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">🔗 HR & Slack/Calendar Integrations</h2>
            <p className="text-gray-600 mb-4">Seamlessly integrate SkillOS with your existing HRMS, Slack, Google Calendar, and learning platforms like Udemy Business and Coursera. Streamline workflows and ensure data consistency across your L&D ecosystem.</p>
            <div className="bg-gray-100 p-4 rounded text-center text-gray-500">[Placeholder for Integrations Diagram/Screenshot]</div>
          </div>

          {/* Feature 7: ROI Dashboard */}
          <div className="p-6 border rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">📈 ROI Dashboard</h2>
            <p className="text-gray-600 mb-4">Connect learning initiatives directly to business objectives and measure their impact. The ROI dashboard provides clear visualizations of how L&D programs are contributing to key business goals, helping you demonstrate the value of your investments.</p>
            <div className="bg-gray-100 p-4 rounded text-center text-gray-500">[Placeholder for ROI Dashboard Screenshot/Mockup]</div>
          </div>

        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductPage;
