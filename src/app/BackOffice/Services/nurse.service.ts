import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NurseService {
  private apiUrl = 'http://localhost:8081/auth/listNurse'; 
  private deleteUrl = 'http://localhost:8081/auth/nurses'; 
  private updateUrl = 'http://localhost:8081/auth';


  constructor(private http: HttpClient) { }

  getNurses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteNurse(nurseId: number): Observable<any> {
    const deleteUrl = `${this.deleteUrl}/${nurseId}`;
    return this.http.delete(deleteUrl);
  }

  // Méthode pour mettre à jour un médecin
  updateNurse(nurseId: any, nurseData: any): Observable<any> {
    const url = `${this.updateUrl}/updateNurse/${nurseId}`; // Remplacez 'nurses' par l'endpoint approprié de votre API
    return this.http.put(url, nurseData);
  }

}