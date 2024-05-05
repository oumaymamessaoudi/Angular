import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Complaint } from '../Model/Complaint';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private apiUrl = 'http://localhost:8081/api/complaints';
  private api1Url = 'http://localhost:8081/auth/listRelative'; 
  private complaints: Complaint[] = [];
  complaintUpdated: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient) { }

  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl);
  }

  createComplaint(complaint: Complaint): Observable<Complaint> {
    return this.http.post<Complaint>(this.apiUrl, complaint);
  }

 

  createComplaintForElderly( elderlyId: number, complaint: Complaint): Observable<Complaint> {
    return this.http.post<Complaint>(`${this.apiUrl}/elderly/${elderlyId}`, complaint);
  }

  createComplaintForRelative( relativeId: number, complaint: Complaint): Observable<Complaint> {
    return this.http.post<Complaint>(`${this.apiUrl}/relative/${relativeId}`, complaint);
  }
  // Récupérer les plaintes d'un utilisateur âgé par son ID
  getComplaintsByElderlyId(elderlyId: number): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/elderly/${elderlyId}`);
  }

  getComplaintsByRelativeId(relativeId: number): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/relative/${relativeId}`);
  }
  deleteComplaint(id: number): Observable<void> {
    console.log('Complaint ID to delete:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  

  getElderlyEmailByRelativeId(relativeId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/relatives/${relativeId}/elderlyEmail`, { responseType: 'text' });
    
  }
  getDoctorEmailByElderlyEmail(elderlyEmail: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/doctor/${elderlyEmail}`, { responseType: 'text' });
  }
  addComplaint(complaint: Complaint) {
    this.complaints.push(complaint);
  }

  getComplaints() {
    return this.complaints.slice();
  }
  sendComplaintNotificationToDoctor(complaint: Complaint, doctorEmail: string): Observable<any> {
    return this.http.post<any>(`/api/complaints/sendNotificationToDoctor/${doctorEmail}`, complaint);
  }
  getDoctorComplaints(doctorEmail: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/doctorComplaints/${doctorEmail}`);
  }
  getRelativeComplaintsForDoctor(relativeId: number, doctorEmail: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/relativeComplaints/${relativeId}/${doctorEmail}`);
  }
  sendComplaintToDoctor(complaint: Complaint, doctorEmail: string): Observable<any> {
    // Assuming you need to send the complaint data to the server
    return this.http.post<any>(`${this.apiUrl}/sendComplaintToDoctor`, { complaint, doctorEmail });
  }
  createComplaintForElderly1( id: number,elderlyId: number, complaint: Complaint): Observable<Complaint> {
    return this.http.post<Complaint>(`${this.apiUrl}/elderly/${elderlyId}`, complaint);
  }
  
  
  getComplaintById(id: number,relativeId:number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${id}/${relativeId}`);
  }
  updateComplaint(complaintId: number, relativeId: number, formData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${complaintId}/relative/${relativeId}`, formData);
  }

  updateComplaint1(complaintId: number, formData: any): Observable<any> {
    const url = `${this.apiUrl}/${complaintId}`;
    return this.http.put(url, formData);
  }


  getComplaintsByDoctorEmail(doctorEmail: string): Observable<any>
  {
    return this.http.get(`/api/complaints?doctorEmail=${doctorEmail}`);
  }
  getNotesForComplaint(complaintId: number): Observable<string> {
    const url = `${this.apiUrl}/${complaintId}/notes`;
    return this.http.get<string>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    throw error;
  }

 
}
  