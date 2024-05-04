export interface Tracking {
  id: number;
  elderlyId: number;
  latitudeInitial: number; // Changed property name to latitudeInitial
  longitudeInitial: number; // Changed property name to longitudeInitial
  latitudeDest: number;
  longitudeDest: number;
  initial: string; // Changed property name to initial
  destination: string;
}
