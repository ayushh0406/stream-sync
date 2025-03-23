"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-24 sm:py-32">
          <div className="text-center">
            <div className="relative z-10">
              <div className="absolute -inset-1 rounded-lg bg-primary/20 blur"></div>
              <h1 className="text-6xl font-black tracking-tight text-primary sm:text-8xl relative z-20">
                StreamSync
              </h1>
            </div>
            <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
              Next-gen synchronized streaming platform. Watch together, react together, experience together.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/watch">
                <Button size="lg" className="text-lg px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  <Play className="mr-2 h-5 w-5" /> Join Stream
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

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