export interface TimeSlot {
    startTime: string; // Start time of the time slot (e.g., '09:00 AM')
    endTime: string; // End time of the time slot (e.g., '10:00 AM')
    isAvailable: boolean; // Flag indicating if the time slot is available for booking
    appointmentId?: number; // ID of the booked appointment (if any)
  }