import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-12">
        <section className="py-12">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Contact Us</h1>
            <p className="text-gray-600 mb-8 text-center">
              Have questions about SkillOS? Need help with our platform? Or interested in partnership opportunities? We&apos;d love to hear from you. Please fill out the form below or reach out to us via email or phone.
            </p>
            <form className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="fullName" id="fullName" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input type="text" name="company" id="company" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea name="message" id="message" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                  Send Message
                </button>
              </div>
            </form>
            <div className="mt-8 text-center">
              <p className="text-gray-600">Or reach us at:</p>
              <p className="text-gray-600">Email: <a href="mailto:info@skillos.com" className="text-blue-500 hover:underline">info@skillos.com</a></p>
              <p className="text-gray-600">Phone: [Placeholder for Phone Number]</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;

