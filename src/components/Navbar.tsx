import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Heart, Trash2, Plus, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/types";
import api from "@/services/api";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const fetchSuggestions = async () => {
        try {
          const response = await api.get(`/products/?search=${searchQuery}&limit=5`);
          setSuggestions(response.data.slice(0, 5));
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      };
      
      const debounceTimer = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled ? "bg-background/80 backdrop-blur-md py-2" : "bg-background py-4"
      )}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left"
        style={{ scaleX }}
      />
      
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl"
          >
            S
          </motion.div>
          <span className="font-bold text-xl hidden sm:inline-block tracking-tighter text-black dark:text-white">
            SOLO'S <span className="text-muted-foreground font-light text-sm uppercase ml-1">Phones & Electronics</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">All Products</Link>
          <Link to="/products?category=smartphones" className="text-sm font-medium hover:text-primary transition-colors">Phones</Link>
          <Link to="/products?category=laptops" className="text-sm font-medium hover:text-primary transition-colors">Laptops</Link>
          <Link to="/products?category=accessories" className="text-sm font-medium hover:text-primary transition-colors">Accessories</Link>
        </nav>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative hidden lg:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search gadgets..." 
              className="pl-9 h-9 border-zinc-200 dark:border-zinc-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-xl overflow-hidden z-50">
                <ScrollArea className="max-h-60">
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left border-b last:border-none"
                      onClick={() => {
                        navigate(`/products/${p.id}`);
                        setSearchQuery("");
                        setShowSuggestions(false);
                      }}
                    >
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">{p.brand}</p>
                      </div>
                    </button>
                  ))}
                  <div className="p-2">
                    <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase h-8" onClick={() => navigate(`/products?search=${searchQuery}`)}>
                      View all results
                    </Button>
                  </div>
                </ScrollArea>
              </div>
            )}
          </form>

          <Button variant="ghost" size="icon" asChild>
            <Link to={user ? "/profile" : "/login"}>
              {user ? (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                  {(user.displayName || user.email)?.slice(0, 2).toUpperCase()}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative group" asChild>
            <Link to="/profile#wishlist">
              <Heart className={cn("w-5 h-5 transition-colors", wishlist.length > 0 ? "fill-red-500 text-red-500" : "group-hover:text-red-500")} />
              {wishlist.length > 0 && (
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-red-500">
                  {wishlist.length}
                </Badge>
              )}
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px]">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-2xl font-black italic tracking-tight">YOUR CART</SheetTitle>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto mt-8 pr-4">
                {cart.length > 0 ? (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex gap-4 group">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-none">
                          <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-bold text-sm leading-tight line-clamp-2">{item.name}</h4>
                          <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">{item.brand}</p>
                          <div className="flex items-center justify-between pt-2">
                             <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-none"
                                  onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                >
                                   <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-none"
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                >
                                   <Plus className="w-3 h-3" />
                                </Button>
                             </div>
                             <p className="font-black text-primary italic text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFromCart(item.productId)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                      }}
                      className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6"
                    >
                      <ShoppingCart className="w-12 h-12 text-primary opacity-20" />
                    </motion.div>
                    <h3 className="text-xl font-black italic mb-2 tracking-tight">YOUR CART IS LONELY</h3>
                    <p className="text-sm text-muted-foreground mb-8 leading-relaxed italic">
                      It seems you haven't discovered our latest tech arrivals yet. Let's fix that.
                    </p>
                    <SheetHeader>
                      <Button size="lg" className="rounded-xl px-8 font-black italic tracking-tight" asChild>
                        <Link to="/products">CONTINUE SHOPPING</Link>
                      </Button>
                    </SheetHeader>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t pt-8 space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Total Amount</span>
                    <span className="text-3xl font-black text-primary italic tracking-tight">${cartTotal.toLocaleString()}</span>
                  </div>
                  <Button className="w-full h-16 text-xl font-black rounded-2xl shadow-2xl shadow-primary/20 group" asChild>
                    <Link to="/checkout">
                       CONTINUE TO CHECKOUT
                       <X className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform rotate-[-135deg]" />
                    </Link>
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
