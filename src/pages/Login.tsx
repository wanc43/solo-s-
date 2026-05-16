import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Smartphone, Mail, Lock, ArrowRight, Github } from "lucide-react";

export default function Login() {
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

          <div className="space-y-4">
            <Button variant="outline" className="w-full h-12 rounded-xl gap-3 font-bold border-zinc-200 dark:border-zinc-800">
               <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
               Continue with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-black tracking-widest bg-card px-2 text-muted-foreground">
                Or email
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="name@domain.com" className="h-12 pl-11 rounded-xl" />
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
                   <Link to="/forgot" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" className="h-12 pl-11 rounded-xl" />
                </div>
             </div>
          </div>

          <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group">
             Sign In
             <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-center text-sm text-muted-foreground">
             Don't have an account?{" "}
             <Link to="/register" className="font-bold text-primary hover:underline">Sign up for free</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
