import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage } from '../Auth+shop/Model/chatmessage';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://localhost:8081/api/chat';

  constructor(private httpClient: HttpClient) {}

  sendMessage(senderId: string, recipientId: string, textContent: string): Observable<any> {
    const body = {
      senderId: senderId,
      recipientId: recipientId,
      textContent: textContent  // Ensure textContent is included in the body
    };
  
    return this.httpClient.post<any>(`${this.baseUrl}/send-text-message`, body);
  }
  

  sendVoiceMessage(senderId: string, recipientId: string, audioContent: ArrayBuffer): Observable<any> {
    const body = {
      senderId: senderId,
      recipientId: recipientId,
      audioContent: Array.from(new Uint8Array(audioContent)) // Convert ArrayBuffer to byte array
    };
  
    return this.httpClient.post(`${this.baseUrl}/send-voice-message`, body);
  }
  updateMessage(messageId: number, updatedText: string): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/update-message/${messageId}`, updatedText);
  }

  
  markMessageAsSeen(messageId: number): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/mark-message-as-seen/${messageId}`, {});
  }

  deleteMessage(messageId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete-message/${messageId}`);
  }

  getMessages(userId1: string, userId2: string): Observable<ChatMessage[]> {
    return this.httpClient.get<ChatMessage[]>(`${this.baseUrl}/messages?userId1=${userId1}&userId2=${userId2}`);
  }

  getUnseenMessages(currentUserEmail: string, senderEmail: string): Observable<ChatMessage[]> {
    return this.httpClient.get<ChatMessage[]>(`${this.baseUrl}/unseen-messages?currentUserEmail=${currentUserEmail}&senderEmail=${senderEmail}`);
  }
 
}
