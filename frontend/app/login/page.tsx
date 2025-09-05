"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // TODO: Call backend API for login
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 w-[400px] border-4 border-primary shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to StreamSync</h2>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-4"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-4"
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <Button onClick={handleLogin} className="w-full mb-2">Login</Button>
        <div className="text-center text-sm mt-2">
          Don't have an account? <Link href="/signup" className="text-primary underline">Sign up</Link>
        </div>
      </Card>
    </div>
  );
}
