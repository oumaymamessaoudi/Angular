import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(private http: HttpClient) { }

  sendSms(to: string, body: string) {
    return this.http.post<any>('http://localhost:8081/send-sms', { to, body });
  }


  phonecall(to: string) {
    return this.http.post<any>('http://localhost:8081/make-call', { to});
  }
}
