import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AmbulanceDriver } from 'src/app/FrontOffice/Ambulance/Model/Driver';
import { Ambulance } from '../Model/Ambulance';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = 'http://localhost:8081/ambulance/onduty';

  constructor(private http: HttpClient) { }

  getAmbulanceDrivers(): Observable<AmbulanceDriver[]> {
    return this.http.get<AmbulanceDriver[]>(this.apiUrl);
  }

}
