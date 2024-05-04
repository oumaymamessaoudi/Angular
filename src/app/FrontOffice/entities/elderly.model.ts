import { Appointment } from "./appointment.model";

export interface Elderly {
    elderlyID: number;
    username: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string; // You might need to adjust this based on your needs
    address: string;
    preferences: string;
    healthRecord: string;
    //nurse: Nurse;
    events: Event[];
    //complaints: Complaint[];
    //messages: Message[];
    //medicalfolder: MedicalFolder;
    appointments: Appointment[];
   // ambulances: Ambulance[];
   // toDoList: TodoList;
  //  forumPosts: ForumPost[];
  badCommentsCount: number;
   banned :boolean ;

  }