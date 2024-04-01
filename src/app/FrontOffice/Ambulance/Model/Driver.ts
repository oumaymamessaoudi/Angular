
import { Ambulance } from 'src/app/FrontOffice/Ambulance/Model/Ambulance';

export class Driver {
    ambulanceDriverID?: number;
    onDuty: boolean = false; // Initialisateur par défaut
    drivingExperienceYears: number = 0; // Initialisateur par défaut
    ambulance?: Ambulance | null = null; // Référence à l'ambulance associée
  }