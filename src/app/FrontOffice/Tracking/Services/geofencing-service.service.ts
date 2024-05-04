import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeofenceService {
  private baseUrl = 'http://localhost:8081'; 
  constructor(private http: HttpClient) { }

  getGeofenceData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/geofencing/data`);
  }
}
