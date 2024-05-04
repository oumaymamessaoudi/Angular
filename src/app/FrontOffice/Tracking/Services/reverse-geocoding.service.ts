import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReverseGeocodingService {
  private nominatimBaseUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) { }

  reverseGeocode(lat: number, lon: number): Observable<any> {
    const url = `${this.nominatimBaseUrl}?format=json&lat=${lat}&lon=${lon}`;
    return this.http.get<any>(url);
  }
}
