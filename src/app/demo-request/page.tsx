import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DemoRequestPage = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Request a Demo</h1>
        <p className="text-xl text-gray-600 mb-8 text-center">
          See SkillOS in action and discover how it can transform your L&D strategy. Fill out the form below, and one of our specialists will contact you shortly.
        </p>
        <form className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-xl">
          <div className="mb-6">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="fullName" id="fullName" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
            <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div className="mb-6">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input type="text" name="company" id="company" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div className="mb-6">
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input type="text" name="jobTitle" id="jobTitle" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div className="mb-6">
            <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
            <select id="companySize" name="companySize" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option>1-50 employees</option>
              <option>51-200 employees</option>
              <option>201-1000 employees</option>
              <option>1001+ employees</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">What are you hoping to achieve with SkillOS? (Optional)</label>
            <textarea name="message" id="message" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Submit Request
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default DemoRequestPage;

