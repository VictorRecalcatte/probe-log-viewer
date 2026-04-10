export interface InspectionImage {
  id: string;
  url: string;
  name: string;
  timestamp: string;
}

export interface FaultLocation {
  lat: number;
  lng: number;
  description: string;
}

export interface TechnicalNote {
  id: string;
  text: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export type InspectionStatus = 'pending' | 'in_progress' | 'completed';

export interface Inspection {
  id: string;
  date: string;
  time: string;
  location: string;
  responsible: string;
  description: string;
  status: InspectionStatus;
  images: InspectionImage[];
  faultLocations: FaultLocation[];
  notes: TechnicalNote[];
  createdAt: string;
}
