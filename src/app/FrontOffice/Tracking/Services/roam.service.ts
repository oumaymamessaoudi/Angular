import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoamService {

  private apiUrl: string = 'https://api.roam.ai/v1/api/geofence/';
  private apiKey: string = '3636533911484ec6847d43ec2bdd3b30'; 

  constructor(private http: HttpClient) { }

  createGeofence(coordinates: number[], radius: number, description: string, tag: string, metadata: any, user_ids: string[], group_ids: string[]): Observable<any> {

    const headers = new HttpHeaders({
      'Api-Key': this.apiKey,
      'Content-Type': 'application/json'
    });
  
    const body = {
      coordinates: coordinates,
      geometry_radius: radius,
      description: description,
      tag: tag,
      metadata: {}, // Added metadata field

      user_ids: user_ids,
      group_ids: group_ids,
    };
  
    return this.http.post<any>(this.apiUrl, body, { headers: headers });
  }
  
}
