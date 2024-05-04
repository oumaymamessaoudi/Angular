import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private notificationSound = new Audio('assets/mariem/notification.mp3');

  constructor() {}

  playNotificationSound() {
    this.notificationSound.play();
  }
}
