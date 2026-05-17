import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreditCard, Truck, ShieldCheck, MapPin, Phone, User, Smartphone, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/services/api";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "Kampala",
    district: "Central",
    momoNumber: ""
  });

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.productId,
          quantity: item.quantity
        })),
        total_amount: cartTotal,
        payment_method: paymentMethod,
        shipping_details: {
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district
        }
      };

      const response = await api.post("/orders/", orderData);
      setOrderId(response.data.id);
      
      toast.success("Order placed successfully!");
      clearCart();
      setStep(3);
    } catch (error) {
      console.error("Order failed:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && step < 3) {
    navigate("/cart");
    return null;
  }

  const updateFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-32 container mx-auto px-4 pb-24 max-w-5xl">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic">CHECKOUT</h1>
          <div className="flex items-center gap-4">
             {[1, 2, 3].map((s) => (
               <div 
                 key={s} 
                 className={cn(
                   "w-3 h-3 rounded-full transition-colors duration-500",
                   step >= s ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-800"
                 )} 
               />
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
             <AnimatePresence mode="wait">
               {step === 1 && (
                 <motion.div
                   key="step1"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="space-y-8"
                 >
                   <section className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                         <h2 className="text-2xl font-bold tracking-tight">Delivery Details</h2>
                      </div>
                      
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                           <Input name="fullName" value={formData.fullName} onChange={updateFormData} placeholder="John Doe" className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone Number</label>
                           <Input name="phone" value={formData.phone} onChange={updateFormData} placeholder="+256 700 000 000" className="h-12 rounded-xl" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Shipping Address (Uganda)</label>
                         <Input name="address" value={formData.address} onChange={updateFormData} placeholder="Apartment, Street, Area" className="h-12 rounded-xl" />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">City</label>
                           <Input name="city" value={formData.city} onChange={updateFormData} placeholder="Kampala" className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">District</label>
                           <Input name="district" value={formData.district} onChange={updateFormData} placeholder="Central" className="h-12 rounded-xl" />
                        </div>
                      </div>
                   </section>

                   <Button className="w-full h-14 rounded-2xl text-lg font-bold group" onClick={() => setStep(2)}>
                      Continue to Payment
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </Button>
                 </motion.div>
               )}

               {step === 2 && (
                 <motion.div
                   key="step2"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="space-y-8"
                 >
                   <section className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                         <h2 className="text-2xl font-bold tracking-tight">Payment Method</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div 
                          className={cn(
                            "p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col gap-4",
                            paymentMethod === "momo" ? "border-primary bg-primary/5" : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                          )}
                          onClick={() => setPaymentMethod("momo")}
                        >
                           <div className="flex justify-between items-start">
                              <Smartphone className={cn("w-8 h-8", paymentMethod === "momo" ? "text-primary" : "text-muted-foreground")} />
                              {paymentMethod === "momo" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                           </div>
                           <div>
                              <h3 className="font-bold">Mobile Money</h3>
                              <p className="text-xs text-muted-foreground">MTN or Airtel Money</p>
                           </div>
                        </div>

                        <div 
                          className={cn(
                            "p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col gap-4",
                            paymentMethod === "card" ? "border-primary bg-primary/5" : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                          )}
                          onClick={() => setPaymentMethod("card")}
                        >
                           <div className="flex justify-between items-start">
                              <CreditCard className={cn("w-8 h-8", paymentMethod === "card" ? "text-primary" : "text-muted-foreground")} />
                              {paymentMethod === "card" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                           </div>
                           <div>
                              <h3 className="font-bold">Credit/Debit Card</h3>
                              <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                           </div>
                        </div>
                      </div>

                      {paymentMethod === "momo" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-yellow-400 p-8 rounded-3xl space-y-4"
                        >
                           <div className="flex items-center gap-4">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/1024px-MTN_Logo.svg.png" className="h-8 object-contain" />
                              <span className="font-black text-black italic text-xl tracking-tighter">MTN MOBILE MONEY</span>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-black/60">Phone Number to Charge</label>
                              <Input name="momoNumber" value={formData.momoNumber} onChange={updateFormData} placeholder="077XXXXXXX" className="h-12 rounded-xl bg-white/20 border-black/10 text-black placeholder:text-black/40 font-bold" />
                           </div>
                           <p className="text-xs text-black/70 font-medium">You will receive a USSD prompt on your phone to authorize payment of ${cartTotal.toLocaleString()}.</p>
                        </motion.div>
                      )}
                   </section>

                   <div className="flex gap-4">
                      <Button variant="outline" className="h-14 rounded-2xl px-8 font-bold" onClick={() => setStep(1)}>Back</Button>
                      <Button 
                        className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-xl" 
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                      >
                         {isProcessing ? "Processing..." : `PAY $${cartTotal.toLocaleString()}`}
                      </Button>
                   </div>
                 </motion.div>
               )}

               {step === 3 && (
                 <motion.div
                   key="step3"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex flex-col items-center justify-center py-12 text-center"
                 >
                   <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-green-500/20">
                      <CheckCircle2 className="w-12 h-12" />
                   </div>
                   <h2 className="text-4xl font-black tracking-tighter mb-4 italic">ORDER SUCCESS!</h2>
                   <p className="text-muted-foreground mb-8 max-w-md">Your order has been received and is being processed. We'll send you a confirmation on WhatsApp shortly.</p>
                   <div className="w-full bg-zinc-100 dark:bg-zinc-800 p-6 rounded-3xl border mb-8 flex justify-between items-center">
                      <div className="text-left font-mono">
                         <p className="text-xs text-muted-foreground uppercase">Order ID</p>
                         <p className="font-bold text-lg">#SLO-{Math.floor(100000 + Math.random() * 900000)}</p>
                      </div>
                      <Badge className="bg-green-600">Pending Confirmation</Badge>
                   </div>
                   <Button size="lg" className="rounded-2xl h-14 px-12 font-bold" asChild>
                      <Link to="/">Back to Store</Link>
                   </Button>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          <div className="lg:col-span-2">
             <div className="p-8 rounded-[2.5rem] border bg-card/50 space-y-6 sticky top-32">
                <h3 className="text-2xl font-bold tracking-tight">Order Summary</h3>
                <ScrollArea className="max-h-[300px] pr-4">
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center gap-4">
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                               <img src={item.image} className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                               <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                            </div>
                         </div>
                         <p className="font-bold text-sm text-primary">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="pt-6 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Original Total</span>
                    <span>${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Uganda Delivery</span>
                    <span className="text-green-600 font-bold uppercase text-[10px]">Free</span>
                  </div>
                  <div className="pt-4 flex justify-between items-end">
                    <span className="font-bold">Total Amount</span>
                    <span className="text-3xl font-black text-primary tracking-tighter">${cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-6 space-y-4">
                   <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Truck className="w-4 h-4 text-primary" />
                      <span>Delivery in 24h to Kampala districts</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span>Solo's Ironclad 24-Month Hardware Warranty</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
