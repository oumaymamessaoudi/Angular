// data.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private formDataSubject = new Subject<any>();
  formData$ = this.formDataSubject.asObservable();

  emitFormData(formData: any): void {
    this.formDataSubject.next(formData);
  }
}
