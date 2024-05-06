import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Elderly } from '../FrontOffice/entities/elderly.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8081/events';

  constructor(private http: HttpClient) { }

  participateInEvent(eventId: number, elderlyId?: number): Observable<any> {
    const url = `${this.apiUrl}/participate/${elderlyId}/${eventId}`;
    return this.http.post<any>(url, {});
  }
  getApiUrl(): string {
    return this.apiUrl;
  }
  getElderlyAccountBalance(elderlyId: number): Observable<number> {
    const url = `${this.apiUrl}/elderly/${elderlyId}/accountBalance`;

    return this.http.get<number>(url);
  }

  getEventsForElderly(elderlyId: number): Observable<Event[]> {
    const url = `${this.apiUrl}/for-elderly/${elderlyId}`;

    return this.http.get<Event[]>(url)
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred:', error);
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  toggleEventArchive(eventId: number): Observable<any> {
    const url = `${this.apiUrl}/toggle-archive/${eventId}`;
    return this.http.put<any>(url, {})
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred:', error);
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

recommendEventsForElderly(elderlyId: number): Observable<Event[]> {
    const url = `${this.apiUrl}/recommendations/${elderlyId}`;
    return this.http.get<Event[]>(url)
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred:', error);
          return throwError('Something bad happened; please try again later.');
        })
      );
  }
 /* recommendEventsForElderly(elderlyId: number, latitude: number, longitude: number): Observable<Event[]> {
    const url = `${this.apiUrl}/recommendations/${elderlyId}/${latitude}/${longitude}`;
    return this.http.get<Event[]>(url)
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred:', error);
          return throwError('Something bad happened; please try again later.');
        })
      );
  }
  */
  getEventsWithinDistance(
    userLatitude: number,
    userLongitude: number,
    maxDistance: number,
    maxPrice?: number,
    minCapacity?: number
  ): Observable<Event[]> {
    const url = `${this.apiUrl}/within-distance`;
  
    // Set query parameters for user latitude, longitude, and max distance
    let params = new HttpParams()
      .set('userLatitude', userLatitude.toString())
      .set('userLongitude', userLongitude.toString())
      .set('maxDistance', maxDistance.toString());
  
    // Add optional parameters if provided
    if (maxPrice) {
      params = params.set('maxPrice', maxPrice.toString());
    }
    if (minCapacity) {
      params = params.set('minCapacity', minCapacity.toString());
    }
  
    return this.http.get<Event[]>(url, { params }).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
      })
    );
  }
  


  addEvent(eventData: any, imagePath: string): Observable<any> {
    const formData = new FormData();
    Object.keys(eventData).forEach(key => {
      formData.append(key, eventData[key]);
    });
    formData.append('image', imagePath);

    const url = `${this.apiUrl}/addWithImage`;

    return this.http.post<any>(url, formData)
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred:', error);
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  getAllEvents(): Observable<Event[]> {
    const url = `${this.apiUrl}/allevents`;

    return this.http.get<Event[]>(url)
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred:', error);
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  updateEvent(eventId: number, eventData: any, imagePath?: string): Observable<Event> {
  const formData = new FormData();
  Object.keys(eventData).forEach(key => {
    formData.append(key, eventData[key]);
  });
  // If imagePath is provided, append it to the FormData
  if (imagePath) {
    formData.append('image', imagePath);
  }

  const url = `${this.apiUrl}/update/${eventId}`;

  return this.http.put<Event>(url, formData)
    .pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
      })
    );
}

  
getEventById(id: number): Observable<Event> {
  const url = `${this.apiUrl}/${id}`;

  return this.http.get<Event>(url)
    .pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
      })
    );
}
downloadExcelFile(): Observable<Blob> {
  const url = `${this.apiUrl}/download-excel`;

  // Set the headers to specify that the response should be treated as an Excel file
  const headers = new HttpHeaders({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  return this.http.get(url, {
    responseType: 'blob', // Set the response type to blob
    observe: 'response', // Observe the full HTTP response to access headers
    headers: headers // Pass the headers to the request
  }).pipe(
    catchError((error: any) => {
      console.error('An error occurred:', error);
      return throwError('Something bad happened; please try again later.');
    }),
    map((response: HttpResponse<Blob>) => {
      // Extract the blob from the HttpResponse
      const blob = response.body;
      // Get the content disposition header to extract the filename
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'download.xlsx'; // Default filename
      if (contentDisposition) {
        // Extract the filename from the content disposition header
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      // Append .xlsx extension if not already present
      if (!filename.toLowerCase().endsWith('.xlsx')) {
        filename += '.xlsx';
      }
      // Create a Blob object with the modified filename
      const updatedBlob = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // Create a link element to initiate the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(updatedBlob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      // Initiate the download
      link.click();
      // Clean up
      document.body.removeChild(link);
      return blob; // Return the original blob
    })
  );

  
}


getEventsWithElderly(): Observable<{ event: Event, elderlyList: Elderly[] }[]> {
  const url = `${this.apiUrl}/events-with-elderly`;

  return this.http.get<{ event: Event, elderlyList: Elderly[] }[]>(url)
    .pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
      })
    );
}


getMaxTicketPrice(): Observable<number> {
  const url = `${this.apiUrl}/max-ticket-price`;

  return this.http.get<number>(url)
    .pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
      })
    );
}

getMaxEventCapacity(): Observable<number> {
  const url = `${this.apiUrl}/max-event-capacity`;

  return this.http.get<number>(url)
    .pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
      })
    );
}
}