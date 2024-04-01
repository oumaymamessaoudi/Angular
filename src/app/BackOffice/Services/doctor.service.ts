import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'http://localhost:8081/auth/listDoctor'; 
  private deleteUrl = 'http://localhost:8081/auth/doctors'; 
  private updateUrl = 'http://localhost:8081/auth';


  constructor(private http: HttpClient) { }

  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteDoctor(doctorId: number): Observable<any> {
    const deleteUrl = `${this.deleteUrl}/${doctorId}`;
    return this.http.delete(deleteUrl);
  }

  // Méthode pour mettre à jour un médecin
  updateDoctor(doctorId: any, doctorData: any): Observable<any> {
    const url = `${this.updateUrl}/updateDoctor/${doctorId}`; // Remplacez 'doctors' par l'endpoint approprié de votre API
    return this.http.put(url, doctorData);
  }

}