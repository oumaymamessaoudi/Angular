import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmbulanceOwnerService {
  private apiUrl = 'http://localhost:8081/auth/listAmbulanceOwner'; 
  private deleteUrl = 'http://localhost:8081/auth/ambulanceOwners'; 
  private updateUrl = 'http://localhost:8081/auth';


  constructor(private http: HttpClient) { }

  getAmbulanceOwners(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteAmbulanceOwner(ambulanceOwnerId: number): Observable<any> {
    const deleteUrl = `${this.deleteUrl}/${ambulanceOwnerId}`;
    return this.http.delete(deleteUrl);
  }

  // Méthode pour mettre à jour un ambulance Owner
  updateAmbulanceOwner(ambulanceOwnerId: any, ambulanceOwnerData: any): Observable<any> {
    const url = `${this.updateUrl}/updateAmbulanceOwner/${ambulanceOwnerId}`; // Remplacez 'doctors' par l'endpoint approprié de votre API
    return this.http.put(url, ambulanceOwnerData);
  }

}