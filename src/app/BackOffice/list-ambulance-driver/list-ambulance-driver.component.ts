import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AmbulanceDriverService } from '../Services/ambulance-driver.service';

@Component({
  selector: 'app-list-ambulance-driver',
  templateUrl: './list-ambulance-driver.component.html',
  styleUrls: ['./list-ambulance-driver.component.css']
})
export class ListAmbulanceDriverComponent {
  ambulanceDrivers: any[] = [];
  ambulanceDriverForm: FormGroup;
  selectedAmbulanceDriverId: any;

  constructor(private ambulanceDriverService: AmbulanceDriverService, private formBuilder: FormBuilder) {
    this.ambulanceDriverForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: [''],
      gender: [''],
      doctorType: [''],
      role: [''],
      drivingExperienceYears: [''],
      onDuty: [''],
      
    });
  }

  ngOnInit(): void {
    this.loadAmbulanceDrivers();
  }

  loadAmbulanceDrivers(): void {
    this.ambulanceDriverService.getAmbulanceDrivers().subscribe(
      (data) => {
        this.ambulanceDrivers = data;
      },
      (error) => {
        console.error('Error loading ambulanceDrivers:', error);
      }
    );
  }

  updateAmbulanceDriver(ambulanceDriverId: any): void {
    this.selectedAmbulanceDriverId = ambulanceDriverId;
    const selectedAmbulanceDriver = this.ambulanceDrivers.find(ambulanceDriver => ambulanceDriver.ambulanceDriverID === ambulanceDriverId);
    this.ambulanceDriverForm.patchValue(selectedAmbulanceDriver);
  }

  submitUpdate(): void {
    this.ambulanceDriverService.updateAmbulanceDriver(this.selectedAmbulanceDriverId, this.ambulanceDriverForm.value).subscribe(
      () => {
        this.loadAmbulanceDrivers();
        this.ambulanceDriverForm.reset();
        this.selectedAmbulanceDriverId = null;
      },
      (error) => {
        console.error('Error updating ambulance driver:', error);
      }
    );
  }

  deleteAmbulanceDriver(ambulanceDriverId: number): void {
    this.ambulanceDriverService.deleteAmbulanceDriver(ambulanceDriverId)
    .subscribe(() => {
      // Supprimer le ambulance driver de la liste locale
      this.ambulanceDrivers = this.ambulanceDrivers.filter(ambulanceDriver => ambulanceDriver.idAmbulanceDriver !== ambulanceDriverId);
    });
}
}


