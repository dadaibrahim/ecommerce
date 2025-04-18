"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [loginError, setLoginError] = useState("");

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.get("https://67e8f1d1bdcaa2b7f5b82bb1.mockapi.io/users");
      const users = response.data;

      const user = users.find((u: any) => u.email === data.email && u.password === data.password);

      if (user) {
        console.log("Login successful:", user);
        setLoginError("");

        // Simulate session token generation
        const sessionToken = `${user.id}-${Date.now()}`;

        // Store session in mock API
        await axios.post("https://67e8f1d1bdcaa2b7f5b82bb1.mockapi.io/sessions", {
          userId: user.id,
          sessionToken,
          createdAt: new Date().toISOString()
        });

        // You can store sessionToken in localStorage or cookie (optional)
        localStorage.setItem("sessionToken", sessionToken);

        // Navigate to dashboard
        router.push("/");
      } else {
        setLoginError("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          {loginError && <p className="text-red-500 text-center text-sm">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account? <a href="/signup" className="text-blue-500">Sign up here</a>
        </p>
      </div>
    </div>
  );
}
