import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = 'http://localhost:8081/auth/all'; 
  private UrlArchive = 'http://localhost:8081/auth/listArchive'; 
  private UrlSearch= 'http://localhost:8081/auth/users/search';
  private UrlSearchRole= 'http://localhost:8081/auth/searchByRole';

  private baseAdminUrl = 'http://localhost:8081/api/users';


  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

 

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseAdminUrl}/DeleteUser/${id}`);
  }
  ActivateUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseAdminUrl}/ActivateUser/${id}`);
  }

  getArchivedUsers(): Observable<any> {
    const url = `${this.UrlArchive}`; 
    return this.http.get(url);
  }




  
searchUsersByEmail(email: string): Observable<any> {
  const url = `${this.UrlSearch}?email=${email}`;
  return this.http.get(url);
}

searchUsersByRole(role: string): Observable<any> {
  const url = `${this.UrlSearchRole}?role=${role}`;
  return this.http.get(url);
}

}