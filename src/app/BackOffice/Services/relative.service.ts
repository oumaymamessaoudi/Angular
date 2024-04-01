import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelativeService {


  private apiUrl = 'http://localhost:8081/auth/listRelative'; 
  private deleteUrl = 'http://localhost:8081/auth/relatives'; 
  private updateUrl = 'http://localhost:8081/auth';


  constructor(private http: HttpClient) { }

  getRelatives(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteRelative(relativeId: number): Observable<any> {
    const deleteUrl = `${this.deleteUrl}/${relativeId}`;
    return this.http.delete(deleteUrl);
  }

  // Méthode pour mettre à jour un médecin
  updateRelative(relativeId: any, relativeData: any): Observable<any> {
    const url = `${this.updateUrl}/updateRelative/${relativeId}`; // Remplacez 'relatives' par l'endpoint approprié de votre API
    return this.http.put(url, relativeData);
  }
 // Méthode pour rechercher un ancien par e-mail
 getElderlyByEmail(email: string): Observable<any> {
  const url = `${this.apiUrl}/${email}`;
  return this.http.get<any>(url);
}
}