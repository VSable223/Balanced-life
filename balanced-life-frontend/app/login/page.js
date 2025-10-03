"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Call NextAuth signIn with your credentials provider
    const result = await signIn("credentials", {
      redirect: false, // We handle redirection manually
      email: formData.email,
      password: formData.password,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Invalid credentials. Please try again.");
    }

    setIsSubmitting(false);
  };

  // Ensure no hydration mismatch by avoiding dynamic values in SSR
  useEffect(() => {
    // Any client-side specific logic can go here
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-500">
      <h1 className="text-3xl font-bold tracking-wide text-grey-500">
        Welcome to BalancedLife
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-purple-500">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-black"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-black"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
