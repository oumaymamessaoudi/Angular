
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { DoctorCalendarDTO } from '../entities/doctor-calendar.dto';
import { Appointment } from '../entities/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private baseUrl = 'http://localhost:8081'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  getDoctorCalendar(doctorId: number, elderlyId: number): Observable<DoctorCalendarDTO> {
    const url = `${this.baseUrl}/Doctor/${doctorId}/${elderlyId}/calendar`;
    return this.http.get<DoctorCalendarDTO>(url);
  }
  getPendingAppointments(doctorId: number): Observable<Appointment[]> {
    const url = `${this.baseUrl}/appointments/pending/${doctorId}`;
    return this.http.get<Appointment[]>(url);
}
saveAppointmentService(appointmentData: any, elderlyId: number, calendarId: number): Observable<any> {
  const url = `${this.baseUrl}/appointments/AddApp/${elderlyId}/${calendarId}`;
  return this.http.put(url, appointmentData);
}
getAllAppointments(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/appointments`);
}
getAppointmentsByCalendarId(calendarId: number): Observable<Appointment[]> {
  const url = `${this.baseUrl}/appointments/${calendarId}/calappointments`;
  return this.http.get<Appointment[]>(url);
}
getPendingAppointmentsByCalendarId(calendarId: number): Observable<Appointment[]> {
  const url = `${this.baseUrl}/appointments/${calendarId}/pending-appointments`;
  return this.http.get<Appointment[]>(url);
}

approveAppointment(appointmentId: number): Observable<any> {
  const endpoint = `${this.baseUrl}/Doctor/approve-appointment/${appointmentId}`;
  return this.http.put<Appointment>(endpoint, null);
}
getPendingAppointmentsByElderlyId(elderlyId: number) {
  const url = `${this.baseUrl}/appointments/${elderlyId}/pending-appointmentsElderly`;
  return this.http.get<Appointment[]>(url);
}
getCompletedAppointmentsByElderlyId(elderlyId: number) {
  const url = `${this.baseUrl}/appointments/${elderlyId}/completed-appointmentsElderly`;
  return this.http.get<Appointment[]>(url);
}

getRejectedAppointmentsByElderlyId(elderlyId: number) {
  const url = `${this.baseUrl}/appointments/${elderlyId}/rejected-appointmentsElderly`;
  return this.http.get<Appointment[]>(url);
}

cancelAppointment(id: number): Observable<void> {
  const url = `${this.baseUrl}/appointments/DeleteApp/${id}`;
  return this.http.delete<void>(url);
}

getAppointmentById(appointmentId: number): Observable<Appointment> {
  return this.http.get<Appointment>(`${this.baseUrl}/appointments/GetAppDetails/${appointmentId}`);
}


getDoctorEmail(id: number): Observable<string> {
  return this.http.get(`${this.baseUrl}/Doctor/${id}/email`, { responseType: 'text' })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching doctor email:', error);
        throw error;
      })
    );
}
getDoctorName(id: number): Observable<string> {
  return this.http.get(`${this.baseUrl}/Doctor/${id}/name`, { responseType: 'text' })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching doctor name:', error);
        throw error;
      })
    );
}













getCompletedAppointmentsByCalendarId(calendarId: number): Observable<Appointment[]> {
  const url = `${this.baseUrl}/appointments/${calendarId}/completed-appointments`;
  return this.http.get<Appointment[]>(url);
}


getApprovedAppointmentsByCalendarId(calendarId: number): Observable<Appointment[]> {
  const url = `${this.baseUrl}/appointments/${calendarId}/approved-appointments`;
  return this.http.get<Appointment[]>(url);
}
rejectAppointment(appointmentId: number): Observable<any> {
  const endpoint = `${this.baseUrl}/appointments/markRejected?appointmentId=${appointmentId}`;
  return this.http.get(endpoint, { responseType: 'text' });
}
completeAppointment(appointmentId: number): Observable<any> {
  const endpoint = `${this.baseUrl}/Doctor/complete-appointment/${appointmentId}`;
  return this.http.put(endpoint, null, { responseType: 'text' });
}



updateAppointment(id: number, data: any): Observable<void> {
  const url = `${this.baseUrl}/appointments/UpdateApp/${id}`;
  return this.http.put<void>(url, data);
}
getDoctorPatients(doctorId: number): Observable<any> {
  const url = `${this.baseUrl}/Doctor/doctoratients/${doctorId}`;
  return this.http.get(url);
}

 
getDoctorAddress(id: number): Observable<string> {
  return this.http.get(`${this.baseUrl}/Doctor/${id}/address`, { responseType: 'text' })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching doctor address:', error);
        throw error;
      })
    );
}
getElderlyNameByAppointmentId(appointmentId: number): Observable<string> {
  const url = `${this.baseUrl}/Calendar/${appointmentId}`;
  return this.http.get<string>(url, { responseType: 'text' as 'json' });
}
}