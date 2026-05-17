import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(formData);
      toast.success("Account created! Welcome to Solo's.");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Email might already be in use.");
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
            <h1 className="text-4xl font-black tracking-tighter italic mb-2">JOIN SOLO'S</h1>
            <p className="text-sm text-muted-foreground">The most exclusive electronics club in Uganda.</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-bold border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      name="name"
                      placeholder="John Doe" 
                      className="h-12 pl-11 rounded-xl"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      name="email"
                      type="email"
                      placeholder="name@domain.com" 
                      className="h-12 pl-11 rounded-xl"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      name="password"
                      type="password" 
                      placeholder="••••••••" 
                      className="h-12 pl-11 rounded-xl"
                      value={formData.password}
                      onChange={handleChange}
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
                   Create Account
                   <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </>
               )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
             Already have an account?{" "}
             <Link to="/login" className="font-bold text-primary hover:underline">Log in</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
