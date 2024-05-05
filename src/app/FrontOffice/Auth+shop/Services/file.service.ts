import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private filesSubject: BehaviorSubject<File[]> = new BehaviorSubject<File[]>([]);
  public files$: Observable<File[]> = this.filesSubject.asObservable(); // Déclaration de la propriété files$

  constructor() {}

  public setFiles(files: File[]): void {
    this.filesSubject.next(files);
  }
  
  public getFiles(): Observable<File[]> {
    return this.filesSubject.asObservable();
  }
}