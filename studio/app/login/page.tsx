"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@maatwork/ui";
import { Input } from "@maatwork/ui";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@maatwork/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent backdrop-blur-sm p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5 -z-10" />
      
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700 slide-in-from-bottom-8">
        <Card className="border-white/10 bg-black/60 backdrop-blur-2xl text-zinc-100 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <CardHeader className="space-y-2 pb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
               <span className="text-xl font-bold">M</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">MaatWork Hub</CardTitle>
            <CardDescription className="text-zinc-400 text-base">
              Acceso exclusivo para fundadores
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@maat.work"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/[0.03] border-white/5 h-12 focus:ring-primary/20 focus:border-primary/40 transition-all rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/[0.03] border-white/5 h-12 focus:ring-primary/20 focus:border-primary/40 transition-all rounded-xl"
                />
              </div>
            </CardContent>
            
            <CardFooter className="pt-4 pb-8">
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-sm tracking-widest transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? "VALIDANDO..." : "INGRESAR AL HUB"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
