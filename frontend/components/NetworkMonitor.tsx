import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface NetworkStats {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
}

export default function NetworkMonitor() {
  const [stats, setStats] = useState<NetworkStats>({
    download: 0,
    upload: 0,
    ping: 0,
    jitter: 0
  });
  
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Simulate network monitoring
    const interval = setInterval(() => {
      setStats({
        download: Math.random() * 100 + 20,
        upload: Math.random() * 50 + 5,
        ping: Math.random() * 50 + 10,
        jitter: Math.random() * 10 + 1
      });
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getConnectionQuality = () => {
    if (!isConnected) return { label: 'Disconnected', color: 'bg-red-500' };
    if (stats.ping < 20 && stats.download > 50) return { label: 'Excellent', color: 'bg-green-500' };
    if (stats.ping < 50 && stats.download > 25) return { label: 'Good', color: 'bg-blue-500' };
    if (stats.ping < 100) return { label: 'Fair', color: 'bg-yellow-500' };
    return { label: 'Poor', color: 'bg-red-500' };
  };

  const quality = getConnectionQuality();

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Network Monitor</h3>
        <Badge className={`${quality.color} text-white`}>
          {quality.label}
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Download</span>
            <span>{stats.download.toFixed(1)} Mbps</span>
          </div>
          <Progress value={Math.min(stats.download, 100)} />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Upload</span>
            <span>{stats.upload.toFixed(1)} Mbps</span>
          </div>
          <Progress value={Math.min(stats.upload * 2, 100)} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Ping</p>
            <p className="font-semibold">{stats.ping.toFixed(0)}ms</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Jitter</p>
            <p className="font-semibold">{stats.jitter.toFixed(1)}ms</p>
          </div>
        </div>
      </div>
    </Card>
  );
}