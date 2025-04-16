import Link from 'next/link';
import Image from 'next/image';

const products = [
  {
    id: 1,
    name: 'Premium Headphones',
    price: 89.99,
    image: '/products/product-1.jpg',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 149.99,
    image: '/products/product-2.jpg',
  },
  {
    id: 3,
    name: 'Leather Backpack',
    price: 69.99,
    image: '/products/product-3.jpg',
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-4 hover:shadow-md transition"
          >
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
