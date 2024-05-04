import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ambulance } from '../Model/Ambulance';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private distance: number = 0;

  constructor() { }

  setDistance(distance: number): void {
    this.distance = distance;
  }

  getDistance(): number {
    return this.distance;
  }}
