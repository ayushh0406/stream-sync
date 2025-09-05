"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, logout } = require("@/lib/auth-context").useAuth();
  return (
  <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-4 border-b-2 border-primary bg-white/80 backdrop-blur-md shadow-md">
        <h1 className="text-3xl font-black text-primary tracking-tight">StreamSync</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm">{user}</span>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="default" size="sm">Login</Button>
          </Link>
        )}
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl sm:text-7xl font-extrabold text-primary mb-6 drop-shadow-xl">
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Personalized Streaming, Perfectly Timed</span>
          </h2>
          <p className="text-lg sm:text-2xl text-gray-700 mb-8 font-medium">
            Real-time, synchronized streaming for large-scale events.<br className="hidden sm:inline" /> Join anytime, watch in perfect sync, and interact live.
          </p>
          <Link href="/watch">
            <Button size="lg" className="text-lg px-8 shadow-xl border-2 border-primary bg-primary text-primary-foreground hover:bg-blue-600 transition-all">
              <Play className="mr-2 h-5 w-5" /> Join Stream
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/60">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border-4 border-primary shadow-xl hover:scale-105 transition-transform bg-white">
              <Zap className="h-12 w-12 mb-4 text-blue-500" />
              <h3 className="text-xl font-bold mb-2 text-primary">Global Timeline Sync</h3>
              <p className="text-gray-700 text-base">
                Late joiners start exactly where they should. Frame-perfect alignment for all viewers.
              </p>
            </Card>
            <Card className="p-8 border-4 border-primary shadow-xl hover:scale-105 transition-transform bg-white">
              <Users className="h-12 w-12 mb-4 text-green-500" />
              <h3 className="text-xl font-bold mb-2 text-primary">Live Chat & Reactions</h3>
              <p className="text-gray-700 text-base">
                Engage with others in real-time. Share reactions, chat, and experience together.
              </p>
            </Card>
            <Card className="p-8 border-4 border-primary shadow-xl hover:scale-105 transition-transform bg-white">
              <Play className="h-12 w-12 mb-4 text-purple-500" />
              <h3 className="text-xl font-bold mb-2 text-primary">Adaptive Streaming</h3>
              <p className="text-gray-700 text-base">
                Quality adapts to your network. CDN optimization for smooth, buffer-free playback.
              </p>
            </Card>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="w-full py-6 px-8 bg-white/80 border-t-2 border-primary text-center text-muted-foreground text-sm mt-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto">
          <span>&copy; {new Date().getFullYear()} StreamSync. All rights reserved.</span>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="/watch" className="hover:underline">Join Stream</Link>
            <Link href="/login" className="hover:underline">Login</Link>
            <a href="https://github.com/ayushh0406/stream-sync" target="_blank" rel="noopener" className="hover:underline">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}