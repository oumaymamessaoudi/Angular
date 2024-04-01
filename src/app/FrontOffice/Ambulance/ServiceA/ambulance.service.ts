import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // Importer Router
import { Ambulance } from 'src/app/FrontOffice/Ambulance/Model/Ambulance';


@Injectable({
  providedIn: 'root'
})
export class AmbulanceService {

  private baseUrl = "http://localhost:8081/ambulance/";
  private imageBaseUrl = 'http://localhost:80/nadhirPI/';

  constructor(private http: HttpClient, private router: Router) {} // Injecter Router

  updateAmbulance(formData: FormData, ambulanceID: number): Observable<any> {
    const apiUrl = `${this.baseUrl}update/${ambulanceID}`;
    // Placer la redirection avant le return
    this.router.navigate(['admin/get']);
    return this.http.put(apiUrl, formData);
  }
 
  getAmbulanceById(ambulanceId: number): Observable<Ambulance> {
    const apiUrl = `${this.baseUrl}aff/${ambulanceId}`;
    return this.http.get<Ambulance>(apiUrl);
  }

  getImageUrl(imageName: string): string {
    return `${this.imageBaseUrl}${imageName}`;
  }

  getAmbulance(): Observable<any> {
    return this.http.get(this.baseUrl + "affiche");
  }

  addAmbulance(ambulance: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl + "add", ambulance, { observe: 'events' });
  }
}

