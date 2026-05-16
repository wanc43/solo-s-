import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/lib/firestore-utils";
import { toast } from "sonner";

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const wishlistRef = doc(db, "wishlists", user.uid);

    const unsubscribe = onSnapshot(wishlistRef, (docSnap) => {
      if (docSnap.exists()) {
        setWishlist(docSnap.data().productIds || []);
      } else {
        setWishlist([]);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `wishlists/${user.uid}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];

    try {
      const wishlistRef = doc(db, "wishlists", user.uid);
      await setDoc(wishlistRef, {
        userId: user.uid,
        productIds: newWishlist,
        updatedAt: new Date().toISOString()
      });
      
      if (wishlist.includes(productId)) {
        toast.success("Removed from wishlist");
      } else {
        toast.success("Added to wishlist");
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `wishlists/${user.uid}`);
      toast.error("Failed to update wishlist");
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
