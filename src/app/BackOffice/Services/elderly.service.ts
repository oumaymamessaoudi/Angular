import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElderlyService {
  private apiUrl = 'http://localhost:8081/auth/listElderly'; 
  private updateUrl = 'http://localhost:8081/auth';


  constructor(private http: HttpClient) { }

  getElderlys(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  

  // Méthode pour mettre à jour un elderly
  updateElderly(elderlyId: any, elderlyData: any): Observable<any> {
    const url = `${this.updateUrl}/updateElderly/${elderlyId}`; // Remplacez 'doctors' par l'endpoint approprié de votre API
    return this.http.put(url, elderlyData);
  }

   
}
