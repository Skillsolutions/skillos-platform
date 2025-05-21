import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-12">
        <section className="py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">About SkillOS</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-xl space-y-6">
              <p className="text-lg text-gray-700">
                SkillOS was founded with a mission to empower organizations to make their Learning & Development initiatives measurable, strategic, and impactful. We believe that continuous learning is the cornerstone of growth, both for individuals and for businesses. However, many L&D efforts suffer from a lack of visibility, engagement, and clear connection to business outcomes.
              </p>
              <p className="text-lg text-gray-700">
                Our platform provides HR and L&D professionals with a centralized control center to manage learning analytics, drive learner engagement, create targeted assessments, and track the real-world business impact of their training programs. By integrating seamlessly with leading learning content providers like Udemy Business, LinkedIn Learning, and Coursera, SkillOS ensures that learners can continue their training on familiar platforms while administrators gain powerful insights and control.
              </p>
              <h2 className="text-2xl font-semibold text-gray-800 pt-4">Our Vision</h2>
              <p className="text-lg text-gray-700">
                We envision a world where every organization can unlock the full potential of its workforce through data-driven and strategically aligned L&D. SkillOS aims to be the leading enablement platform that bridges the gap between learning activities and tangible business results.
              </p>
              <h2 className="text-2xl font-semibold text-gray-800 pt-4">Our Team</h2>
              <p className="text-lg text-gray-700">
                [Placeholder for information about the SkillOS team, their expertise, and passion for L&D.]
              </p>
               <h2 className="text-2xl font-semibold text-gray-800 pt-4">Join Us on Our Journey</h2>
              <p className="text-lg text-gray-700">
                We are passionate about helping organizations build future-ready workforces. If you share our vision for transforming L&D, we invite you to <a href="/demo-request" className="text-blue-500 hover:underline">request a demo</a> and see how SkillOS can make a difference for your team.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;

