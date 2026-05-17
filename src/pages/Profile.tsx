import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Package, MapPin, Heart, LogOut, ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Order, Product } from "@/types";
import { useWishlist } from "@/contexts/WishlistContext";
import api from "@/services/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      setLoading(true);
      try {
        const response = await api.get('/orders/');
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (!user || wishlist.length === 0) {
        setWishlistProducts([]);
        return;
      }
      setLoadingWishlist(true);
      try {
        const productPromises = wishlist.map(id => api.get(`/products/${id}/`));
        const responses = await Promise.all(productPromises);
        setWishlistProducts(responses.map(res => res.data));
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setLoadingWishlist(false);
      }
    }

    fetchWishlistProducts();
  }, [user, wishlist]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const initials = user.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 pt-32 container mx-auto px-4 pb-24 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
           <Card className="w-full md:w-80 rounded-[2.5rem] border shadow-sm">
              <CardContent className="pt-10 flex flex-col items-center">
                 <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black mb-4">
                   {initials}
                 </div>
                 <h2 className="text-xl font-bold">{user.displayName || "Member"}</h2>
                 <p className="text-sm text-muted-foreground mb-6">{user.email}</p>
                 <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase tracking-widest text-[10px] font-black">
                   {user.role === 'admin' ? "ADMIN" : "MEMBER"}
                 </Badge>
                 
                 <div className="w-full mt-10 space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl font-bold" asChild>
                       <Link to="/profile">
                          <Package className="w-5 h-5" /> My Orders
                       </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl font-bold" asChild>
                       <a href="#wishlist">
                          <Heart className="w-5 h-5" /> Wishlist
                       </a>
                    </Button>
                    {user.role === 'admin' && (
                      <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl font-bold" asChild>
                         <Link to="/admin">
                            <ShieldCheck className="w-5 h-5" /> Admin Panel
                         </Link>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3 rounded-xl font-bold text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                       <LogOut className="w-5 h-5" /> Logout
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <div className="flex-1 space-y-8">
              <section>
                 <h3 className="text-2xl font-black tracking-tighter italic mb-6">ORDER HISTORY</h3>
                 {loading ? (
                   <div className="flex justify-center py-12">
                     <Loader2 className="w-8 h-8 text-primary animate-spin" />
                   </div>
                 ) : orders.length > 0 ? (
                   <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="rounded-3xl border shadow-sm group hover:shadow-md transition-shadow">
                           <CardContent className="p-6 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                    <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                                 </div>
                                 <div>
                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                                    <p className="font-bold">
                                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-6">
                                 <div className="text-right hidden sm:block">
                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Total</p>
                                    <p className="font-bold italic">${order.totalAmount.toLocaleString()}</p>
                                 </div>
                                 <Badge className={cn(
                                   "uppercase text-[10px] font-black",
                                   order.status === 'delivered' ? "bg-green-600" : "bg-orange-500"
                                 )}>
                                   {order.status}
                                 </Badge>
                                 <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                    <ChevronRight className="w-5 h-5" />
                                  </Button>
                              </div>
                           </CardContent>
                        </Card>
                      ))}
                   </div>
                 ) : (
                   <div className="bg-white dark:bg-zinc-900 border rounded-3xl p-12 text-center">
                     <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                     <p className="font-bold text-muted-foreground">You haven't placed any orders yet.</p>
                     <Button variant="link" asChild className="mt-2 text-primary font-bold">
                       <Link to="/products">Start Shopping</Link>
                     </Button>
                   </div>
                 )}
              </section>

              <section id="wishlist">
                  <h3 className="text-2xl font-black tracking-tighter italic mb-6">WISHLIST</h3>
                  {loadingWishlist ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {wishlistProducts.map((product) => (
                         <Card key={product.id} className="rounded-3xl border shadow-sm group hover:shadow-md transition-shadow overflow-hidden">
                            <CardContent className="p-0 flex h-24">
                               <Link to={`/products/${product.id}`} className="w-24 h-full bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                               </Link>
                               <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden">
                                  <div>
                                     <h4 className="font-bold text-xs line-clamp-1 truncate">{product.name}</h4>
                                     <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{product.brand}</p>
                                  </div>
                                  <div className="flex items-center justify-between">
                                     <p className="font-black text-primary italic text-sm">${product.price.toLocaleString()}</p>
                                     <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                      onClick={() => toggleWishlist(product.id)}
                                     >
                                        <Heart className="w-4 h-4 fill-current" />
                                     </Button>
                                  </div>
                               </div>
                            </CardContent>
                         </Card>
                       ))}
                    </div>
                  ) : (
                    <Card className="rounded-3xl border shadow-sm p-12 text-center">
                       <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                       <p className="font-bold text-muted-foreground">Your wishlist is lonely.</p>
                       <Button variant="link" asChild className="mt-2 text-primary font-bold">
                         <Link to="/products">Explore Gadgets</Link>
                       </Button>
                    </Card>
                  )}
               </section>

              <section>
                 <h3 className="text-2xl font-black tracking-tighter italic mb-6">SHIPPING INFO</h3>
                 <Card className="rounded-[2rem] border shadow-sm p-8 flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                       <MapPin className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold mb-2">Default Address</h4>
                       <p className="text-sm text-muted-foreground line-clamp-2">
                         {user.address || "No address provided yet. Add one at checkout."}
                       </p>
                       {user.phoneNumber && (
                         <p className="text-sm text-muted-foreground mt-2 font-bold italic">{user.phoneNumber}</p>
                       )}
                       <Button variant="link" className="p-0 h-auto mt-4 font-bold text-primary">Edit Details</Button>
                    </div>
                 </Card>
              </section>
           </div>
        </div>
      </main>
    </div>
  );
}
