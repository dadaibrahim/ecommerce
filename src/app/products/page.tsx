// app/products/page.tsx or pages/products/index.tsx (depends on your setup)

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:3000/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl p-4 hover:shadow-md transition"
            >
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="rounded-lg mb-4 object-cover"
                />
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">${Number(product.price).toFixed(2)}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
