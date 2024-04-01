import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../Model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    public email: any;
    public password: any;
    public test!: any;
    private baseUrl="http://localhost:8081/auth"
    private base1Url="http://localhost:8081/auth1"
 
  constructor(private httpClient: HttpClient) {


  }
  user:User = new User();
  login(user:User):Observable<object>
  {
    console.log(user);
    return this.httpClient.post(`${this.baseUrl}`,user);
  }


 
} 