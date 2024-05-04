import { Component, OnInit, ChangeDetectorRef , ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { SignService } from '../Auth+shop/Services/sign.service';
import { ChatService } from '../ChatServices/chat.service';
import { ChatMessage } from '../Auth+shop/Model/chatmessage';
import { UserService } from '../ChatServices/user.service';
import { User } from '../Auth+shop/Model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AudioRecorderService } from '../ChatServices/audio-recorder.service';
import { interval, Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { SoundService } from '../ChatServices/sound.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, OnDestroy {

  //for ng destroy
  private subscriptions: Subscription[] = [];
  selectedUserEmail: string; // Define the email of the selected user

  currentUserEmail!: string;
  message: string = '';
  messages: ChatMessage[] = [];
  users: User[] = [];
  selectedUser: User | null = null;
  recording = false;
  //polling refreshing
  pollingInterval = 2000; 
  pollingSubscription: Subscription | undefined;
  //edit
  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMessage: ChatMessage | null = null;
  editingMessageId: number | null = null;
  updatedText: string = ''; 
  //users list
  listVisibility: { [key: string]: boolean } = {
    nurse: false,
    doctor: false,
    ambulanceOwner: false,
    ambulanceDriver: false,
    relative: false,
    elderly: false
  };

//msg non lus
  unreadMessageCounts: { [key: string]: number } = {};

  //online
  onlineStatus: { [key: string]: boolean } = {}; 

  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<any>;
  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;
  @ViewChild('autoInput') autoInput!: ElementRef<HTMLInputElement>;
  autoCtrl = new FormControl();

  searchText: string = ''; 
  showEmojiPopup: boolean = false; // Declare the property here
  emojis: { input_text: string; emoji: string; }[] = [];
  textCorpus: string[] = [];
  autocompleteSuggestions: string[] = []; // Ensure that autocompleteSuggestions is defined


  constructor(
    private signService: SignService,
    private chatService: ChatService,
    private userService: UserService,
    private http: HttpClient,
    private audioRecorderService: AudioRecorderService,
    private cdr: ChangeDetectorRef,
    private router: Router,private soundservice: SoundService
  ) {   
  }

  ngOnInit() {
    this.scrollToBottom();
    this.currentUserEmail = this.signService.getUserEmail();
    this.fetchUsers(); 
    this.autoCtrl.valueChanges.subscribe((value: string) => {
    
this.autocompleteSuggestions = this.generateAutocompleteSuggestions(value, this.textCorpus);
    });
    this.loadTextCorpus();

    console.log('Messages:', this.messages);
    this.startPolling();
    document.body.addEventListener('click', this.closeContextMenu.bind(this));

  

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.stopPolling();
    document.body.removeEventListener('click', this.closeContextMenu.bind(this));

  }




//recherche
searchUsersByEmail(email: string): void {
  this.userService.searchUsersByEmail(email).subscribe(
    (data) => {
      this.users = data;
    },
    (error) => {
      console.error('Error searching users by email:', error);
    }
  );
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
      const previousCount = this.unreadMessageCounts[senderEmail] || 0;
      this.unreadMessageCounts[senderEmail] = unreadCount;
      console.log('Unread Count:', unreadCount); // Log the unread count
      if (unreadCount > previousCount) {
        console.log('Playing notification sound...'); // Log that the notification sound is being played
        this.soundservice.playNotificationSound(); // Call the method to play the notification sound
      }
    }, error => {
      console.error('Error fetching unseen messages:', error); // Log any errors that occur
    });
  }
  
  

  fetchOnlineStatus(): void {
    this.signService.fetchOnlineStatus().subscribe(
      (response: { [key: string]: boolean }) => {
        this.onlineStatus = response;
  
        // Update the online status for each user
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
        this.loadMessages();//new msgs
        this.updateUnreadMessageCounts(); //update unread message counts
        this.fetchOnlineStatus();//online status

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




  loadTextCorpus() {
    this.http.get('assets/mariem/corpse_data.txt', { responseType: 'text' }).subscribe(
      data => {
        this.textCorpus = this.preprocessTextCorpus(data);
      },
      error => {
        console.error('Error loading text corpus:', error);
      }
    );
  }

  preprocessTextCorpus(corpus: string): string[] {
    return corpus.trim().split('\n');
  }


  onInput(inputValue: string): void {
    if (inputValue.trim() === '') {
      this.autocompleteSuggestions = [];
    } else {
      const lastWord = inputValue.trim().split(' ').pop(); // Get the last word
      this.autocompleteSuggestions = this.generateAutocompleteSuggestions(lastWord, this.textCorpus);
    }
  
  }


  
  
  
  
  
  

  selectSuggestion(suggestion: string) {
    const words = this.message.split(' '); // Split the message into words
    const lastWordIndex = words.length - 1; // Get the index of the last word
    words[lastWordIndex] = suggestion; // Replace the last word with the selected suggestion
    this.message = words.join(' '); // Join the words back into a single string
     // Prevent default behavior (e.g., line break) after selecting a suggestion
  event.preventDefault();
  }
  



  generateAutocompleteSuggestions(input: string, corpus: string[]): string[] {
    const prefix = input.toLowerCase().trim();
    console.log('Input:', input);
    console.log('Prefix:', prefix);
    console.log('Corpus:', corpus);
    const suggestions = corpus.filter(token => token.toLowerCase().startsWith(prefix));
    console.log('Autocomplete Suggestions:', suggestions);
    //return suggestions;
  
    return suggestions.slice(0,15); // Return only the first 10 suggestions

  }



  encryptMessage(message: string): string {
    // Replace 'YOUR_SECRET_KEY' with your secret key
    const encryptedMessage = CryptoJS.AES.encrypt(message, 'KEY123').toString();
    return encryptedMessage;
  }
  
  // Function to decrypt the message after receiving
  decryptMessage(encryptedMessage: string): string {
    // Replace 'YOUR_SECRET_KEY' with your secret key
    const decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, 'KEY123').toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
  }
  
  
//sendmessage 9bal emojii
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
      const messageToSend = this.encryptMessage(this.message.trim()); // Encrypt the message
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
      this.autocompleteSuggestions = [];


    }
  }

  fetchEmojis(query: string): void {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': 'fd8660f39fmshed609170e24cbb1p188704jsneb41d49c0619',
      'X-RapidAPI-Host': 'emoji-ai.p.rapidapi.com'
    });
  
    const params = {
      query: query
    };
  
    this.http.get<any>('https://emoji-ai.p.rapidapi.com/getEmoji', { headers, params }).subscribe(
      (response: any) => {
        if (response && response.input_text && response.emoji) {
          this.emojis = [{ input_text: response.input_text, emoji: response.emoji }]; 
          this.showEmojiPopup = true;
        } else {
          console.error('Invalid response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching emojis:', error);
      }
    );
  }
  
  
  
  selectEmoji(emoji: string): void {
    this.message += emoji;
    this.showEmojiPopup = false;
  }




  onInputEmoji(value: string): void {
    const words = value.trim().split(/\s+/); // Split input text into words
    const lastWord = words[words.length - 1]; // Get the last word
  
    if (lastWord !== '') {
      this.fetchEmojis(lastWord); // Fetch emojis for the last word
    } else {
      this.showEmojiPopup = false;
    }
  }
  
  
  
  
  
  

  loadMessages() {
    if (!this.selectedUser) {
      console.error('No selected user');
      return;
    }
  
    const loadMessagesSubscription = this.chatService.getMessages(this.currentUserEmail, this.selectedUser.email)
      .subscribe(messages => {
        console.log('Fetched messages:', messages); 

        if (!messages || messages.length === 0) {
          console.warn('No messages received from backend');
          return;
        }
  
        this.messages = messages.map(message => ({
          ...message,
          timestamp: this.parseTimestamp(message.timestamp),
          textContent: message.textContent ? this.decryptMessage(message.textContent) || '' : '', // Decrypt the message if not null
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
  
    this.stopPolling(); // Stop polling before playing audio
    const playAudioSubscription = this.getAudioUrl(audioContent).subscribe(audioUrl => {
      const audioElement = new Audio(audioUrl);
      audioElement.play()
        .then(() => {
          this.audioPlaybackStart();
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
      audioElement.addEventListener('ended', () => {
        this.audioPlaybackEnd();
        this.startPolling(); // Resume polling after audio playback ends
      });
    });
    this.subscriptions.push(playAudioSubscription);
  }
  
  audioPlaybackEnd(): void {
    console.log('Audio playback ended');
  }
  

  audioPlaybackStart(): void {
    console.log('Audio playback started');
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
