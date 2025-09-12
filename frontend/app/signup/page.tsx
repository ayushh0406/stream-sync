"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Spinner from "@/components/ui/spinner";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [retryCount, setRetryCount] = useState(0);
  const handleSignup = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    let attempts = 0;
    let lastError = "";
    while (attempts < 3) {
      try {
        const res = await fetch("http://localhost:5000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          lastError = data.detail || "Signup failed";
          break;
        } else {
          const data = await res.json();
          setSuccess("Signup successful! You can now login.");
          setLoading(false);
          return;
        }
      } catch (err) {
        lastError = "Network error. Retrying...";
        attempts++;
        await new Promise(res => setTimeout(res, 1000));
      }
    }
    setError(lastError || "Network error. Please check your connection and try again.");
    setLoading(false);
    setRetryCount(attempts);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 w-[400px] border-4 border-primary shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up for StreamSync</h2>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
          />
          <div className="text-xs text-muted-foreground mt-1">Use a valid email address.</div>
        </div>
        <div className="mb-4 relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="button" className="absolute right-2 top-2 text-xs text-primary" onClick={() => setShowPassword(v => !v)}>
            {showPassword ? "Hide" : "Show"}
          </button>
          <div className="text-xs text-muted-foreground mt-1">Choose a strong password.</div>
        </div>
        {error && <div className="text-red-600 font-semibold mb-2">{error} {retryCount > 0 && `(Tried ${retryCount}x)`}</div>}
        {success && <div className="text-green-600 font-semibold mb-2">{success}</div>}
        <Button onClick={handleSignup} className="w-full mb-2" disabled={loading}>
          {loading ? <Spinner /> : "Sign Up"}
        </Button>
        <div className="text-center text-sm mt-2">
          Already have an account? <Link href="/login" className="text-primary underline">Login</Link>
        </div>
      </Card>
    </div>
  );
}
