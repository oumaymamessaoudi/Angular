
import { Ambulance } from 'src/app/FrontOffice/Ambulance/Model/Ambulance';

// ambulance-driver.model.ts
export interface AmbulanceDriver {
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  role: string;
  onDuty: boolean;
  drivingExperienceYears: string;
  ambulanceDriverID: number;

  user: {
    id: number;
    email: string;
    // autres propriétés de l'utilisateur
  };
  ambulance: any; // ou définir une interface pour l'ambulance
  messageList: any[]; // ou définir une interface pour le message
  workingHours?: number;
  salary?: number;
  currentTimestamp?: Date;
  working: boolean;
  startTime: Date | null;
  endTime: Date | null;
  totalForDriver?: number; // Propriété pour stocker le total pour ce conducteur


}
