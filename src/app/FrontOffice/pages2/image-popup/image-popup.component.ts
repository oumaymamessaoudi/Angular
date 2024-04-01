import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-popup',
  template: `
    <div class="popup-container">
    <button class="close-button" mat-icon-button (click)="closeDialog()">
    <mat-icon>close</mat-icon> <!-- "x" icon -->
  </button>      <div class="popup-content">
        <button mat-icon-button (click)="previousImage()">
          <mat-icon>keyboard_arrow_left</mat-icon>
        </button>
        <img [src]="currentImage" alt="Cabinet Picture">
        <button mat-icon-button (click)="nextImage()">
          <mat-icon>keyboard_arrow_right</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .popup-container {
      width: 80vw;
      height: 80vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .popup-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    .close-button {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  `]
})
export class ImagePopupComponent {
  images: string[];
  currentIndex: number = 0;
  currentImage: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ImagePopupComponent>
  ) {
    this.images = data.images;
    this.currentIndex = data.currentIndex;
    this.currentImage = this.images[this.currentIndex];
  }

  nextImage(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.currentImage = this.images[this.currentIndex];
    }
  }

  previousImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentImage = this.images[this.currentIndex];
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
