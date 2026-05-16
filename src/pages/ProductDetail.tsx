import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, ShoppingBag, Heart, Truck, ShieldCheck, Zap, ArrowLeft, CheckCircle2, ChevronRight, Info } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { 
    id: "1", 
    name: "iPhone 15 Pro Max", 
    brand: "Apple", 
    price: 1199, 
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800",
    images: [
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800",
      "https://images.unsplash.com/photo-1695048133142-13c8ed4ad43c?w=800",
      "https://images.unsplash.com/photo-1695048132717-57ecc6143963?w=800"
    ],
    rating: 4.9, 
    reviews: 1240,
    category: "smartphones",
    description: "The iPhone 15 Pro Max features a strong and light titanium design, a new Action button, and the most powerful iPhone camera system ever. With the A17 Pro chip, it's a monster for mobile gaming and pro productivity.",
    specs: {
      display: '6.7-inch Super Retina XDR',
      chip: 'A17 Pro chip with 6-core GPU',
      camera: '48MP Main | 12MP Ultra Wide | 12MP 5x Telephoto',
      battery: 'Up to 29 hours video playback'
    }
  },
  { id: "2", name: "MacBook Air M3", brand: "Apple", price: 1099, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", rating: 4.8, category: "laptops" },
  // ... others
];

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === slug) || PRODUCTS[0];
  const [selectedImage, setSelectedImage] = React.useState(product.image);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-32 container mx-auto px-4 pb-24">
        <Button variant="ghost" className="mb-8 group" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Images */}
          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="aspect-square rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-800 border"
            >
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
              {(product.images || [product.image]).map((img, i) => (
                <button 
                  key={i}
                  className={cn(
                    "aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300",
                    selectedImage === img ? "border-primary scale-95" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 uppercase tracking-widest text-[10px] font-black">{product.brand}</Badge>
                 <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded text-xs font-black italic">
                    <Star className="w-3 h-3 fill-current" />
                    {product.rating} ({product.reviews || 0} Reviews)
                 </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-[0.9]">{product.name.toUpperCase()}</h1>
              <p className="text-3xl font-black text-primary tracking-tighter">${product.price}</p>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              {product.description || "The latest in high-performance technology. Experience the future with this premium device, designed for excellence."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <Button size="lg" className="h-16 px-12 rounded-2xl text-xl font-black shadow-2xl shadow-primary/20 flex-1" onClick={() => addToCart(product as any)}>
                  <ShoppingBag className="w-6 h-6 mr-3" /> ADD TO CART
               </Button>
               <Button variant="outline" size="lg" className="h-16 w-16 rounded-2xl p-0 border-zinc-200 dark:border-zinc-800">
                  <Heart className="w-6 h-6" />
               </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8">
               <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground">Delivery</p>
                    <p className="text-xs font-bold">24h Express</p>
                  </div>
               </div>
               <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground">Warranty</p>
                    <p className="text-xs font-bold">24 Months</p>
                  </div>
               </div>
            </div>

            <Tabs defaultValue="specs" className="pt-8">
               <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 gap-8">
                  <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 font-black uppercase tracking-widest text-[10px]">Specifications</TabsTrigger>
                  <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 font-black uppercase tracking-widest text-[10px]">Returns & Shipping</TabsTrigger>
               </TabsList>
               <TabsContent value="specs" className="pt-6 space-y-4">
                  {Object.entries(product.specs || { 'Model': 'Latest 2026', 'Release': 'September', 'Port': 'USB-C' }).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b pb-2 text-sm italic">
                      <span className="text-muted-foreground font-medium capitalize">{key}</span>
                      <span className="font-black tracking-tight">{val as string}</span>
                    </div>
                  ))}
               </TabsContent>
               <TabsContent value="shipping" className="pt-6 text-sm text-muted-foreground space-y-4 leading-relaxed">
                  <p>Shipping takes 24 hours within Kampala and 48 hours to upcountry locations across Uganda.</p>
                  <p>We use secure MTN/Airtel payment systems. Returns are accepted within 7 days for factory defects.</p>
               </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
