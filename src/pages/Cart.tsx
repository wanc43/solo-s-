import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Truck, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "motion/react";

export default function Cart() {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-32 container mx-auto px-4 pb-24">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 italic">SHOPPING BAG</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md">Looks like you haven't added any high-end tech to your collection yet.</p>
            <Button size="lg" className="rounded-xl h-14 px-8" asChild>
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-6 p-6 rounded-[2rem] border bg-card/50 hover:bg-card transition-colors relative group"
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg sm:text-xl line-clamp-1">{item.name}</h3>
                        <p className="font-black text-xl">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-auto">Unit price: ${item.price}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1 border rounded-xl p-1 bg-background">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <Button variant="ghost" asChild className="group">
                <Link to="/products">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="p-8 rounded-[2.5rem] border bg-card/50 space-y-6 sticky top-32 shadow-sm">
                <h3 className="text-2xl font-bold tracking-tight">Order Summary</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-bold uppercase text-[10px]">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax estimate</span>
                    <span className="font-bold">$0.00</span>
                  </div>
                  <div className="pt-4 border-t flex justify-between items-end">
                    <span className="font-bold text-lg">Estimated Total</span>
                    <span className="text-3xl font-black text-primary tracking-tighter">${cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                
                <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl" asChild>
                  <Link to="/checkout">PROCEED TO CHECKOUT</Link>
                </Button>
                
                <div className="pt-6 space-y-4">
                   <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Truck className="w-4 h-4 text-primary" />
                      <span>Free delivery to Kampala & Entebbe</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span>24-month hardware warranty</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Zap className="w-4 h-4 text-primary" />
                      <span>Pay via Mobile Money (MTN/Airtel)</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
