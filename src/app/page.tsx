'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("http://localhost:3000/api/products");
        setProducts(res.data.slice(0, 3)); // First 3 as featured
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="w-full h-[85vh] bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
          Shop Smarter. Look Better.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
          Discover premium quality products at unbeatable prices. Style meets savings.
        </p>
        <Link
          href="/products"
          className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition duration-300 shadow-lg"
        >
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">✨ Featured Products</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading featured products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-xl transition duration-300"
              >
                <Link href={`/products/${product.id}`}>
                  <div>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="rounded-xl object-cover w-full h-60"
                    />
                    <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
                    <p className="text-gray-600 text-base mt-1">${Number(product.price).toFixed(2)}</p>
                    <span className="text-blue-600 hover:underline mt-2 block text-sm font-medium">
                      View Details
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} <span className="font-semibold">YourStoreName</span>. All rights reserved.
      </footer>
    </main>
  );
}
