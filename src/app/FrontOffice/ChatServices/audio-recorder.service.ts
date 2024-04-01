import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  audioRecordingPath: string = ''; // Declare audioRecordingPath property

  // Add clearChunks property
  clearChunks(): void {
    this.audioChunks = [];
  }
  constructor(private http: HttpClient) { }

  startRecording(): void {
    this.audioChunks = []; // Clear any existing audio chunks
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data); // Capture audio data if available
          }
        };
        this.mediaRecorder.onstop = () => {
          console.log('Recording stopped.');
        };
        this.mediaRecorder.start();
        console.log('Recording started.');
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        // Set mediaRecorder to null or handle the error accordingly
        this.mediaRecorder = null;
      });
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      console.log('Recording stopped.');
    } else {
      console.error('No active media recorder available.');
    }
  }

  saveRecording(senderId: string, recipientId: string, audioRecordingPath: string): void {
    if (this.audioChunks.length === 0) {
      console.error('No audio data to save.');
      return;
    }

    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('senderId', senderId);
    formData.append('recipientId', recipientId);
    formData.append('content', audioRecordingPath); // Store the audio recording path in the content field

    this.http.post('http://localhost:8081/api/upload-audio', formData)
      .subscribe(
        response => {
          console.log('Audio uploaded successfully:', response);
          // Optionally handle successful response from the server
        },
        error => {
          console.error('Error uploading audio:', error);
          // Optionally handle error response from the server
        }
      );
  }

  playAudio(audioBlob: Blob): void {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  }
  getAudio(fileName: string): Observable<Blob> {
    return this.http.get(`http://localhost:8081/audio/${fileName}`, { responseType: 'blob' });
  }





}
