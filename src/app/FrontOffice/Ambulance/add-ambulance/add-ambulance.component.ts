import { Component } from '@angular/core';
import { Ambulance } from 'src/app/FrontOffice/Ambulance/Model/Ambulance';
import { AmbulanceService } from 'src/app/FrontOffice/Ambulance/ServiceA/ambulance.service';

@Component({
  selector: 'app-add-ambulance',
  templateUrl: './add-ambulance.component.html',
  styleUrls: ['./add-ambulance.component.css']
})
export class AddAmbulanceComponent {

  ambulance: Ambulance = new Ambulance('', 0, 0); // Définir des valeurs par défaut pour latitude et longitude
  imageFile: File | undefined;

  constructor(private ambulanceService: AmbulanceService) {}

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.imageFile = inputElement.files[0];
    }
  }

  addAmbulance(): void {
    if (!this.ambulance.location || !this.imageFile) {
      console.error('Location and image are required');
      return;
    }
  
    const formData = new FormData();
    formData.append('location', this.ambulance.location);
    formData.append('latitude', this.ambulance.latitude.toString());
    formData.append('longitude', this.ambulance.longitude.toString());
    formData.append('status', this.ambulance.status);
    formData.append('image', this.imageFile);
  
    this.ambulanceService.addAmbulance(formData).subscribe(
      (response) => {
        console.log('Ambulance added successfully:', response);
      },
      (error) => {
        console.error('Error adding ambulance:', error);
      }
    );
  }
}
