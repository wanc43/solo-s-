import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { User, Mail, Lock, Smartphone, ArrowRight } from "lucide-react";

export default function Register() {
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

          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="John Doe" className="h-12 pl-11 rounded-xl" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="name@domain.com" className="h-12 pl-11 rounded-xl" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" className="h-12 pl-11 rounded-xl" />
                </div>
             </div>
          </div>

          <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group">
             Create Account
             <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-center text-sm text-muted-foreground">
             Already have an account?{" "}
             <Link to="/login" className="font-bold text-primary hover:underline">Log in</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
