import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Lazy load pages for better performance
const Home = React.lazy(() => import("@/pages/Home"));
const Products = React.lazy(() => import("@/pages/Products"));
const ProductDetail = React.lazy(() => import("@/pages/ProductDetail"));
const Cart = React.lazy(() => import("@/pages/Cart"));
const Checkout = React.lazy(() => import("@/pages/Checkout"));
const Login = React.lazy(() => import("@/pages/Login"));
const Register = React.lazy(() => import("@/pages/Register"));
const Profile = React.lazy(() => import("@/pages/Profile"));
const AdminDashboard = React.lazy(() => import("@/pages/Admin/Dashboard"));

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <React.Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                </Routes>
              </React.Suspense>
              <Toaster position="top-center" richColors />
            </div>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
