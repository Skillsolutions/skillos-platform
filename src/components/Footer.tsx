const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center lg:text-left">
      <div className="container mx-auto p-6 text-gray-700">
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="mb-6 md:mb-0">
            <h5 className="font-semibold mb-2 uppercase">SkillOS</h5>
            <p className="text-sm">
              Make L&D Measurable, Strategic, and Impactful.
            </p>
          </div>
          <div className="mb-6 md:mb-0">
            <h5 className="font-semibold mb-2 uppercase">Links</h5>
            <ul className="list-none mb-0 text-sm">
              <li>
                <a href="/product" className="text-gray-600 hover:text-blue-500">Product</a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-600 hover:text-blue-500">Pricing</a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-blue-500">About Us</a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-blue-500">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center p-4 text-sm bg-gray-200 text-gray-700">
        © {new Date().getFullYear()} SkillOS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
