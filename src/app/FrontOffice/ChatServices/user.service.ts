import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Auth+shop/Model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8081/api/chat'; 

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/all`);
  }

  searchUsersByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/search?email=${email}`);
  }
}
