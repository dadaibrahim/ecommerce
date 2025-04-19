'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartstore';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const params = useParams() as { id: string };
  const { addToCart } = useCartStore();

  const userId = '123'; // Replace this with actual auth/session logic

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    fetchProduct(id).then((data) => {
      if (data) setProduct(data);
    });
  }, [params]);

  const handleAddToCart = async () => {
    if (!product) return;

    setLoading(true);
    try {
      // Update client cart state
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
      });

      // Persist in database
      await axios.post(`/api/cart/${userId}`, {
        productId: product.id,
        quantity,
      });

      toast.success('Added to cart!');
    } catch (error) {
      console.error('Add to cart failed:', error);
      toast.error('Failed to add to cart.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <p className="text-center py-12">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
      <Image
        src={product.image_url}
        alt={product.name}
        width={600}
        height={600}
        className="rounded-lg w-full object-cover"
      />
      <div>
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-2xl text-gray-800 mb-4">${Number(product.price).toFixed(2)}</p>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="flex items-center gap-4 mb-6">
          <label htmlFor="quantity" className="text-lg">Quantity:</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded"
          />
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
