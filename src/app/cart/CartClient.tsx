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

export default function CartClient({ userId }: { userId: string }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch cart items from API
  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`/api/cart/${userId}`);
      if (Array.isArray(res.data)) {
        setCartItems(res.data);
      } else {
        setError('Unexpected response from the server.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load cart items.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart items on mount or when userId changes
  useEffect(() => {
    fetchCartItems();
  }, [userId]); // Re-fetch when userId changes

  // Remove an item from the cart
  const handleRemove = async (itemId: number) => {
    try {
      await axios.delete(`/api/cart/${userId}?itemId=${itemId}`);
      toast.success('Item removed');
      fetchCartItems(); // Re-fetch after removal
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  // Update item quantity in the cart
  const handleQuantityChange = async (itemId: number, newQty: number) => {
    if (newQty < 1) return; // Prevent setting quantity less than 1

    try {
      await axios.put(`/api/cart/${userId}`, {
        itemId,
        quantity: newQty,
      });
      toast.success('Quantity updated');
      fetchCartItems(); // Re-fetch after update
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  // Calculate the total price of all items in the cart
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity, // Ensure price is treated as number
    0
  );

  // Return loading or error message
  if (loading) return <p className="text-center py-12">Loading cart...</p>;
  if (error) return <p className="text-center text-red-500 py-12">{error}</p>;
  if (cartItems.length === 0)
    return <p className="text-center py-12">Your cart is empty.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-6">
        {cartItems.map((item) => {
          // Ensure price is a number before calling .toFixed()
          const price = Number(item.price);
          const formattedPrice = isNaN(price) ? 0 : price.toFixed(2);

          return (
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
                <p className="text-gray-800 font-medium">${formattedPrice}</p>
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
          );
        })}
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
