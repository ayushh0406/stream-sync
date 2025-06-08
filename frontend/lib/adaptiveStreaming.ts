export interface StreamQuality {
  resolution: string;
  bitrate: number;
  fps: number;
}

export interface StreamMetrics {
  bandwidth: number;
  latency: number;
  bufferHealth: number;
  droppedFrames: number;
}

export class AdaptiveStreaming {
  private qualities: StreamQuality[] = [
    { resolution: '1080p', bitrate: 5000, fps: 60 },
    { resolution: '720p', bitrate: 2500, fps: 30 },
    { resolution: '480p', bitrate: 1000, fps: 30 },
    { resolution: '360p', bitrate: 500, fps: 30 }
  ];

  selectOptimalQuality(metrics: StreamMetrics): StreamQuality {
    const { bandwidth, latency, bufferHealth } = metrics;
    
    // Simple adaptive logic
    if (bandwidth > 4000 && latency < 50 && bufferHealth > 80) {
      return this.qualities[0]; // 1080p
    } else if (bandwidth > 2000 && latency < 100 && bufferHealth > 60) {
      return this.qualities[1]; // 720p
    } else if (bandwidth > 800 && bufferHealth > 40) {
      return this.qualities[2]; // 480p
    }
    
    return this.qualities[3]; // 360p fallback
  }

  getAvailableQualities(): StreamQuality[] {
    return [...this.qualities];
  }
}