import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'https://real-time-news-data.p.rapidapi.com/search';
  private apiKey = 'e7331bbdf7msh61a194843086330p12bdd5jsn84f38a230206';

  constructor(private http: HttpClient) {}

  getNews(query: string, country: string, lang: string): Observable<any> {
    const options = {
      params: {
        query: query,
        country: country,
        lang: lang
      },
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': 'real-time-news-data.p.rapidapi.com'
      }
    };
    return this.http.get(this.apiUrl, options);
  }
}  