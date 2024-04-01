import { Appointment } from "./appointment.model";
import { TimeSlot } from "./timeSlot.model";

export interface Calendar {
    id: number; // Unique identifier for the calendar
    doctorId: number; // ID of the associated doctor
    date: Date; // Date for which the calendar is applicable
    timeSlots: TimeSlot[];
    appointments: Appointment[];
    // Array of available time slots for the day
  }