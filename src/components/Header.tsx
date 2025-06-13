import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          SkillOS
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-blue-500">Home</Link>
          <Link href="/product" className="text-gray-600 hover:text-blue-500">Product</Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-500">Pricing</Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-500">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-500">Contact</Link>
          <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
