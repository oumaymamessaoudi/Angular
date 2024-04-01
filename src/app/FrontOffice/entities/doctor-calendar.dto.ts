import { Appointment } from "./appointment.model";

export interface DoctorCalendarDTO {
    calendarId: number;
    appointments: Appointment[]; // Use the existing Appointment interface
}
  
