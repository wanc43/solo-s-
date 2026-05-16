import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, Heart, Laptop, Smartphone, Headphones, Watch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled ? "bg-background/80 backdrop-blur-md py-2" : "bg-background py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl"
          >
            S
          </motion.div>
          <span className="font-bold text-xl hidden sm:inline-block tracking-tighter">
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
          <div className="relative hidden lg:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search gadgets..." 
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile">
              <User className="w-5 h-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative group">
            <Heart className="w-5 h-5 group-hover:text-red-500 transition-colors" />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px]" variant="destructive">
              0
            </Badge>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px]">
                  0
                </Badge>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle>Your Shopping Cart</SheetTitle>
              </SheetHeader>
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <ShoppingCart className="w-12 h-12 mb-4" />
                <p>Your cart is empty</p>
                <Button variant="link" asChild>
                  <Link to="/products">Start Shopping</Link>
                </Button>
              </div>
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>$0.00</span>
                </div>
                <Button className="w-full h-12 text-lg">Checkout</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
