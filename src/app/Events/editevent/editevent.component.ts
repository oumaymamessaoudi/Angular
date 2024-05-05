import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../../eventmodel/event.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-editevent',
  templateUrl: './editevent.component.html',
  styleUrls: ['./editevent.component.css']
})
export class EditeventComponent implements OnInit {

  editEventForm!: FormGroup;
  eventId: number | null = null;
  event: Event | null = null;
  selectedFile: File | null = null; // Declare selectedFile property here

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.eventId = this.getEventIdFromURL();
    this.eventService.getEventById(this.eventId!).subscribe(
      (event: any) => {
        this.event = event;
        this.initializeForm(event);
      },
      (error) => {
        console.error('Error fetching event:', error);
      }
    );
  }

  initializeForm(event: Event): void {
    this.editEventForm = this.formBuilder.group({
      name: [event.name, [Validators.required, Validators.minLength(2)]],
      date: [event.date, [Validators.required]],
      description: [event.description, [Validators.required]],
      capacity: [event.capacity, [Validators.required, Validators.min(1)]],
      place: [event.place, [Validators.required]], // Add the 'place' field to the form group
      image: [null], // Initially set to null
      imagePathField: [event.imageUrl] // Initialized with the existing image URL
    });
  }

  getEventIdFromURL(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : null;
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      // Update the image field in the form
      this.editEventForm.patchValue({
        image: file
      });
      // Update the imagePathField value in the form
      this.editEventForm.patchValue({
        imagePathField: file.name // Assuming the new image path is the file name
      });
    }
  }

  onSubmit() {
    if (this.editEventForm.valid && this.eventId) {
      const eventData = { ...this.editEventForm.value }; // Extract form data

      // If a new file is selected, assign its path to 'image'
      const imagePath = this.selectedFile ? this.selectedFile.name : null;

      // Update the 'image' field in the form data with the new image path
      if (this.selectedFile) {
        eventData.image = this.selectedFile;
      }

      // Call the service to update the event
      this.eventService.updateEvent(this.eventId, eventData).subscribe({
        next: (response) => {
          console.log('Event updated successfully:', response);
          this.editEventForm.reset();
          this.selectedFile = null;
        },
        error: (error) => {
          console.error('Error updating event:', error);
        }
      });
    } else {
      this.editEventForm.markAllAsTouched();
    }
  }
}
