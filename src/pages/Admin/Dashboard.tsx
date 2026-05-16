import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Settings, TrendingUp, 
  ArrowUpRight, ArrowDownRight, PackagePlus, Bell, Search, LogOut, Database, Loader2,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const PRODUCTS_SEED = [
  { name: "iPhone 15 Pro Max", brand: "Apple", price: 1199, image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800", rating: 4.9, category: "smartphones", stock_quantity: 50, slug: "iphone-15-pro-max", featured: true },
  { name: "MacBook Air M3", brand: "Apple", price: 1099, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", rating: 4.8, category: "laptops", stock_quantity: 30, slug: "macbook-air-m3", featured: true },
  { name: "Sony WH-1000XM5", brand: "Sony", price: 399, image: "https://images.unsplash.com/photo-1618366712214-8c075189d0ad?w=800", rating: 4.7, category: "audio", stock_quantity: 100, slug: "sony-wh-1000xm5", featured: true },
  { name: "Samsung S24 Ultra", brand: "Samsung", price: 1299, image: "https://images.unsplash.com/photo-1707064841961-73602d504505?w=800", rating: 4.9, category: "smartphones", stock_quantity: 40, slug: "samsung-s24-ultra" },
  { name: "Apple Watch Ultra 2", brand: "Apple", price: 799, image: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?w=800", rating: 4.8, category: "smart-watches", stock_quantity: 25, slug: "apple-watch-ultra-2" },
  { name: "iPad Pro M2", brand: "Apple", price: 999, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800", rating: 4.8, category: "tablets", stock_quantity: 15, slug: "ipad-pro-m2" },
  { name: "ROG Ally X", brand: "ASUS", price: 799, image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800", rating: 4.6, category: "gaming", stock_quantity: 20, slug: "rog-ally-x" },
  { name: "Logitech MX Master 3S", brand: "Logitech", price: 99, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800", rating: 4.9, category: "accessories", stock_quantity: 150, slug: "logitech-mx-master-3s" },
];

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: LayoutDashboard, path: "/admin" },
  { name: "Products", icon: Package, path: "/admin/products" },
  { name: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { name: "Customers", icon: Users, path: "/admin/customers" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      toast.error("Unauthorized access.");
      navigate("/");
    }
  }, [user, profile, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return null;
  }

  const seedDatabase = async () => {
    setIsSeeding(true);
    const batch = writeBatch(db);
    
    try {
      PRODUCTS_SEED.forEach((product) => {
        const productRef = doc(collection(db, "products"));
        batch.set(productRef, {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
      toast.success("Database seeded successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
      toast.error("Failed to seed database.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-72 border-r bg-card flex flex-col">
        <div className="h-20 flex items-center px-8 border-b">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-black">S</div>
              <span className="font-black tracking-tighter">SOLO'S <span className="text-[10px] text-muted-foreground font-normal uppercase">Admin</span></span>
           </div>
        </div>
        
        <ScrollArea className="flex-1 px-4 py-6">
           <nav className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm group",
                    location.pathname === item.path 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.name}
                  {item.name === "Orders" && <Badge className="ml-auto bg-primary-foreground text-primary">12</Badge>}
                </Link>
              ))}
           </nav>
        </ScrollArea>

        <div className="p-4 border-t">
           <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
              Sign Out
           </Button>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b bg-card flex items-center justify-between px-8">
           <h2 className="text-lg font-bold tracking-tight">Admin Overview</h2>
           <div className="flex items-center gap-4">
              <div className="relative w-96 hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input className="w-full h-10 pl-9 rounded-xl border bg-zinc-50 dark:bg-zinc-900 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Search orders, products..." />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                 <Bell className="w-5 h-5" />
                 <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              </Button>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
           </div>
        </header>

        <ScrollArea className="flex-1 p-8">
           <div className="max-w-7xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                   { title: "Total Revenue", value: "$45,231.00", trend: "+12.5%", icon: TrendingUp },
                   { title: "New Orders", value: "342", trend: "+8.1%", icon: ShoppingCart },
                   { title: "Active Users", value: "1,203", trend: "-2.4%", icon: Users },
                   { title: "Inventory", value: "89%", trend: "Healthy", icon: Package },
                 ].map((stat, i) => (
                   <Card key={i} className="rounded-3xl border-none shadow-sm overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
                        <stat.icon className="w-4 h-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-black italic tracking-tighter mb-1">{stat.value}</div>
                        <p className={cn(
                          "text-[10px] font-bold uppercase",
                          stat.trend.startsWith('+') ? "text-green-600" : "text-red-500"
                        )}>
                          {stat.trend} from last month
                        </p>
                      </CardContent>
                   </Card>
                 ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <Card className="lg:col-span-2 rounded-[2.5rem] border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                       <div>
                          <CardTitle className="text-2xl font-black italic">RECENT ORDERS</CardTitle>
                          <CardDescription>View and manage your latest transactions.</CardDescription>
                       </div>
                       <Button size="sm" variant="outline" className="rounded-xl">View Records</Button>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-6">
                          {[
                            { id: "12984", customer: "Aaron W.", amount: "$1,299", status: "Delivered", date: "2 mins ago" },
                            { id: "12983", customer: "Sarah K.", amount: "$450", status: "Processing", date: "15 mins ago" },
                            { id: "12982", customer: "John M.", amount: "$2,100", status: "Pending", date: "1 hour ago" },
                            { id: "12981", customer: "Elena R.", amount: "$89", status: "Cancelled", date: "Yesterday" },
                          ].map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                     <ShoppingCart className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <p className="font-bold">ORD-{order.id}</p>
                                     <p className="text-xs text-muted-foreground">{order.customer} • {order.date}</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className="font-black italic">{order.amount}</p>
                                  <Badge className={cn(
                                    "text-[10px] uppercase font-black tracking-widest",
                                    order.status === "Delivered" ? "bg-green-600" : 
                                    order.status === "Processing" ? "bg-blue-500" :
                                    order.status === "Pending" ? "bg-yellow-500 text-black" : "bg-red-500"
                                  )}>{order.status}</Badge>
                               </div>
                            </div>
                          ))}
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="rounded-[2.5rem] border shadow-sm flex flex-col">
                    <CardHeader>
                       <CardTitle className="text-2xl font-black italic">QUICK ACTIONS</CardTitle>
                       <CardDescription>Add new inventory or users.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <Button className="w-full h-14 rounded-2xl gap-3 font-bold text-lg">
                          <PackagePlus className="w-6 h-6" />
                          Add Product
                       </Button>
                       <Button 
                          variant="outline" 
                          className="w-full h-14 rounded-2xl gap-3 font-bold border-zinc-200 dark:border-zinc-800"
                          onClick={seedDatabase}
                          disabled={isSeeding}
                       >
                          {isSeeding ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <Database className="w-6 h-6" />
                          )}
                          Seed Database
                       </Button>
                       <div className="pt-6">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Storage Usage</h4>
                          <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                             <div className="h-full bg-primary w-[65%]" />
                          </div>
                          <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground">
                             <span>1.2 GB / 2 GB</span>
                             <span>65%</span>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </ScrollArea>
      </main>
    </div>
  );
}
