import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { Smartphone, Laptop, Headphones, Watch, Speaker, Tablet, Gamepad, Zap, ArrowRight, Star, ShoppingBag, Truck, ShieldCheck, Clock, Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types";
import { handleFirestoreError, OperationType } from "@/lib/firestore-utils";

const CATEGORIES = [
  { name: "Phones", icon: Smartphone, count: "120+", color: "bg-blue-500/10 text-blue-500", slug: "smartphones" },
  { name: "Laptops", icon: Laptop, count: "80+", color: "bg-purple-500/10 text-purple-500", slug: "laptops" },
  { name: "Audio", icon: Headphones, count: "200+", color: "bg-orange-500/10 text-orange-500", slug: "audio" },
  { name: "Watches", icon: Watch, count: "45+", color: "bg-green-500/10 text-green-500", slug: "smart-watches" },
  { name: "Speakers", icon: Speaker, count: "30+", color: "bg-pink-500/10 text-pink-500", slug: "speakers" },
  { name: "Gaming", icon: Gamepad, count: "60+", color: "bg-red-500/10 text-red-500", slug: "gaming" },
];

export default function Home() {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("featured", "==", true), limit(3));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setFeaturedProducts(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "products");
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative h-[80vh] overflow-hidden bg-zinc-950">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover opacity-40"
              alt="Tech Background"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          </div>
          
          <div className="container mx-auto h-full px-4 relative z-10 flex flex-col justify-center items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 py-1 px-4 text-xs font-semibold uppercase tracking-widest">
                Official Apple & Samsung Partner
              </Badge>
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-[0.95]">
                UPGRADE YOUR <br />
                <span className="text-primary italic">DIGITAL LIFE.</span>
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
                Discover the latest smartphones, pro laptops, and high-fidelity audio equipment. Premium electronics delivered to your doorstep in Uganda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-lg font-bold group" asChild>
                  <Link to="/products">
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold bg-white/5 border-white/10 hover:bg-white/10 text-white" asChild>
                  <Link to="/products?featured=true">View Deals</Link>
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block"
          >
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2">
              <div className="w-1 h-2 bg-white/50 rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* Categories Section */}
        <section className="py-24 container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Shop by Category</h2>
              <p className="text-muted-foreground">Find the perfect gadget for your needs.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex" asChild>
              <Link to="/products">View All Categories <ArrowRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link 
                  to={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center p-8 rounded-3xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", cat.color)}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-center mb-1">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">{cat.count} items</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Hot Releases</h2>
                <p className="text-muted-foreground">The most anticipated gadgets of the season.</p>
              </div>
              <Button asChild>
                <Link to="/products">Shop All Products</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-3xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                ))
              ) : featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-card rounded-3xl border overflow-hidden hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-black border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">Featured</Badge>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-black"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                      <Button 
                        className="w-full h-12 bg-white text-black hover:bg-white/90 font-bold"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">{product.brand}</p>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                          <Link to={`/products/${product.id}`}>{product.name}</Link>
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded text-xs font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        {product.rating}
                      </div>
                    </div>
                    <p className="text-2xl font-black text-primary">${product.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Truck, title: "Fast Delivery", desc: "Delivery across Uganda within 24-48 hours. Express shipping available." },
              { icon: ShieldCheck, title: "Genuine Warranty", desc: "100% authentic products with official manufacturer warranty coverage." },
              { icon: Clock, title: "24/7 Support", desc: "Our expert tech team is always available to help with your purchase." },
              { icon: Zap, title: "Mobile Money", desc: "Seamless payment via MTN & Airtel Mobile Money or Card on delivery." },
            ].map((benefit, i) => (
              <div key={benefit.title} className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Newsletter / CTA */}
        <section className="pb-24 container mx-auto px-4">
          <div className="relative rounded-[40px] overflow-hidden bg-primary p-12 md:p-24 text-primary-foreground text-center flex flex-col items-center">
            <div className="absolute inset-0 z-0 opacity-10">
               <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Stay updated with the latest tech drops.</h2>
              <p className="text-primary-foreground/80 text-lg mb-10">Join our newsletter and get exclusive access to flash sales and new release alerts.</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
                <Input placeholder="Enter your email" className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                <Button className="h-12 px-8 bg-white text-primary hover:bg-white/90 font-bold">Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-950 text-zinc-400 py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-lg">S</div>
                <span className="font-bold text-xl text-white tracking-tighter">SOLO'S</span>
              </div>
              <p className="text-sm leading-relaxed">
                Uganda's premier destination for high-end electronics. Authorized dealer for Apple, Samsung, Sony, and more.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Quick Links</h4>
              <ul className="flex flex-col gap-4 text-sm">
                <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/products?category=smartphones" className="hover:text-white transition-colors">Smartphones</Link></li>
                <li><Link to="/products?category=laptops" className="hover:text-white transition-colors">Laptops</Link></li>
                <li><Link to="/products?featured=true" className="hover:text-white transition-colors">Weekly Deals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Customer Service</h4>
              <ul className="flex flex-col gap-4 text-sm">
                <li><Link to="/profile" className="hover:text-white transition-colors">Order Tracking</Link></li>
                <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Connect</h4>
              <p className="text-sm mb-4">Plot 12, Kampala Road, Kampala, Uganda</p>
              <p className="text-sm mb-6">+256 700 000 000</p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white w-full font-bold">
                 WhatsApp Order
              </Button>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 Solo's Phones & Electronics. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
