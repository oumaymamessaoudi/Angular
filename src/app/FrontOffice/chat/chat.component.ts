import { Component, OnInit, ChangeDetectorRef , ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { SignService } from '../Auth+shop/Services/sign.service';
import { ChatService } from '../ChatServices/chat.service';
import { ChatMessage } from '../Auth+shop/Model/chatmessage';
import { UserService } from '../ChatServices/user.service';
import { User } from '../Auth+shop/Model/user';
import { HttpClient } from '@angular/common/http';
import { AudioRecorderService } from '../ChatServices/audio-recorder.service';
import { interval, Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  // Component properties
  
  private subscriptions: Subscription[] = [];

  currentUserEmail!: string;
  message: string = '';
  messages: ChatMessage[] = [];
  users: User[] = [];
  selectedUser: User | null = null;
  recording = false;
  pollingInterval = 2000; 
  pollingSubscription: Subscription | undefined;
  updatedText: string = ''; // Store the updated text
  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMessage: ChatMessage | null = null;
  editingMessageId: number | null = null;

  listVisibility: { [key: string]: boolean } = {
    nurse: false,
    doctor: false,
    ambulanceOwner: false,
    ambulanceDriver: false,
    relative: false,
    elderly: false
  };

  unreadMessageCounts: { [key: string]: number } = {};
  onlineStatus: { [key: string]: boolean } = {}; 


  

  @ViewChild('messageInput') messageInput!: ElementRef;


  @ViewChild('messagesContainer') messagesContainer!: ElementRef<any>;

  constructor(
    private signService: SignService,
    private chatService: ChatService,
    private userService: UserService,
    private http: HttpClient,
    private audioRecorderService: AudioRecorderService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.scrollToBottom();

    this.currentUserEmail = this.signService.getUserEmail();
    this.fetchUsers(); // Fetch users when the component initializes
    console.log('Messages:', this.messages);
    this.startPolling();
    document.body.addEventListener('click', this.closeContextMenu.bind(this));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.stopPolling();
    document.body.removeEventListener('click', this.closeContextMenu.bind(this));
  }



  checkLastMessageSeen(): boolean {
    if (this.messages.length > 0) {
      const lastMessage = this.messages[this.messages.length - 1];
      return lastMessage && lastMessage.senderId === this.currentUserEmail && lastMessage.seen;
    }
    return false;
  }



  fetchUsers(): void {
    const currentUserEmail = this.signService.getUserEmail();
    if (!currentUserEmail) return;
  
    const usersSubscription = this.userService.getAllUsers().subscribe(users => {
      this.users = users; // Set users property
      users.forEach(user => {
        this.calculateUnreadMessages(currentUserEmail, user.email); // Calculate unread messages for each user
      });
    });
    this.subscriptions.push(usersSubscription);
  }
  





  updateUnreadMessageCounts(): void {
    const currentUserEmail = this.signService.getUserEmail();
    if (!currentUserEmail) return;
  
    this.users.forEach(user => {
      this.calculateUnreadMessages(currentUserEmail, user.email);
    });
  }
  
  calculateUnreadMessages(currentUserEmail: string, senderEmail: string): void {
    this.chatService.getUnseenMessages(currentUserEmail, senderEmail).subscribe(messages => {
      let unreadCount = 0;
      messages.forEach((message: ChatMessage) => {
        if (message.recipientId === currentUserEmail) {
          unreadCount++;
        }
      });
      this.unreadMessageCounts[senderEmail] = unreadCount;
    });
  }
  

  fetchOnlineStatus(): void {
    this.signService.fetchOnlineStatus().subscribe(
      (response: { [key: string]: boolean }) => {
        this.onlineStatus = response;
          this.users.forEach(user => {
          user.online = this.onlineStatus[user.email] ?? false;
          this.cdr.detectChanges();

        });
      },
      (error: any) => {
        console.error('Error fetching online status:', error);
      }
    );
  }
  
  


  selectUser(user: User): void {
    this.selectedUser = user;
    this.loadMessages();
  }

  toggleList(category: string): void {
    this.listVisibility[category] = !this.listVisibility[category];
  }

  toggleRecording(): void {
    if (this.recording) {
      this.stopRecording();
      this.startPolling(); // Resume polling after recording stops
    } else {
      this.stopPolling(); // Pause polling before starting recording
      this.startRecording();
    }
  }

  startRecording(): void {
    this.audioRecorderService.startRecording();
    this.recording = true;
  }

  stopRecording(): void {
    this.audioRecorderService.stopRecording();
    this.recording = false;
  }

  resetRecording(): void {
    this.audioRecorderService.clearChunks();
    this.recording = false;
  }
  startPolling(): void {
    if (!this.recording) {
      this.pollingSubscription = interval(this.pollingInterval).subscribe(() => {
        this.loadMessages();
        this.updateUnreadMessageCounts(); // Add this line to update unread message counts
        this.fetchOnlineStatus();

      });
    }
  }
  
  stopPolling(): void {
    if (this.pollingSubscription && !this.recording) {
      this.pollingSubscription.unsubscribe();
    }
  }

  scrollToBottom(): void {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  sendMessage(): void {
    if (!this.selectedUser) {
      console.error('No selected user');
      return;
    }
  
    const currentUserEmail = this.signService.getUserEmail();
    if (!currentUserEmail) {
      console.error('Current user email is not available');
      return;
    }
  
    if (this.audioRecorderService.audioChunks.length) {
      const audioData = new Blob(this.audioRecorderService.audioChunks, { type: 'audio/webm' });
      audioData.arrayBuffer().then(buffer => {
        if (currentUserEmail && this.selectedUser) {
          const sendVoiceMessageSubscription = this.chatService.sendVoiceMessage(currentUserEmail, this.selectedUser.email, buffer)
            .subscribe(
              (response: any) => {
                console.log('Voice message sent successfully:', response);
                this.audioRecorderService.clearChunks();
                this.loadMessages();
                this.recording = false;
                this.scrollToBottom();
                this.startPolling();
              },
              error => {
                console.error('Error sending voice message:', error);
              }
            );
          this.subscriptions.push(sendVoiceMessageSubscription);
        }
      });
    } else if (this.message.trim() !== '' && this.selectedUser) {
      const messageToSend = this.message.trim();
      const sendMessageSubscription = this.chatService.sendMessage(currentUserEmail, this.selectedUser.email!, messageToSend)
        .subscribe(
          (response: any) => {
            console.log('Text message sent successfully:', response);
            this.loadMessages();
            this.scrollToBottom();
            
          },
          error => {
            console.error('Error sending text message:', error);
          }
        );
      this.subscriptions.push(sendMessageSubscription);
      this.message = '';

    }
  }

  
  

  loadMessages() {
    if (!this.selectedUser) {
      console.error('No selected user');
      return;
    }
  
    const loadMessagesSubscription = this.chatService.getMessages(this.currentUserEmail, this.selectedUser.email)
      .subscribe(messages => {
        console.log('Fetched messages:', messages); // Add this line to check fetched messages

        if (!messages || messages.length === 0) {
          console.warn('No messages received from backend');
          return;
        }
  
        this.messages = messages.map(message => ({
          ...message,
          timestamp: this.parseTimestamp(message.timestamp),
          textContent: message.textContent ?? '',
          audioContent: message.audioContent ? this.getAudioUrl(message.audioContent) : null
        }));
  
        this.scrollToBottom(); 
      }, error => {
        console.error('Error fetching messages from backend:', error);
      });
    this.subscriptions.push(loadMessagesSubscription);
     // After loading messages, set the unread count for this conversation to 0
  if (this.selectedUser) {
    this.unreadMessageCounts[this.selectedUser.email] = 0;
  }
  }

  getAudioUrl(audioContent: ArrayBuffer | null | Observable<string>): Observable<string> {
    console.log('getAudioUrl method called with audioContent:', audioContent);

    if (audioContent instanceof Observable) {
      return audioContent;
    } else if (audioContent instanceof ArrayBuffer) {
      const audioBlob = new Blob([audioContent], { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      return of(audioUrl);
    } else if (typeof audioContent === 'string') {
      const binaryString = atob(audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes.buffer], { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      return of(audioUrl);
    } else {
      return of('');
    }
  }

  playAudio(message: ChatMessage): void {
    const audioContent = message.audioContent;

    if (!audioContent) {
      console.error('No audio content found');
      return;
    }

    this.stopPolling();
    const playAudioSubscription = this.getAudioUrl(audioContent).subscribe(audioUrl => {
      const audioElement = new Audio(audioUrl);
      audioElement.play()
        .then(() => {
          this.audioPlaybackStart();
          this.startPolling();
        })
        .catch(error => {
          console.error('Error playing audio:', error);
          this.startPolling();
        });
      audioElement.addEventListener('ended', () => {
        this.audioPlaybackEnd();
      });
    });
    this.subscriptions.push(playAudioSubscription);
  }

  audioPlaybackStart(): void {
    console.log('Audio playback started');
  }

  audioPlaybackEnd(): void {
    console.log('Audio playback ended');
  }

  showContextMenu(event: MouseEvent, message: ChatMessage): void {
    event.preventDefault();
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMessage = message;
    this.contextMenuVisible = true;
  }

  closeContextMenu(): void {
    this.contextMenuVisible = false;
  }

  toggleEditing(messageId: number): void {
    this.editingMessageId = messageId === this.editingMessageId ? null : messageId;
  }

  editMessage(message: ChatMessage): void {
    if (message.id !== undefined) {
      this.editingMessageId = message.id;
      this.updatedText = message.textContent || '';
    }
  }

  saveEditedMessage(message: ChatMessage, updatedText: string): void {
    if (message.id !== undefined) {
      message.textContent = updatedText;
      const saveEditedMessageSubscription = this.chatService.updateMessage(message.id, updatedText)
        .subscribe(
          response => {
            console.log('Message updated successfully:', response);
            this.editingMessageId = null;
            this.updatedText = '';
          },
          error => {
            console.error('Error updating message:', error);
          }
        );
      this.subscriptions.push(saveEditedMessageSubscription);
    }
  }

  deleteMessage(messageId: number): void {
    const deleteMessageSubscription = this.chatService.deleteMessage(messageId)
      .subscribe(
        response => {
          console.log('Message deleted successfully:', response);
        },
        error => {
          console.error('Error deleting message:', error);
        }
      );
    this.subscriptions.push(deleteMessageSubscription);
  }

  parseTimestamp(timestamp: string | Date | null): Date | null {
    if (!timestamp) return null;
    if (timestamp instanceof Date) return timestamp;

    if (Array.isArray(timestamp) && timestamp.length === 6) {
      const [year, month, day, hour, minute, second] = timestamp;
      return new Date(year, month - 1, day, hour, minute, second);
    }

    const parsedDate = new Date(timestamp);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  getUsername(email: string): string {
    const atIndex = email.indexOf('@');
    return email.slice(0, atIndex);
  }

  goBack(): void {
    this.router.navigateByUrl('');
  }
}
