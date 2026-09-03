import { useState, useEffect } from 'react';
import { DisasterIntelEvent } from '../types/intel';

const MOCK_INTEL_QUEUE: Omit<DisasterIntelEvent, 'id' | 'timestamp'>[] = [
  {
    source: 'NEWS',
    severity: 'WARNING',
    lat: 26.195, lng: 91.730,
    headline: 'NDTV Local: Rising water levels at Guwahati Promenade',
    description: 'Local authorities report minor water logging near the Brahmaputra banks. Precautionary measures advised.',
    region: 'Guwahati (Zone A)'
  },
  {
    source: 'SATELLITE',
    severity: 'INFO',
    lat: 26.175, lng: 91.760,
    headline: 'ISRO Sentinel-1 (SAR) Backscatter Analysis',
    description: 'SAR imagery detects increased soil moisture saturation over southern agricultural zones. No immediate breach.',
    region: 'South Guwahati'
  },
  {
    source: 'SOCIAL_MEDIA',
    severity: 'WARNING',
    lat: 26.185, lng: 91.785,
    headline: 'Crowdsourced: Traffic gridlock on Route B',
    description: 'Multiple users reporting stalled vehicles due to flash flooding blocking main arterial road.',
    region: 'Route B Junction'
  },
  {
    source: 'NEWS',
    severity: 'CRITICAL',
    lat: 26.198, lng: 91.710,
    headline: 'BREAKING: Dike Breach At Northern Sector',
    description: 'Emergency response activated. Unprecedented river surge has compromised the primary floodwall.',
    region: 'North-West Dikes'
  },
  {
    source: 'SENSOR',
    severity: 'CRITICAL',
    lat: 26.193, lng: 91.742,
    headline: 'IoT River Gauge: Surge +2.8m Above Danger Mark',
    description: 'Automated telemetry indicates rapid inundation flow. Evacuation trigger threshold met.',
    region: 'Central River Station'
  },
  {
    source: 'SATELLITE',
    severity: 'WARNING',
    lat: 26.168, lng: 91.735,
    headline: 'NOAA Weather Sat: Incoming Cloud Burst',
    description: 'High-density cumulonimbus formations tracked heading directly for the central valley.',
    region: 'Valley Perimeter'
  }
];

export const useLiveIntelFeed = (isActive: boolean = true) => {
  const [events, setEvents] = useState<DisasterIntelEvent[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    // Simulate events coming in every 8 - 15 seconds
    const timer = setInterval(() => {
      setQueueIndex(prev => {
        if (prev < MOCK_INTEL_QUEUE.length) {
          const newEventData = MOCK_INTEL_QUEUE[prev];
          const newEvent: DisasterIntelEvent = {
            ...newEventData,
            id: `intel-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            timestamp: new Date()
          };
          
          setEvents(currentEvents => [newEvent, ...currentEvents]); // Push to front
          return prev + 1;
        }
        return prev; // Stop when queue is empty
      });
    }, 12000); // 12 second intervals

    return () => clearInterval(timer);
  }, [isActive]);

  return { intelEvents: events };
};
