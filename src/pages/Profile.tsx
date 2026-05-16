import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Package, MapPin, Heart, LogOut, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 pt-32 container mx-auto px-4 pb-24 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
           <Card className="w-full md:w-80 rounded-[2.5rem] border shadow-sm">
              <CardContent className="pt-10 flex flex-col items-center">
                 <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black mb-4">JD</div>
                 <h2 className="text-xl font-bold">John Doe</h2>
                 <p className="text-sm text-muted-foreground mb-6">john.doe@example.com</p>
                 <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase tracking-widest text-[10px] font-black">Member Since 2026</Badge>
                 
                 <div className="w-full mt-10 space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl font-bold" asChild>
                       <Link to="/profile">
                          <Package className="w-5 h-5" /> My Orders
                       </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl font-bold" asChild>
                       <Link to="/profile">
                          <Heart className="w-5 h-5" /> Wishlist
                       </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl font-bold text-red-500 hover:text-red-600 hover:bg-red-50" asChild>
                       <Link to="/login">
                          <LogOut className="w-5 h-5" /> Logout
                       </Link>
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <div className="flex-1 space-y-8">
              <section>
                 <h3 className="text-2xl font-black tracking-tighter italic mb-6">RECENT ORDERS</h3>
                 <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Card key={i} className="rounded-3xl border shadow-sm group hover:shadow-md transition-shadow">
                         <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                  <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                               </div>
                               <div>
                                  <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Order #SLO-8273{i}</p>
                                  <p className="font-bold">Placed on May {16-i}, 2026</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-6">
                               <div className="text-right hidden sm:block">
                                  <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Total</p>
                                  <p className="font-bold italic">$1,299.00</p>
                               </div>
                               <Badge className="bg-green-600">DELIVERED</Badge>
                               <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                  <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                         </CardContent>
                      </Card>
                    ))}
                 </div>
              </section>

              <section>
                 <h3 className="text-2xl font-black tracking-tighter italic mb-6">SHIPPING INFO</h3>
                 <Card className="rounded-[2rem] border shadow-sm p-8 flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                       <MapPin className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold mb-2">Default Address</h4>
                       <p className="text-sm text-muted-foreground line-clamp-2">Plot 12, Kampala Road, Kampala Central, Uganda</p>
                       <p className="text-sm text-muted-foreground mt-2 font-bold italic">+256 772 123 456</p>
                       <Button variant="link" className="p-0 h-auto mt-4 font-bold text-primary">Edit Address</Button>
                    </div>
                 </Card>
              </section>
           </div>
        </div>
      </main>
    </div>
  );
}
