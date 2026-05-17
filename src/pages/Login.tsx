import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
      toast.success("Welcome to Solo's Phones!");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 pt-32">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full max-w-md bg-card border rounded-[2.5rem] p-10 shadow-2xl space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tighter italic mb-2">WELCOME BACK</h1>
            <p className="text-sm text-muted-foreground">Login to access your orders and wishlist.</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-bold border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="email"
                      placeholder="name@domain.com" 
                      className="h-12 pl-11 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
                     <Link to="/forgot" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="h-12 pl-11 rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
               </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group"
              disabled={isSubmitting}
            >
               {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                 <>
                   Sign In
                   <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </>
               )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
             Don't have an account?{" "}
             <Link to="/register" className="font-bold text-primary hover:underline">Sign up for free</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
