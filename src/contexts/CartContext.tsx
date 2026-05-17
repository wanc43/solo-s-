import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { CartItem, Product } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [localCart, setLocalCart] = useLocalStorage<CartItem[]>("solo_cart", []);
  const [serverCart, setServerCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync with server if logged in
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        setLoading(true);
        try {
          const response = await api.get('/cart/');
          setServerCart(response.data.items || []);
        } catch (err) {
          console.error("Failed to fetch cart from server", err);
        } finally {
          setLoading(false);
        }
      };
      fetchCart();
    } else {
      setServerCart([]);
    }
  }, [user]);

  const cart = user ? serverCart : localCart;

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (user) {
      try {
        const response = await api.post('/cart/add/', {
          productId: product.id,
          quantity
        });
        setServerCart(response.data.items);
        toast.success(`${product.name} added to cart`);
      } catch (err) {
        console.error("Failed to add to cart on server", err);
        toast.error("Failed to add to cart");
      }
    } else {
      const existing = localCart.find((item) => item.productId === product.id);
      if (existing) {
        setLocalCart(localCart.map((item) => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        ));
      } else {
        setLocalCart([...localCart, {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          quantity
        }]);
      }
      toast.success(`${product.name} added to cart`);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      try {
        const response = await api.delete(`/cart/remove/${productId}/`);
        setServerCart(response.data.items);
        toast.error("Item removed from cart");
      } catch (err) {
        console.error("Failed to remove from cart on server", err);
      }
    } else {
      setLocalCart(localCart.filter((item) => item.productId !== productId));
      toast.error("Item removed from cart");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (user) {
      try {
        const response = await api.patch(`/cart/update/${productId}/`, { quantity });
        setServerCart(response.data.items);
      } catch (err) {
        console.error("Failed to update cart on server", err);
      }
    } else {
      setLocalCart(localCart.map((item) => 
        item.productId === productId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart/clear/');
        setServerCart([]);
      } catch (err) {
        console.error("Failed to clear cart on server", err);
      }
    } else {
      setLocalCart([]);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
