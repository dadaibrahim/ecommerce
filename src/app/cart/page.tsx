'use client';

import { useCartStore } from '@/lib/store/cartstore';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <Link href="/products" className="text-blue-600 hover:underline">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="rounded"
              />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={clearCart}
          className="text-sm text-gray-600 hover:underline"
        >
          Clear Cart
        </button>
        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
      </div>

      <div className="mt-6 text-right">
        <Link
          href="/order"
          className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
