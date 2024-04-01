import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string ='http://localhost:8081/auth';

  constructor(private http: HttpClient) { }


  resetPassword(email: string, password: string): Observable<void> {
    const payload = {
      email,
      password
    };
    return this.http.put<void>(`${this.baseUrl}/reset-password`, payload);
  }

  
  checkUsername(username: string) {
    return this.http.get<boolean>(`${this.baseUrl}/user/check-username?username=${username}`);
  }

  checkEmail(email: string) {
    return this.http.get<boolean>(`${this.baseUrl}/user/check-email?email=${email}`);
  }


}
