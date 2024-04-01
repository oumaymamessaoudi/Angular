import { Observable } from "rxjs";

export interface ChatMessage {
  id?: number;
  senderId: string;
  recipientId: string;
  textContent: string ;
  audioContent: ArrayBuffer | Observable<string> | null;
  timestamp: Date | null; 
  seen: boolean; 
  typing : boolean;

}
