"use client"
import { useCartStore } from '@/lib/store/cartstore';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Temporary static data
const products = [
  {
    id: 1,
    name: 'Premium Headphones',
    price: 89.99,
    image: '/products/product-1.jpg',
    description: 'High-quality wireless headphones with noise cancellation.',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 149.99,
    image: '/products/product-2.jpg',
    description: 'Track your fitness and stay connected on the go.',
  },
  {
    id: 3,
    name: 'Leather Backpack',
    price: 69.99,
    image: '/products/product-3.jpg',
    description: 'Stylish, durable, and perfect for everyday carry.',
  },
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) return notFound();

  const { items, addToCart } = useCartStore();
  console.log(items);

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={600}
          className="rounded-lg w-full"
        />
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-gray-800 mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <button
        onClick={() =>
          addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          })
        }
        className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
      >
        Add to Cart
      </button>
        </div>
      </div>
    </>
  );
}
