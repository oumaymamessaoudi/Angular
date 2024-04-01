import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Ambulance } from 'src/app/FrontOffice/Ambulance/Model/Ambulance';
import { AmbulanceService } from 'src/app/FrontOffice/Ambulance/ServiceA/ambulance.service';

@Component({
  selector: 'app-update-ambulance',
  templateUrl: './update-ambulance.component.html',
  styleUrls: ['./update-ambulance.component.css']
})
export class UpdateAmbulanceComponent implements OnInit {
  ambulanceId!: number;
  ambulance: Ambulance | null = null;
  imageFile: File | null = null;
  imageUrl: string | null = null;

  constructor(private route: ActivatedRoute, private ambulanceService: AmbulanceService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.ambulanceId = +id;
        this.getAmbulance(this.ambulanceId);
      }
    });
  }

  getAmbulance(id: number): void {
    this.ambulanceService.getAmbulanceById(id)
      .subscribe(
        (data: Ambulance) => {
          this.ambulance = data;
          this.getImageUrl(this.ambulance);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getImageUrl(ambulance: Ambulance): void {
    if (ambulance && ambulance.imageAmbul) {
      this.imageUrl = this.ambulanceService.getImageUrl(ambulance.imageAmbul);
    }
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.imageFile = inputElement.files[0];
      this.imageUrl = null; // Supprimer l'ancienne URL
      // Créer un objet URL pour l'aperçu de la nouvelle image
      this.imageUrl = URL.createObjectURL(this.imageFile);
    }
  }

  updateAmbulance(): void {
    if (!this.ambulance) {
      console.error('Ambulance is null');
      return;
    }
  
    if (!this.ambulance.location) {
      console.error('Location is required');
      return;
    }
  
    const formData = new FormData();
    formData.append('location', this.ambulance.location);
    formData.append('status', this.ambulance.status);
  
    if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name);
    } else if (this.imageUrl) {
      // Supprimer l'ancienne image
      formData.append('deleteImage', 'true');
      
      // Utiliser l'URL de la nouvelle image sélectionnée
      fetch(this.imageUrl)
        .then(response => response.blob())
        .then(blob => {
          formData.append('image', blob, 'new_image.png');
        });
    }
  
    if (this.ambulance.ambulanceID !== undefined) {
      this.ambulanceService.updateAmbulance(formData, this.ambulance.ambulanceID).subscribe(
        (response) => {
          console.log('Ambulance updated successfully:', response);
        },
        (error) => {
          console.error('Error updating ambulance:', error);
        }
      );
    } else {
      console.error('Ambulance ID is undefined');
    }
  }
  
}

