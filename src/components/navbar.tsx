"use client"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ShoppingCart, UserCircle, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Load username from cookies
  useEffect(() => {
    const name = Cookies.get('userName');
    if (name) setUserName(name);
  }, []);

  const handleLogout = () => {
    // Clear the cookies on logout
    Cookies.remove('sessionToken');
    Cookies.remove('userName');
    setUserName(null);
    window.location.href = '/'; // Redirect to homepage after logout
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-900">
          YourStore
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-gray-700 hover:text-black">Home</Link>
          <Link href="/products" className="text-gray-700 hover:text-black">Products</Link>
          <Link href="/categories" className="text-gray-700 hover:text-black">Categories</Link>
          <Link href="/contact" className="text-gray-700 hover:text-black">Contact</Link>
          <Link href="/cart" className="text-gray-700 hover:text-black flex items-center">
            <ShoppingCart className="w-5 h-5" />
          </Link>

          {/* Auth */}
          {userName ? (
            <div className="flex items-center gap-4 text-gray-700">
              <div className="flex items-center gap-1">
                <UserCircle className="w-5 h-5" />
                <span>{userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:underline text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-blue-600 hover:underline">
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/" className="block text-gray-700">Home</Link>
          <Link href="/products" className="block text-gray-700">Products</Link>
          <Link href="/categories" className="block text-gray-700">Categories</Link>
          <Link href="/contact" className="block text-gray-700">Contact</Link>
          <Link href="/cart" className="block text-gray-700">Cart</Link>
          {userName ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 text-gray-700">
                <UserCircle className="w-5 h-5" />
                <span>{userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:underline text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="block text-blue-600">Login</Link>
              <Link
                href="/signup"
                className="block text-white bg-blue-600 px-3 py-2 rounded-lg text-center"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
