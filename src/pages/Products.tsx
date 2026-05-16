import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, SlidersHorizontal, Star, ShoppingBag, Heart, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const PRODUCTS = [
  { id: "1", name: "iPhone 15 Pro Max", brand: "Apple", price: 1199, image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800", rating: 4.9, category: "smartphones" },
  { id: "2", name: "MacBook Air M3", brand: "Apple", price: 1099, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", rating: 4.8, category: "laptops" },
  { id: "3", name: "Sony WH-1000XM5", brand: "Sony", price: 399, image: "https://images.unsplash.com/photo-1618366712214-8c075189d0ad?w=800", rating: 4.7, category: "audio" },
  { id: "4", name: "Samsung S24 Ultra", brand: "Samsung", price: 1299, image: "https://images.unsplash.com/photo-1707064841961-73602d504505?w=800", rating: 4.9, category: "smartphones" },
  { id: "5", name: "Apple Watch Ultra 2", brand: "Apple", price: 799, image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800", rating: 4.8, category: "smart-watches" },
  { id: "6", name: "iPad Pro M2", brand: "Apple", price: 999, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800", rating: 4.8, category: "tablets" },
  { id: "7", name: "ROG Ally X", brand: "ASUS", price: 799, image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800", rating: 4.6, category: "gaming" },
  { id: "8", name: "Logitech MX Master 3S", brand: "Logitech", price: 99, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800", rating: 4.9, category: "accessories" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const categoryFilter = searchParams.get("category") || "all";
  
  const filteredProducts = PRODUCTS.filter(p => 
    categoryFilter === "all" || p.category === categoryFilter
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-32 container mx-auto px-4 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 italic">
              {categoryFilter === "all" ? "EVERYTHING" : categoryFilter.toUpperCase()}
            </h1>
            <p className="text-muted-foreground">Showing {filteredProducts.length} high-end electronics</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search gadgets..." className="pl-9 h-11 rounded-xl" />
            </div>
            <Button variant="outline" className="h-11 rounded-xl gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button variant="outline" className="h-11 rounded-xl gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Sort By <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue={categoryFilter} onValueChange={(val) => setSearchParams({ category: val })} className="mb-12">
          <TabsList className="h-auto p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex flex-wrap justify-start border overflow-x-auto no-scrollbar">
            {["all", "smartphones", "laptops", "audio", "smart-watches", "gaming", "accessories"].map((cat) => (
              <TabsTrigger 
                key={cat} 
                value={cat} 
                className="rounded-xl px-6 py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm capitalize"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card rounded-[2.5rem] border overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-black"
                >
                  <Heart className="w-5 h-5" />
                </Button>
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                  <Button 
                    className="w-full h-12 bg-white text-black hover:bg-white/90 font-black shadow-lg"
                    onClick={() => addToCart(product as any)}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" /> ADD TO CART
                  </Button>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">{product.brand}</p>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 md:h-14">
                      <Link to={`/products/${product.id}`}>{product.name}</Link>
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded text-[10px] font-black italic">
                    <Star className="w-3 h-3 fill-current" />
                    {product.rating}
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <p className="text-2xl font-black text-primary tracking-tighter">${product.price}</p>
                  <Badge variant="outline" className="text-[10px] font-black uppercase bg-zinc-50 dark:bg-zinc-900 border-none">
                    IN STOCK
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
