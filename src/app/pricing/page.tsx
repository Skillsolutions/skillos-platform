import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PricingPage = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-12">
        <section className="py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Pricing Plans</h1>
          <p className="text-xl text-gray-600 mb-12">Choose the perfect plan for your organization. All plans include core SkillOS features.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="border p-8 rounded-lg shadow-lg flex flex-col">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Starter</h2>
              <p className="text-4xl font-bold text-gray-800 mb-2">$XX <span className="text-lg font-normal text-gray-500">/mo</span></p>
              <p className="text-gray-600 mb-6">Ideal for small teams getting started with L&D analytics.</p>
              <ul className="text-left space-y-2 text-gray-600 mb-8 flex-grow">
                <li>✅ Up to 50 users</li>
                <li>✅ Basic Dashboards</li>
                <li>✅ Standard Assessments</li>
                <li>✅ Email Support</li>
              </ul>
              <button className="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold w-full">Choose Plan</button>
            </div>

            {/* Growth Plan */}
            <div className="border p-8 rounded-lg shadow-lg flex flex-col bg-blue-50 scale-105">
              <p className="text-sm font-semibold text-blue-600 bg-blue-200 px-3 py-1 rounded-full self-start mb-4">Most Popular</p>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Growth</h2>
              <p className="text-4xl font-bold text-gray-800 mb-2">$XXX <span className="text-lg font-normal text-gray-500">/mo</span></p>
              <p className="text-gray-600 mb-6">For growing businesses looking to scale their L&D efforts.</p>
              <ul className="text-left space-y-2 text-gray-600 mb-8 flex-grow">
                <li>✅ Up to 250 users</li>
                <li>✅ Advanced Dashboards & Analytics</li>
                <li>✅ AI-Curated Assessments</li>
                <li>✅ Peer & 360° Assessments</li>
                <li>✅ Priority Email & Chat Support</li>
                <li>✅ HR & Slack Integrations</li>
              </ul>
              <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold w-full">Choose Plan</button>
            </div>

            {/* Enterprise Plan */}
            <div className="border p-8 rounded-lg shadow-lg flex flex-col">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Enterprise</h2>
              <p className="text-4xl font-bold text-gray-800 mb-2">Custom</p>
              <p className="text-gray-600 mb-6">Tailored solutions for large organizations with specific needs.</p>
              <ul className="text-left space-y-2 text-gray-600 mb-8 flex-grow">
                <li>✅ Unlimited users</li>
                <li>✅ All Growth Plan features</li>
                <li>✅ Custom Integrations</li>
                <li>✅ Dedicated Account Manager</li>
                <li>✅ ROI Dashboard & Business Impact Tracking</li>
                <li>✅ Custom Branding & SSO</li>
              </ul>
              <button className="mt-auto bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold w-full">Contact Sales</button>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Optional Services</h3>
            <p className="text-gray-600">We also offer custom implementation, training, and L&D consulting services. <a href="/contact" className="text-blue-500 hover:underline">Contact us</a> for more details.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PricingPage;

