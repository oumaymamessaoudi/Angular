import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleStatisticsService {
  private apiUrl = 'http://localhost:8081/role-statistics/user-count-by-role';

  constructor(private http: HttpClient) { }

  getRoleStatistics(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}


