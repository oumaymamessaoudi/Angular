// data-sharing.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private onSubmitSource = new Subject<void>();
  private elderlyIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  private relativeIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  onSubmit$ = this.onSubmitSource.asObservable();

  triggerOnSubmit(): void {
    console.log('shared');
    this.onSubmitSource.next();
  }
  setElderlyId(id: number | null): void {
    this.elderlyIdSubject.next(id);
  }

  getElderlyId(): BehaviorSubject<number | null> {
    return this.elderlyIdSubject;
  }
  setRelativeId(id: number | null): void {
    this.relativeIdSubject.next(id);
  }
}
