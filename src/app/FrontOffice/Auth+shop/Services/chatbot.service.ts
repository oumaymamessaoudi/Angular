import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private chatbotUrl = 'https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask';
  private rapidApiKey = 'e7331bbdf7msh61a194843086330p12bdd5jsn84f38a230206';
  private rapidApiHost = 'chatgpt-gpt4-ai-chatbot.p.rapidapi.com';

  constructor(private http: HttpClient) {}

  askQuestion(question: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-RapidAPI-Key', this.rapidApiKey)
      .set('X-RapidAPI-Host', this.rapidApiHost);

    const body = {
      query: question
    };

    return this.http.post(this.chatbotUrl, body, { headers });
  }
}