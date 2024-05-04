import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Review } from '../entities/review.model';
import { Doctor } from '../entities/doctor.model';
import { Elderly } from '../entities/elderly.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorProfileService {
  
  private baseUrl = 'http://localhost:8081'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  
  getElderlyBannedStatus(elderlyId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/Doctor/elderly/${elderlyId}/banned-status`);
  }

  getProfile(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/profile/${id}`);

  }
  updateprofile(id: string,profile: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/profile/${id}`,profile);

  }


  getDoctorProfile(doctorId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Doctor/${doctorId}`);

  }
  getCalendarIdByDoctorId(doctorId: number): Observable<number> {
    const url = `${this.baseUrl}/Calendar/getCalendarIdByDoctor/${doctorId}`;
    return this.http.get<number>(url).pipe(
      tap(calendarId => console.log('Fetched calendarId:', calendarId)),
      catchError(error => {
        console.error('Error fetching calendarId:', error);
        throw error;
      })
    );
  }
  getCabinetPicturesByDoctorId(doctorId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/Doctor/${doctorId}/cabinetPictures`);
  }
  getProfilePictureByDoctorId(doctorId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/Doctor/${doctorId}/profilePicture`);
  }
  getAverageRatingForDoctor(doctorId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/Doctor/${doctorId}/average-rating`);
  }
  getTotalRatingsForDoctor(doctorId: number): Observable<number> {
    const url = `${this.baseUrl}/Doctor/${doctorId}/total-ratings`;
    return this.http.get<number>(url);
  }
  deleteReview(doctorId: number, reviewId: number, elderlyId: number): Observable<string> {
    const url = `${this.baseUrl}/Doctor/del/${doctorId}/${reviewId}/${elderlyId}`;
    return this.http.delete<string>(url);
  }
  editReview(reviewId: number, updatedReview: Review, elderlyId: number): Observable<Review> {
    const url = `${this.baseUrl}/Doctor/${reviewId}?elderlyId=${elderlyId}`;
 
     return this.http.put<Review>(url, updatedReview);
  }
  getPatientsByDoctorId(doctorId: number): Observable<Elderly[]> {
    const url = `${this.baseUrl}/Doctor/patients/${doctorId}`;
    return this.http.get<Elderly[]>(url);
  }
/*
  uploadDoctorImage(doctorId: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}/Doctor/${doctorId}/uploadImage`, formData);
  }
*/

deleteCabinetPictures(doctorId: number): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/Doctor/delete-cabinet-pictures/${doctorId}`);
}



  uploadDoctorImage(doctorId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return this.http.post<any>(`${this.baseUrl}/Doctor/${doctorId}/uploadImage`, formData);
  }

  uploadCabinetPictures(doctorId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return this.http.post<any>(`${this.baseUrl}/Doctor/upload-cabinet-pictures/${doctorId}`, formData);
  }

  getElderlyBannedUntil(elderlyId: number): Observable<Date> {
    const url = `${this.baseUrl}/Doctor/${elderlyId}/bannedUntil`;
    return this.http.get<Date>(url).pipe(
      catchError((error: any) => {
        throw error;
      })
    );
  }

}