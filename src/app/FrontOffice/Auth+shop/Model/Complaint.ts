export interface Complaint {
    complaintID?: number;
    description: string;
    category: string;
    type: string;
    priority: string;
    assigneA?: string;
    closingDate?: Date;
    internalNotes?: string;
    userEmail?: string;
    user?: any; 
    archived: boolean;
    elderly?: any; 
    relative?: any;
    currentDate: Date;
    creationDate: Date;
    emotionText: string;
    //attachments: string[];
   attachments: File[]; // Ajoutez cette propriété pour stocker les fichiers associés à la plainte
   doctorNotes: string; // Nouvelle propriété pour stocker les notes du médecin
   treatmentDate?: Date; // Propriété pour la date de traitement par le médecin



  }
  