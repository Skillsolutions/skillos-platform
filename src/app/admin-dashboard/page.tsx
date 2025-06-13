import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AdminDashboardPage = () => {
  // Mock data or simplified structure for placeholders
  const placeholderBox = (title: string, content: string) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">{title}</h2>
      <div className="bg-gray-100 p-4 rounded text-center text-gray-500 min-h-[100px] flex items-center justify-center">
        <p>{content}</p>
      </div>
    </div>
  );

  return (
    <>
      <Header /> {/* Or a dedicated Admin Header */}
      <main className="container mx-auto px-6 py-12 bg-gray-50 min-h-screen">
        <section className="py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">SkillOS Admin Dashboard (Overview Mockup)</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholderBox("📂 Skill Dashboard", "Placeholder: Filterable views by person, department, or whole organization. Charts showing skill distribution and progress.")}
            
            {placeholderBox("🧠 AI Assessment Builder", "Placeholder: Interface to generate assessments for roles, projects, or skills based on Udemy course content + org goals.")}
            
            {placeholderBox("📝 Custom Assessments & Evaluations", "Placeholder: Tools to create, assign, and review results for custom assessments, peer evaluations, and 360° feedback.")}
            
            {placeholderBox("🎮 Engagement Planner", "Placeholder: Calendar-based interface for planning communication nudges and gamification tasks.")}
            
            {placeholderBox("💬 Communication Hub", "Placeholder: Interface for sending email/Slack messages, announcements, and nudges to learners.")}
            
            {placeholderBox("📈 Analytics Dashboard", "Placeholder: Visualizations of completion rates, engagement trends, ROI heatmaps, and connection to business objectives.")}
            
            {placeholderBox("⚙️ Settings", "Placeholder: Options to invite/manage users, assign roles, customize appearance (logo, theme), and manage integrations (HRMS, Slack, Calendar, Udemy, Coursera etc).")}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">This is a conceptual overview. Full functionality would be available in the live platform.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboardPage;

