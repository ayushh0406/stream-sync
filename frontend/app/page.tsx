"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, logout } = require("@/lib/auth-context").useAuth();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="w-full flex justify-between items-center px-8 py-4 border-b-2 border-primary bg-muted">
        <h1 className="text-3xl font-bold text-primary">StreamSync</h1>
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
      </div>
      {/* ...existing code... */}

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-muted">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Real-time Sync */}
            <Card className="p-8 border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
              <Zap className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-4">Real-time Sync</h3>
              <p className="text-muted-foreground">
                Zero-lag synchronization for millions of users watching together in perfect harmony.
              </p>
            </Card>

            {/* Multi-User Experience */}
            <Card className="p-8 border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
              <Users className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-4">Watch Together</h3>
              <p className="text-muted-foreground">
                Interactive chat, live reactions, and synchronized playback for a shared experience.
              </p>
            </Card>

            {/* Performance */}
            <Card className="p-8 border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
              <Play className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-4">Adaptive Streaming</h3>
              <p className="text-muted-foreground">
                Smart bitrate adaptation and global CDN ensure smooth playback everywhere.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}