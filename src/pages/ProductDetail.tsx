import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, ShoppingBag, Heart, Truck, ShieldCheck, ArrowLeft, ChevronRight, Info, Loader2, Minus, Plus, Facebook, Twitter, MessageCircle, Share2 } from "lucide-react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Product, Review } from "@/types";
import api from "@/services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [quantity, setQuantity] = useState(1);

  // Reset quantity and scroll to top when product ID changes
  useEffect(() => {
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}/`);
        const data = response.data as Product;
        setProduct(data);
        setSelectedImage(data.image);

        // Fetch reviews (Assuming /products/{id}/reviews/ or similar)
        try {
          const reviewsResponse = await api.get(`/products/${id}/reviews/`);
          setReviews(reviewsResponse.data);
        } catch (e) {
          console.warn("Reviews endpoint not found, using data if available", e);
        }

        // Fetch Related Products (Assume /products/ supports category filtering)
        try {
          const relatedResponse = await api.get(`/products/?category=${data.category}`);
          const relatedData = relatedResponse.data.filter((p: Product) => p.id !== id).slice(0, 4);
          setRelatedProducts(relatedData);
        } catch (e) {
          console.error("Failed to fetch related products", e);
        }

        // Check if purchased
        if (user) {
          try {
            const ordersResponse = await api.get('/orders/');
            const purchased = ordersResponse.data.some((order: any) => 
               order.items.some((item: any) => item.productId === id) && order.status === 'delivered'
            );
            setHasPurchased(purchased);
          } catch (e) {
            console.error("Failed to check purchase history", e);
          }
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Product not found");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, navigate, user]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setSubmittingReview(true);
    try {
      const reviewData = {
        rating: newReview.rating,
        comment: newReview.comment,
      };

      const response = await api.post(`/products/${id}/reviews/`, reviewData);
      setReviews([response.data, ...reviews]);
      setNewReview({ rating: 5, comment: "" });
      toast.success("Review submitted successfully");
    } catch (error) {
      console.error("Failed to submit review", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : null;

  const shareProduct = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this ${product?.name} at Solo's Phones!`;
    
    switch(platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="w-12 h-12 text-primary animate-spin" />
           <p className="font-bold text-muted-foreground animate-pulse">Retreiving gadget identity...</p>
        </main>
      </div>
    );
  }

  if (!product) return null;

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
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                    {averageRating || product.rating} ({reviews.length > 0 ? reviews.length : (product.reviews || 0)} Reviews)
                 </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-[0.9]">{product.name.toUpperCase()}</h1>
              <p className="text-3xl font-black text-primary tracking-tighter">${product.price}</p>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              {product.description || "The latest in high-performance technology. Experience the future with this premium device, designed for excellence."}
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Select Quantity</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-1 border">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-12 w-12 rounded-xl"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-12 w-12 rounded-xl"
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      disabled={quantity >= 99}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground italic">
                    {product.stock_quantity > 0 ? `${product.stock_quantity} units available` : "Out of stock"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="h-16 px-12 rounded-2xl text-xl font-black shadow-2xl shadow-primary/20 flex-1 group" 
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stock_quantity <= 0}
                >
                    <ShoppingBag className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" /> ADD TO CART
                </Button>
                <Button 
                  variant="outline" 
                   size="lg" 
                  className={cn(
                    "h-16 w-16 rounded-2xl p-0 border-zinc-200 dark:border-zinc-800 transition-all",
                    isInWishlist(product.id) ? "text-red-500 bg-red-50 dark:bg-red-950/20" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  )}
                  onClick={() => toggleWishlist(product.id)}
                >
                    <Heart className={cn("w-6 h-6", isInWishlist(product.id) && "fill-current")} />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Share:</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border hover:text-blue-600" onClick={() => shareProduct('facebook')}>
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border hover:text-sky-400" onClick={() => shareProduct('twitter')}>
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border hover:text-green-500" onClick={() => shareProduct('whatsapp')}>
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border hover:text-primary" onClick={() => shareProduct('copy')}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
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
                  <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 font-black uppercase tracking-widest text-[10px]">Reviews ({reviews.length})</TabsTrigger>
                  <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 font-black uppercase tracking-widest text-[10px]">Returns</TabsTrigger>
               </TabsList>
               <TabsContent value="specs" className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(product.specs && Object.keys(product.specs).length > 0) ? Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex flex-col border-b pb-2 space-y-1">
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{key}</span>
                        <span className="font-bold tracking-tight italic">{val as string}</span>
                      </div>
                    )) : (
                      <>
                        <div className="flex flex-col border-b pb-2 space-y-1">
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Display</span>
                          <span className="font-bold tracking-tight italic">Liquid Retina XDR</span>
                        </div>
                        <div className="flex flex-col border-b pb-2 space-y-1">
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Connectivity</span>
                          <span className="font-bold tracking-tight italic">5G, Wi-Fi 6E, Bluetooth 5.3</span>
                        </div>
                        <div className="flex flex-col border-b pb-2 space-y-1">
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Battery</span>
                          <span className="font-bold tracking-tight italic">Up to 24 hours playback</span>
                        </div>
                        <div className="flex flex-col border-b pb-2 space-y-1">
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Chip</span>
                          <span className="font-bold tracking-tight italic">Next-gen AI Processor</span>
                        </div>
                      </>
                    )}
                  </div>
               </TabsContent>
               <TabsContent value="reviews" className="pt-6 space-y-8">
                  {user && hasPurchased && (
                    <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border space-y-4">
                      <div>
                        <h4 className="font-black text-sm italic mb-1 uppercase tracking-tight">LEAVE A REVIEW</h4>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Share your technical experience</p>
                      </div>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className={cn(
                                "p-1 transition-all",
                                newReview.rating >= star ? "text-yellow-500 scale-110" : "text-muted-foreground opacity-30"
                              )}
                            >
                              <Star className={cn("w-6 h-6", newReview.rating >= star && "fill-current")} />
                            </button>
                          ))}
                        </div>
                        <textarea 
                          placeholder="Your technical analysis of this gadget..."
                          className="w-full h-32 p-4 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium"
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          required
                        />
                        <Button 
                          className="w-full h-12 font-black italic tracking-tighter" 
                          disabled={submittingReview}
                          type="submit"
                        >
                          {submittingReview ? "UPLOADING..." : "SUBMIT REVIEW"}
                        </Button>
                      </form>
                    </div>
                  )}

                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="border-b pb-6 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black italic">
                                  {rev.userName.slice(0, 2).toUpperCase()}
                               </div>
                               <div>
                                  <p className="text-xs font-bold">{rev.userName}</p>
                                  <div className="flex items-center text-yellow-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star key={i} className={cn("w-3 h-3", i < rev.rating ? "fill-current" : "opacity-30")} />
                                    ))}
                                  </div>
                               </div>
                            </div>
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">
                              {rev.createdAt instanceof Date ? rev.createdAt.toLocaleDateString() : 'Just now'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed italic">"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 flex flex-col items-center">
                       <Info className="w-8 h-8 text-muted-foreground mb-4 opacity-50" />
                       <p className="text-sm font-bold text-muted-foreground italic tracking-tight">No reviews yet. Be the first to analyze this gadget.</p>
                    </div>
                  )}
               </TabsContent>
               <TabsContent value="shipping" className="pt-6 text-sm text-muted-foreground space-y-4 leading-relaxed italic">
                  <p>Shipping takes 24 hours within Kampala and 48 hours to upcountry locations across Uganda.</p>
                  <p>We use secure payment systems. Returns are accepted within 7 days for factory defects.</p>
               </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-32 space-y-12">
            <div className="flex items-end justify-between border-b pb-8">
              <div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none">YOU MIGHT ALSO LIKE</h2>
                <p className="text-muted-foreground text-sm font-black uppercase tracking-widest mt-4">Discover similar high-performance gadgets</p>
              </div>
              <Button variant="ghost" asChild className="hidden md:flex font-black italic">
                <Link to="/products">SEE ALL <ChevronRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((rel) => (
                <motion.div
                  key={rel.id}
                  whileHover={{ y: -10 }}
                  className="group bg-card rounded-[2rem] border overflow-hidden transition-all duration-300 flex flex-col"
                >
                  <Link to={`/products/${rel.id}`} className="block aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                    <img 
                      src={rel.image} 
                      alt={rel.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Button variant="secondary" className="font-black italic rounded-xl">QUICK LOOK</Button>
                    </div>
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">{rel.brand}</p>
                    <h3 className="font-bold mb-4 line-clamp-1 group-hover:text-primary transition-colors">
                      <Link to={`/products/${rel.id}`}>{rel.name}</Link>
                    </h3>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-xl font-black text-primary tracking-tighter">${rel.price}</p>
                      <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded text-[10px] font-black italic">
                        <Star className="w-3 h-3 fill-current" />
                        {rel.rating}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
