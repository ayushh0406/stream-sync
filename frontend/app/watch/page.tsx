"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { FloatingReactions } from "@/components/floating-reactions";
import {
  Play, Pause, Volume2, VolumeX, Users, MessageSquare,
  Signal, Gauge, Crown, Globe, Server, Smile,
  BarChart3, Network, Cloud, Activity, Send
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { socket, connectSocket, disconnectSocket, emitPlaybackTime, emitReaction, emitChatMessage } from "@/lib/socket";

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: number;
}

interface Participant {
  id: string;
  name: string;
  synced: boolean;
  lastUpdate: number;
}

export default function WatchPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [viewers, setViewers] = useState(0);
  const [syncStatus, setSyncStatus] = useState(100);
  const [isHost, setIsHost] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<string[]>([]);
  const [streamUrl, setStreamUrl] = useState<string>("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");
  const [latencyData, setLatencyData] = useState<{ value: number }[]>([]);
  const [cdnMetrics, setCdnMetrics] = useState({
    requests: 0,
    bandwidth: 0,
    errorRate: 0,
    cacheHitRatio: 0,
  });

  useEffect(() => {
    connectSocket();

    socket.on('viewers:update', (count: number) => setViewers(count));
    
    socket.on('playback:sync', ({ time, userId }) => {
      if (videoRef.current && Math.abs(videoRef.current.currentTime - time) > 1) {
        videoRef.current.currentTime = time;
      }
    });

    socket.on('chat:message', (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message]);
    });

    socket.on('reaction', ({ reaction }) => {
      setReactions(prev => [...prev, reaction]);
    });

    socket.on('metrics:update', ({ latency, cdn }) => {
      setLatencyData(latency);
      setCdnMetrics(cdn);
    });

    socket.on('participants:update', (updatedParticipants: Participant[]) => {
      setParticipants(updatedParticipants);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const hls = new Hls({
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      maxBufferSize: 200 * 1000 * 1000,
    });
    
    hls.loadSource("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => {
        console.log("Playback failed, probably needs user interaction");
      });
    });

    return () => {
      hls.destroy();
    };
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);

    if (videoRef.current.buffered.length > 0) {
      const buffered = (videoRef.current.buffered.end(0) / videoRef.current.duration) * 100;
      setBuffered(buffered);
    }

    // Emit playback time to sync with other users
    emitPlaybackTime(videoRef.current.currentTime);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  const toggleHost = () => {
    setIsHost(!isHost);
    socket.emit('host:toggle', { isHost: !isHost });
  };

  const handleSendMessage = () => {
    if (!chatInputRef.current?.value.trim()) return;
    emitChatMessage(chatInputRef.current.value);
    chatInputRef.current.value = '';
  };

  const handleEmojiSelect = (emoji: string) => {
    emitReaction(emoji);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stream URL Settings */}
          <div className="mb-4 flex gap-2 items-center">
            <Input
              type="text"
              value={streamUrl}
              onChange={e => setStreamUrl(e.target.value)}
              placeholder="Enter HLS stream URL"
              className="w-[400px]"
            />
            <Button onClick={() => setStreamUrl(streamUrl)} variant="secondary">Set Stream</Button>
          </div>
          <Card className="overflow-hidden border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            <video
              ref={videoRef}
              className="w-full aspect-video bg-black"
              onTimeUpdate={handleTimeUpdate}
            />
            <FloatingReactions reactions={reactions} />
            <div className="p-4 space-y-4">
              <div className="relative">
                <Progress value={progress} className="h-2" />
                <Progress value={buffered} className="h-2 absolute top-0 opacity-50" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={togglePlay}
                    className="border-2 border-primary"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMute}
                    className="border-2 border-primary"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isHost ? "default" : "outline"}
                    size="sm"
                    onClick={toggleHost}
                    className="border-2 border-primary"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    {isHost ? "Host Mode" : "Become Host"}
                  </Button>
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{viewers} viewers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Signal className="h-4 w-4" />
                    <span className="text-sm">{syncStatus}% in sync</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Tabs defaultValue="sync" className="w-full">
            <TabsList className="w-full grid grid-cols-3 border-2 border-primary">
              <TabsTrigger value="sync" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="h-4 w-4 mr-2" />
                Sync
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Gauge className="h-4 w-4 mr-2" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="cdn" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Cloud className="h-4 w-4 mr-2" />
                CDN
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sync">
              <Card className="border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-4 border-b-2 border-primary">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Participants ({participants.length})
                  </h3>
                </div>
                <ScrollArea className="h-[200px] p-4">
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          {participant.name}
                          {participant.synced ? (
                            <Signal className="h-4 w-4 text-green-500" />
                          ) : (
                            <Signal className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>

              <Card className="mt-4 border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-4 border-b-2 border-primary">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Live Chat
                  </h3>
                </div>
                <ScrollArea className="h-[300px] p-4">
                  <div className="space-y-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="space-y-1">
                        <div className="font-semibold">{msg.user}</div>
                        <div className="text-sm text-muted-foreground">
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t-2 border-primary">
                  <div className="flex gap-2">
                    <Input
                      ref={chatInputRef}
                      placeholder="Type a message..."
                      className="border-2 border-primary"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSendMessage}
                      className="border-2 border-primary"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card className="border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Network Latency
                  </h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={latencyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>

              <Card className="mt-4 p-4 border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Edge Performance
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cache Hit Ratio</span>
                    <span className="font-mono">{cdnMetrics.cacheHitRatio}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edge Response Time</span>
                    <span className="font-mono">{Math.round(latencyData[latencyData.length - 1]?.value || 0)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Edge Nodes</span>
                    <span className="font-mono">12</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="cdn">
              <Card className="border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Global CDN Metrics
                  </h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={latencyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="requests" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="bandwidth" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>

              <Card className="mt-4 p-4 border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  CDN Health
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Requests</span>
                    <span className="font-mono">{cdnMetrics.requests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bandwidth Usage</span>
                    <span className="font-mono">{cdnMetrics.bandwidth.toFixed(1)} TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate</span>
                    <span className="font-mono">{cdnMetrics.errorRate}%</span>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}