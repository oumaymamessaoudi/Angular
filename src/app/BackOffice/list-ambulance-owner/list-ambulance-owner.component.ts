import { Component } from '@angular/core';
import { AmbulanceOwnerService } from '../Services/ambulance-owner.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-ambulance-owner',
  templateUrl: './list-ambulance-owner.component.html',
  styleUrls: ['./list-ambulance-owner.component.css']
})
export class ListAmbulanceOwnerComponent {
  ambulanceOwners: any[] = [];
  ambulanceOwnerForm: FormGroup;
  selectedAmbulanceOwnerId: any;

  constructor(private ambulanceOwnerService: AmbulanceOwnerService, private formBuilder: FormBuilder) {
    this.ambulanceOwnerForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: [''],
      gender: [''],
      doctorType: [''],
      role: [''],
      yearsofexperience: [''],
      onDuty: [''],
      
    });
  }

  ngOnInit(): void {
    this.loadAmbulanceOwners();
  }

  loadAmbulanceOwners(): void {
    this.ambulanceOwnerService.getAmbulanceOwners().subscribe(
      (data) => {
        this.ambulanceOwners = data;
      },
      (error) => {
        console.error('Error loading ambulanceOwners:', error);
      }
    );
  }

  updateAmbulanceOwner(ambulanceOwnerId: any): void {
    this.selectedAmbulanceOwnerId = ambulanceOwnerId;
    const selectedAmbulanceOwner = this.ambulanceOwners.find(ambulanceOwner => ambulanceOwner.ambulanceOwnerID === ambulanceOwnerId);
    this.ambulanceOwnerForm.patchValue(selectedAmbulanceOwner);
  }

  submitUpdate(): void {
    this.ambulanceOwnerService.updateAmbulanceOwner(this.selectedAmbulanceOwnerId, this.ambulanceOwnerForm.value).subscribe(
      () => {
        this.loadAmbulanceOwners();
        this.ambulanceOwnerForm.reset();
        this.selectedAmbulanceOwnerId = null;
      },
      (error) => {
        console.error('Error updating ambulance Owner:', error);
      }
    );
  }

  deleteAmbulanceOwner(ambulanceOwnerId: number): void {
    this.ambulanceOwnerService.deleteAmbulanceOwner(ambulanceOwnerId)
    .subscribe(() => {
      // Supprimer le ambulance Owner de la liste locale
      this.ambulanceOwners = this.ambulanceOwners.filter(ambulanceOwner => ambulanceOwner.idAmbulanceOwner !== ambulanceOwnerId);
    });
}
}


