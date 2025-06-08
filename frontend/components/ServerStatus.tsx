import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Wifi, Activity } from "lucide-react";

interface ServerStatusProps {
  status: 'online' | 'offline' | 'maintenance';
  uptime: string;
  connectedUsers: number;
  serverLoad: number;
}

export default function ServerStatus({ 
  status, 
  uptime, 
  connectedUsers, 
  serverLoad 
}: ServerStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6 border-2 border-primary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Server Status</h3>
        <Badge className={`${getStatusColor()} text-white`}>
          {status.toUpperCase()}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Uptime</p>
            <p className="font-semibold">{uptime}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Connected</p>
            <p className="font-semibold">{connectedUsers}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Server Load</p>
            <p className="font-semibold">{serverLoad}%</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Network</p>
            <p className="font-semibold text-green-500">Stable</p>
          </div>
        </div>
      </div>
      
      {status === 'maintenance' && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            Scheduled maintenance in progress. Some features may be unavailable.
          </p>
        </div>
      )}
    </Card>
  );
}