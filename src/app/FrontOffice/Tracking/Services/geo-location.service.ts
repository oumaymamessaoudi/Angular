import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {
  private apiKey = '5fe275237ce54234adbdc4c466280e49';
  private apiUrl = 'https://api.ipgeolocation.io/ipgeo';

  constructor(private http: HttpClient) { }

  getStartLocation(): Observable<any> {
    return this.http.get(`${this.apiUrl}?apiKey=${this.apiKey}`);
  }
}
