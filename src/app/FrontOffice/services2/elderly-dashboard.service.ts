
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../entities/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class ElderlyDashboardService {
  private baseUrl = 'http://localhost:8081'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  /*searchDoctors(specialty: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Doctor/search/${specialty}`);
  }*/
  
  getDoctors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Doctor`);
  }
  searchDoctorsBySpeciality(specialty: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Doctor/search/${specialty}`);
  } 
  searchDoctorsByCity(city: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Doctor/searchCity/${city}`);
  }
  searchDoctors(specialty: string, city: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Doctor/searchCitySpeciality?specialty=${specialty}&city=${city}`);
  }
  filterDoctors(criteria: any): Observable<Doctor[]> {
    const url = `${this.baseUrl}/Doctor/filter`;
    return this.http.get<Doctor[]>(url, { params: criteria });
  }

  getDoctorsNearby(lat: number, lng: number, radius: number): Observable<Doctor[]> {
    const url = `${this.baseUrl}/Doctor/nearby`;
    return this.http.get<Doctor[]>(url, { params: { lat: lat.toString(), lng: lng.toString(), radius: radius.toString() } });
  }








}