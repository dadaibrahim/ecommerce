'use client';

import { useCartStore } from '@/lib/store/cartstore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderPage() {
  const { items, clearCart } = useCartStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate order placement
    setOrderPlaced(true);

    // Clear cart after order submission
    clearCart();

    // Redirect to a thank you page or confirmation page
    setTimeout(() => {
      router.push('/thank-you');
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">Order Placed!</h1>
          <p className="text-lg">Thank you for your purchase. You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Order Summary</h1>

      {/* Cart items */}
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded" />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-8 text-xl font-semibold">
        <p>Total: ${total.toFixed(2)}</p>
      </div>

      {/* Shipping Details Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border rounded-md"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded-md"
        />
        <textarea
          placeholder="Your Shipping Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="w-full p-3 border rounded-md"
        />

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition w-full"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
