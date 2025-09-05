"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    // TODO: Call backend API for signup
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 w-[400px] border-4 border-primary shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up for StreamSync</h2>
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
        <Button onClick={handleSignup} className="w-full mb-2">Sign Up</Button>
        <div className="text-center text-sm mt-2">
          Already have an account? <Link href="/login" className="text-primary underline">Login</Link>
        </div>
      </Card>
    </div>
  );
}
