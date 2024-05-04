import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { TrackingDTO } from '../tracking-dto.model';
import { Tracking } from '../tracking.model';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  private apiUrl = 'http://localhost:8081/api/tracking'; 

  constructor(private http: HttpClient) { }


  saveOrUpdateTracking(elderlyId: number, trackingData: any) {
    this.getTracking(elderlyId).subscribe(existingTracking => {
      if (existingTracking) {
        // If there is existing tracking data, update it
        this.updateTracking(existingTracking.trackingId, trackingData).subscribe(
          () => {
            console.log('Tracking data updated successfully');
          },
          (error) => {
            console.error('Error updating tracking data:', error);
          }
        );
      } else {
        // If there is no existing tracking data, save new tracking data
        this.saveTracking(elderlyId, trackingData).subscribe(
          () => {
            console.log('New tracking data saved successfully');
          },
          (error) => {
            console.error('Error saving tracking data:', error);
          }
        );
      }
    });
  }

  saveTracking(elderlyId: number, trackingData: any) {
    return this.http.post(`http://localhost:8081/api/tracking/save/${elderlyId}`, trackingData);
  }


  updateTracking(trackingId: number, updatedTracking: any) {
    return this.http.put(`${this.apiUrl}/update/${trackingId}`, updatedTracking);
  }


  getTracking(elderlyId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${elderlyId}`);
  }
//just elderly position
  getTrackingByRelativeId(relativeId: number): Observable<TrackingDTO> {
    const url = `${this.apiUrl}/relative/${relativeId}`;
    return this.http.get<TrackingDTO>(url);
  }

//whole tracking
    getTrackingRelativeByRelativeId(relativeId: number): Observable<Tracking> {
    const url = `${this.apiUrl}/gettrackrelative/${relativeId}`;
    return this.http.get<Tracking>(url);
  }
 
  getElderlyInfoByRelativeId(relativeId: number): Observable<string> {
    return this.http.get(`http://localhost:8081/api/tracking/elderly/${relativeId}`, { responseType: 'text' });
  }
  getRelativePhoneNumberById(id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/relativePhone/${id}`);
  }


  getRelativePhoneNumberbyElderlyId(id: number) {
    return this.http.get<string>(`${this.apiUrl}/phone/${id}`);
  }
}
