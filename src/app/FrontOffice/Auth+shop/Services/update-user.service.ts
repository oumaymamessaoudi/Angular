import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserService {
  private apiUrl = 'http://localhost:8081/api'; // Remplacez cela par l'URL réelle de votre API

  constructor(private http: HttpClient) { }

  getUserById(userId: string): Observable<any> {
    const url = `${this.apiUrl}/profile/${userId}`;
    return this.http.get(url);
  }

  updateUserProfile(userId: string, userData: any): Observable<any> {
    const url = `${this.apiUrl}/profile/${userId}`;
    return this.http.put(url, userData);
  }
}