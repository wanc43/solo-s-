import React, { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, SlidersHorizontal, Star, ShoppingBag, Heart, ChevronDown, Loader2, Eye, Truck, ShieldCheck, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import { Product } from "@/types";
import { handleFirestoreError, OperationType } from "@/lib/firestore-utils";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");
  
  const categoryFilter = searchParams.get("category") || "all";
  const urlSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(urlSearch);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const productsRef = collection(db, "products");
        let q = query(productsRef);
        
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        setProducts(productsData);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const brands = Array.from(new Set(products.map(p => p.brand))).sort() as string[];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesRating = p.rating >= minRating;
      
      return matchesCategory && matchesSearch && matchesBrand && matchesPrice && matchesRating;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      }
      const featA = a.featured ? 1 : 0;
      const featB = b.featured ? 1 : 0;
      return featB - featA;
    });
  }, [products, categoryFilter, searchTerm, selectedBrands, priceRange, minRating, sortBy]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set("search", val);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-32 container mx-auto px-4 pb-24">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 italic">
              {categoryFilter === "all" ? "EVERYTHING" : categoryFilter.toUpperCase()}
            </h1>
            <p className="text-muted-foreground">
              {loading ? "Discovering the best tech..." : `Showing ${filteredProducts.length} high-end electronics`}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 md:w-64 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search gadgets..." 
                className="w-full pl-10 pr-4 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all text-sm" 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Button 
              variant={showFilters ? "default" : "outline"} 
              className="h-11 rounded-xl gap-2 font-bold"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" /> {showFilters ? "Hide Filters" : "Filters"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 rounded-xl gap-2 font-bold min-w-[120px]">
                  <ArrowUpDown className="w-4 h-4" /> 
                  <span className="capitalize">{sortBy.replace('-', ' ')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                <DropdownMenuItem className="rounded-lg font-bold py-3" onClick={() => setSortBy("featured")}>Featured</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg font-bold py-3" onClick={() => setSortBy("newest")}>Newest Arrivals</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg font-bold py-3" onClick={() => setSortBy("price-low")}>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg font-bold py-3" onClick={() => setSortBy("price-high")}>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg font-bold py-3" onClick={() => setSortBy("rating")}>Highest Rated</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="mb-12 p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-primary">
                  <ShoppingBag className="w-4 h-4" /> Brands
                </h4>
                <div className="flex flex-wrap gap-2">
                  {brands.map(brand => (
                    <Badge 
                      key={brand}
                      variant={selectedBrands.includes(brand) ? "default" : "outline"}
                      className="cursor-pointer px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border-zinc-200 dark:border-zinc-800"
                      onClick={() => toggleBrand(brand)}
                    >
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-primary">
                  <Filter className="w-4 h-4" /> Price Range
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono tracking-tighter">${priceRange[0]}</span>
                    <span className="text-sm font-black text-primary italic tracking-tight">${priceRange[1]}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-primary h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-black tracking-widest uppercase">
                    <span>min</span>
                    <span>max</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-primary">
                  <Star className="w-4 h-4" /> Min Rating
                </h4>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setMinRating(star)}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        minRating >= star ? "text-yellow-500 bg-yellow-500/10" : "text-muted-foreground bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      )}
                    >
                      <Star className={cn("w-5 h-5", minRating >= star && "fill-current")} />
                    </button>
                  ))}
                  {minRating > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setMinRating(0)} className="text-[10px] font-black text-muted-foreground hover:bg-transparent">RESET</Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="font-bold text-muted-foreground animate-pulse">Syncing with global tech hubs...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
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
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className={cn(
                          "rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white",
                          isInWishlist(product.id) ? "text-red-500" : "text-black lg:opacity-0 lg:group-hover:opacity-100"
                        )}
                        onClick={() => toggleWishlist(product.id)}
                      >
                        <Heart className={cn("w-5 h-5", isInWishlist(product.id) && "fill-current")} />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white text-black lg:opacity-0 lg:group-hover:opacity-100"
                        onClick={() => setQuickViewProduct(product)}
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                      <Button 
                        className="w-full h-12 bg-white text-black hover:bg-white/90 font-black shadow-lg"
                        onClick={() => addToCart(product)}
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
                        {product.stock_quantity > 0 ? "IN STOCK" : "OUT OF STOCK"}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick View Modal */}
            <Dialog open={!!quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
              <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none">
                {quickViewProduct && (
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <img 
                        src={quickViewProduct.image} 
                        className="w-full h-full object-cover" 
                        alt={quickViewProduct.name}
                      />
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="space-y-6">
                        <div>
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 uppercase tracking-widest text-[10px] font-black mb-4">
                            {quickViewProduct.brand}
                          </Badge>
                          <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic leading-[0.9] mb-4">
                            {quickViewProduct.name.toUpperCase()}
                          </h2>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded text-xs font-black italic">
                              <Star className="w-3 h-3 fill-current" />
                              {quickViewProduct.rating} (Quick View)
                            </div>
                            <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                              {quickViewProduct.category}
                            </span>
                          </div>
                        </div>

                        <p className="text-4xl font-black text-primary italic tracking-tighter">
                          ${quickViewProduct.price}
                        </p>

                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Experience the pinnacle of technology with the all-new {quickViewProduct.name}. 
                          Engineered for performance and designed for the modern user.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                            <Truck className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-[10px] font-black uppercase text-muted-foreground">Delivery</p>
                              <p className="text-xs font-bold">24h Express</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-[10px] font-black uppercase text-muted-foreground">Warranty</p>
                              <p className="text-xs font-bold">24 Months</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button 
                            className="flex-1 h-14 rounded-2xl text-lg font-black italic tracking-tight shadow-xl shadow-primary/20"
                            onClick={() => {
                              addToCart(quickViewProduct);
                              setQuickViewProduct(null);
                            }}
                          >
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            ADD TO CART
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-14 w-14 rounded-2xl"
                            onClick={() => toggleWishlist(quickViewProduct.id)}
                          >
                            <Heart className={cn("w-6 h-6", isInWishlist(quickViewProduct.id) && "fill-red-500 text-red-500")} />
                          </Button>
                        </div>

                        <Link 
                          to={`/products/${quickViewProduct.id}`}
                          className="block text-center text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mt-4"
                          onClick={() => setQuickViewProduct(null)}
                        >
                          View Full Details
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
               <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-black italic mb-2">NO GADGETS FOUND</h3>
            <p className="text-muted-foreground max-w-md mx-auto">We couldn't find any electronics matching your criteria. Try adjusting your filters or search term.</p>
            <Button variant="link" onClick={() => { setSearchTerm(""); setSearchParams({ category: "all" }); }} className="mt-4 font-bold text-primary">Clear all filters</Button>
          </div>
        )}
      </main>
    </div>
  );
}
