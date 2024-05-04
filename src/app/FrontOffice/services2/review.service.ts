import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, interval, throwError } from 'rxjs';
import { Review } from '../entities/review.model';
import { AuthService } from '../Auth+shop/Services/AuthService';
import { switchMap } from 'rxjs/operators';
import { SignService } from '../Auth+shop/Services/sign.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:8081'; // Replace with your backend URL
  private readonly checkInterval = 60000; // Check every minute (adjust as needed)

  constructor(private http: HttpClient, private authService: SignService) {
 
   }

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/Doctor/review/All`);
  }


  createReview(review: Review, elderlyId: number, doctorId: number): Observable<Review> {
    const url = `${this.baseUrl}/Doctor/create?elderlyId=${elderlyId}&doctorId=${doctorId}`;
    return this.http.post<Review>(url, review);
  }

  updateReview(id: number, updatedReview: Review): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/Doctor/review/${id}`, updatedReview);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Doctor/review/${id}`);
  }

  getDoctorReviews(doctorId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/Doctor/${doctorId}/reviews`);
  }
  getReviewById(id: number): Observable<Review> {
    const url = `${this.baseUrl}/Doctor/review/${id}`;
    return this.http.get<Review>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error fetching review:';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage += ` ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage += ` Status: ${error.status}, Message: ${error.error.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }

  
  public getArchivedStatus(elderlyId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/Doctor/${elderlyId}/checkArchivedStatus`);
  }

}