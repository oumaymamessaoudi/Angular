import { Appointment } from "./appointment.model";

export interface Doctor {

    idDoctor: number;
    imagedoc: string;
    doctorType: string;
    specialization: string;
    schedule: string;
    username: string;
    password: string;
    phoneNumber: string;
  //  medicalFolders: MedicalFolder[];
    //messages: Message[];
    //complaints: Complaint[];
    doctorEmail: string;
    Address: string;
    doctorLatitude: number;
    doctorLongitude: number;
    favoriteOfTheMonth: boolean;
    firstName: string;
    lastName:string;
  }