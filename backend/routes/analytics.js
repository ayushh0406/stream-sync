const express = require('express');
const router = express.Router();

// User analytics endpoint
router.get('/users', (req, res) => {
  // Simulate analytics data
  const analytics = {
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    activeUsers: Math.floor(Math.random() * 100) + 50,
    avgSessionTime: Math.floor(Math.random() * 60) + 30,
    topRegions: ['US', 'EU', 'Asia'],
    deviceTypes: {
      desktop: 60,
      mobile: 30,
      tablet: 10
    }
  };
  res.json(analytics);
});

// Stream analytics endpoint
router.get('/streams', (req, res) => {
  const streamAnalytics = {
    totalStreams: Math.floor(Math.random() * 50) + 20,
    avgViewerCount: Math.floor(Math.random() * 200) + 100,
    peakConcurrent: Math.floor(Math.random() * 500) + 200,
    avgStreamDuration: Math.floor(Math.random() * 120) + 60,
    qualityDistribution: {
      '1080p': 40,
      '720p': 35,
      '480p': 20,
      '360p': 5
    }
  };
  res.json(streamAnalytics);
});

module.exports = router;