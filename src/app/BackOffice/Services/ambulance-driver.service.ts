import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmbulanceDriverService {
  private apiUrl = 'http://localhost:8081/auth/listAmbulanceDriver'; 
  private deleteUrl = 'http://localhost:8081/auth/ambulanceDrivers'; 
  private updateUrl = 'http://localhost:8081/auth';


  constructor(private http: HttpClient) { }

  getAmbulanceDrivers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteAmbulanceDriver(ambulanceDriverId: number): Observable<any> {
    const deleteUrl = `${this.deleteUrl}/${ambulanceDriverId}`;
    return this.http.delete(deleteUrl);
  }

  // Méthode pour mettre à jour un ambulance driver
  updateAmbulanceDriver(ambulanceDriverId: any, ambulanceDriverData: any): Observable<any> {
    const url = `${this.updateUrl}/updateAmbulanceDriver/${ambulanceDriverId}`; // Remplacez 'doctors' par l'endpoint approprié de votre API
    return this.http.put(url, ambulanceDriverData);
  }

}