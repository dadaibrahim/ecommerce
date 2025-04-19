'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export default function CartPage() {
  const userId = '123'; // Replace with session-based ID if using auth
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`/api/cart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemove = async (itemId: number) => {
    try {
      await axios.delete(`/api/cart/${userId}?itemId=${itemId}`);
      toast.success("Item removed");
      fetchCartItems();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = async (itemId: number, newQty: number) => {
    try {
      if (newQty < 1) return;
      await axios.put(`/api/cart/${userId}`, {
        itemId,
        quantity: newQty,
      });
      toast.success("Quantity updated");
      fetchCartItems();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) return <p className="text-center py-12">Loading cart...</p>;
  if (error) return <p className="text-center text-red-500 py-12">{error}</p>;
  if (cartItems.length === 0) return <p className="text-center py-12">Your cart is empty.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-6 border-b pb-4">
            <Image
              src={item.image_url}
              alt={item.name}
              width={100}
              height={100}
              className="rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-800 font-medium">${item.price.toFixed(2)}</p>
              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm">Qty:</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                  className="w-16 px-2 py-1 border rounded"
                />
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right text-2xl font-bold">
        Total: ${totalPrice.toFixed(2)}
      </div>

      <div className="mt-6 text-right">
        <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
