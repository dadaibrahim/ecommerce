"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    imageFile: null,
    description: "",
    stock: ""
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState({
    name: "",
    price: "",
    image: "",
    imageFile: null,
    description: "",
    stock: ""
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://68020cf381c7e9fbcc442b05.mockapi.io/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://mockapi.io/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    return data.url;
  };

  const handleAddProduct = async () => {
    try {
      const imageUrl = newProduct.imageFile
        ? await uploadImage(newProduct.imageFile)
        : "";

      const res = await axios.post("https://68020cf381c7e9fbcc442b05.mockapi.io/products", {
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        stock: newProduct.stock,
        image: imageUrl
      });

      setProducts([...products, res.data]);
      setNewProduct({
        name: "",
        price: "",
        imageFile: null,
        description: "",
        stock: ""
      });
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`https://68020cf381c7e9fbcc442b05.mockapi.io/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setEditingProduct({
      name: product.name,
      price: product.price,
      image: product.image,
      imageFile: null,
      description: product.description,
      stock: product.stock
    });
  };

  const handleUpdateProduct = async () => {
    try {
      let imageUrl = editingProduct.image;
      if (editingProduct.imageFile) {
        imageUrl = await uploadImage(editingProduct.imageFile);
      }

      const res = await axios.put(
        `https://68020cf381c7e9fbcc442b05.mockapi.io/products/${editingProductId}`,
        {
          name: editingProduct.name,
          price: editingProduct.price,
          description: editingProduct.description,
          stock: editingProduct.stock,
          image: imageUrl
        }
      );

      setProducts(
        products.map((p) => (p.id === editingProductId ? res.data : p))
      );
      setEditingProductId(null);
      setEditingProduct({
        name: "",
        price: "",
        image: "",
        imageFile: null,
        description: "",
        stock: ""
      });
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full border rounded-md px-4 py-2 mb-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="w-full border rounded-md px-4 py-2 mb-2"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="w-full border rounded-md px-4 py-2 mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageFile: e.target.files?.[0] || null })
            }
            className="w-full border rounded-md px-4 py-2 mb-2"
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full border rounded-md px-4 py-2 mb-2"
          />
          <Button onClick={handleAddProduct}>Add Product</Button>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Order Tracking</h2>
          <ul className="space-y-2">
            {orders.map((order) => (
              <li key={order.id} className="border p-2 rounded-md">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Product:</strong> {order.productName}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">All Products</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="p-4 space-y-2">
              {editingProductId === product.id ? (
                <>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full border rounded-md px-2 py-1"
                  />
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: e.target.value })
                    }
                    className="w-full border rounded-md px-2 py-1"
                  />
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: e.target.value })
                    }
                    className="w-full border rounded-md px-2 py-1"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, imageFile: e.target.files?.[0] || null })
                    }
                    className="w-full border rounded-md px-2 py-1"
                  />
                  <input
                    type="text"
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full border rounded-md px-2 py-1"
                  />
                  <Button onClick={handleUpdateProduct}>Update</Button>
                </>
              ) : (
                <>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  )}
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-gray-600">Price: ₹{product.price}</p>
                  <p className="text-gray-600">Stock: {product.stock}</p>
                  <p className="text-gray-700 text-sm">{product.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => handleEditProduct(product)}>Edit</Button>
                    <Button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
