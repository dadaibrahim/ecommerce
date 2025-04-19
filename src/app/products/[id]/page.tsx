'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartstore';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const res = await axios.get(`/api/products?id=${id}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const params = useParams();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;

    fetchProduct(id).then((data) => {
      if (data) setProduct(data);
    });
  }, [params]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
      <Image
        src={product.image_url}
        alt={product.name}
        width={600}
        height={600}
        className="rounded-lg w-full"
      />
      <div>
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-2xl text-gray-800 mb-4">${Number(product.price).toFixed(2)}</p>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <button
          onClick={() =>
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image_url,
            })
          }
          className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
