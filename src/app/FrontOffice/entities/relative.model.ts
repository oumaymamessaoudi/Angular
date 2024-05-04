export interface Relative {
    idRelative?: number; // Optional as it will be assigned by the backend
    relationship: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: Date;
    address: string;
    gender: string;
    etats: number;
    role: string;
    user?: any; // You can define the OurUsers interface separately if needed
    Messages?: any[]; // Assuming Message interface is defined separately
    elderly?: any; // Assuming Elderly interface is defined separately
    selected: boolean;

  }