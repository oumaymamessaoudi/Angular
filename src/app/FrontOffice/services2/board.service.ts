import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../entities/board.model';
 import { ListE } from '../entities/ListE.model';
import { Card } from '../entities/card.model';
 @Injectable({
  providedIn: 'root'
})
export class BoardService {
  private baseUrl = 'http://localhost:8081';
  constructor(private http: HttpClient) {}

  getAllBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.baseUrl}/boards`);
  }

  getBoardById(elderlyId: number): Observable<Board> {
    return this.http.get<Board>(`${this.baseUrl}/${elderlyId}/board`);
  }

  createBoard(name: string): Observable<Board> {
    return this.http.post<Board>(`${this.baseUrl}/boards`, { name });
  }

  deleteBoard(boardId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/boards/${boardId}`);
  }

  addListToBoard(boardId: number, name: string): Observable<ListE> {
    return this.http.post<ListE>(`${this.baseUrl}/boards/${boardId}/lists`, { name });
  }

  updateListName(listId: number, name: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/lists/${listId}`, { name });
  }

  deleteList(listId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/lists/${listId}`);
  }
  addCardToList(card: Card, listId: number): Observable<Card> {
    console.log("Sending card to backend:", card); // Debug output
    return this.http.post<Card>(`${this.baseUrl}/${listId}/cards`, { ...card, listId });
  }
  updateCardStatus(todoId: number, status: string, listId: number): Observable<any> {
    const url = `${this.baseUrl}/todos/${todoId}/${status}/${listId}`;
    return this.http.post(url, {});
  }

  updateCardContent(cardId: number, content: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/cards/${cardId}/content`, { content });
  }

  deleteCard(cardId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cards/${cardId}`);
  }
}