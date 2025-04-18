'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react'; // optional icon

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-900">
          YourStore
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-gray-700 hover:text-black">
            Home
          </Link>
          <Link href="/products" className="text-gray-700 hover:text-black">
            Products
          </Link>
          <Link href="/categories" className="text-gray-700 hover:text-black">
            Categories
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-black">
            Contact
          </Link>
          <Link href="/cart" className="text-gray-700 hover:text-black flex items-center">
            <ShoppingCart className="w-5 h-5" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <Link href="/" className="block py-2 text-gray-700">
            Home
          </Link>
          <Link href="/products" className="block py-2 text-gray-700">
            Products
          </Link>
          <Link href="/categories" className="block py-2 text-gray-700">
            Categories
          </Link>
          <Link href="/contact" className="block py-2 text-gray-700">
            Contact
          </Link>
          <Link href="/cart" className="block py-2 text-gray-700">
            Cart
          </Link>
        </div>
      )}
    </header>
  );
}
