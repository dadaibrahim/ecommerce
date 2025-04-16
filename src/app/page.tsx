// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="w-full h-[80vh] bg-gray-100 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Shop Smarter. Look Better.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          Discover premium products at unbeatable prices.
        </p>
        <Link
          href="/products"
          className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
        >
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((id) => (
            <div key={id} className="border rounded-xl p-4 hover:shadow-lg transition">
              <Image
                src={`/products/product-${id}.jpg`}
                alt={`Product ${id}`}
                width={400}
                height={400}
                className="rounded-lg mb-4"
              />
              <h3 className="text-xl font-medium">Product Name {id}</h3>
              <p className="text-gray-600">$29.99</p>
              <Link
                href={`/products/${id}`}
                className="text-blue-600 hover:underline mt-2 block"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} YourStoreName. All rights reserved.
      </footer>
    </main>
  );
}
