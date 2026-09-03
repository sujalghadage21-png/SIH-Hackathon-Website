export type IntelSource = 'NEWS' | 'SATELLITE' | 'SOCIAL_MEDIA' | 'SENSOR';
export type IntelSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface DisasterIntelEvent {
  id: string;
  source: IntelSource;
  severity: IntelSeverity;
  lat: number;
  lng: number;
  headline: string;
  description: string;
  timestamp: Date;
  region: string;
}
