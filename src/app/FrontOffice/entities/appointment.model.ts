import { AppointmentStatus } from "./appointmentStatus";
import { Doctor } from "./doctor.model";
import { Elderly } from "./elderly.model";

export interface Appointment {
    idAppointment: number;
    patientName: string;
    appFrom: string;
    appTo: string;
    appFirst: boolean;
    symptom: string;
    archiveApp: string;
    appStatus: AppointmentStatus; // Use the appropriate enum or string type here
    // Add any other properties as needed
  }