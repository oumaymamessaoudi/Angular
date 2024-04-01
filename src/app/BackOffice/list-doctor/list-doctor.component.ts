import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../Services/doctor.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-doctor',
  templateUrl: './list-doctor.component.html',
  styleUrls: ['./list-doctor.component.css']
})
export class ListDoctorComponent implements OnInit {
  doctors: any[] = [];
  doctorForm: FormGroup;
  selectedDoctorId: any;
  user:any[]=[];

  

  constructor(private doctorService: DoctorService, private formBuilder: FormBuilder) {
    this.doctorForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: [''],
      gender: [''],
      doctorType: [''],
      role: [''],
      schedule: [''],
      specialization: [''],
      address:[''],
      
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(
      (data) => {
        this.doctors = data;
      },
      (error) => {
        console.error('Error loading doctors:', error);
      }
    );
  }

  updateDoctor(doctorId: any): void {
    this.selectedDoctorId = doctorId;
    const selectedDoctor = this.doctors.find(doctor => doctor.idDoctor === doctorId);
    this.doctorForm.patchValue(selectedDoctor);
  }

  submitUpdate(): void {
    this.doctorService.updateDoctor(this.selectedDoctorId, this.doctorForm.value).subscribe(
      () => {
        this.loadDoctors();
        this.doctorForm.reset();
        this.selectedDoctorId = null;
      },
      (error) => {
        console.error('Error updating doctor:', error);
      }
    );
  }

  deleteDoctor(doctorId: number): void {
    this.doctorService.deleteDoctor(doctorId)
    .subscribe(() => {
      // Supprimer le médecin de la liste locale
      this.doctors = this.doctors.filter(doctor => doctor.idDoctor !== doctorId);
    });
}
}