import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css']
})
export class EventAddComponent {
  addEventForm!: FormGroup;
  imagePath: string | null = null;
  selectedFile: File | null = null;

  constructor(private formBuilder: FormBuilder, private eventService: EventService) { }

  ngOnInit(): void {
    this.addEventForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      date: ['', [Validators.required, this.futureDateValidator]],
      description: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      image: [null, Validators.required], // For file upload
      imageUrl: [null], // To display the selected image
      place: ['', Validators.required],
      ticketprice: ['', Validators.required],
      archiveevent: ['', Validators.required]
    });
  }

  onSubmit() {
    const confirmed = confirm("Are you sure you want to submit the form?");
    if (confirmed) {
      if (this.addEventForm.valid && this.selectedFile) {
        const imagePath = `${this.selectedFile.name}`;
        this.eventService.addEvent(this.addEventForm.value, imagePath).subscribe({
          next: (response) => {
            console.log('Event added successfully:', response);
            this.addEventForm.reset();
            this.imagePath = null;
            this.selectedFile = null;
          },
          error: (error) => {
            console.error('Error adding event:', error);
          }
        });
      } else {
        this.addEventForm.markAllAsTouched();
      }
    } else {
      console.log('Action cancelled');
    }
  }

  

  futureDateValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      return { 'invalidDate': true };
    }
    return null;
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.addEventForm.get('image')?.setValue(file);
  
      // Read the selected file and convert it to a data URL
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePath = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
}