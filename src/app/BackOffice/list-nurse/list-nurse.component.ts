import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NurseService } from '../Services/nurse.service';

@Component({
  selector: 'app-list-nurse',
  templateUrl: './list-nurse.component.html',
  styleUrls: ['./list-nurse.component.css']
})
export class ListNurseComponent {
  nurses: any[] = [];
  nurseForm: FormGroup;
  selectedNurseId: any;
  

  constructor(private nurseService: NurseService, private formBuilder: FormBuilder) {
    this.nurseForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: [''],
      gender: [''],
     
      role: [''],
      responsibilities: [''],
      
    });
  }

  ngOnInit(): void {
    this.loadNurses();
  }

  loadNurses(): void {
    this.nurseService.getNurses().subscribe(
      (data) => {
        this.nurses = data;
      },
      (error) => {
        console.error('Error loading nurses:', error);
      }
    );
  }

  updateNurse(nurseId: any): void {
    this.selectedNurseId = nurseId;
    const selectedNurse = this.nurses.find(nurse => nurse.nurseID === nurseId);
    this.nurseForm.patchValue(selectedNurse);
  }
  

  submitUpdate(): void {
    this.nurseService.updateNurse(this.selectedNurseId, this.nurseForm.value).subscribe(
      () => {
        this.loadNurses();
        this.nurseForm.reset();
        this.selectedNurseId = null;
      },
      (error) => {
        console.error('Error updating nurse:', error);
      }
    );
  }

  deleteNurse(nurseId: number): void {
    this.nurseService.deleteNurse(nurseId)
    .subscribe(() => {
      // Supprimer le médecin de la liste locale
      this.nurses = this.nurses.filter(nurse => nurse.idNurse !== nurseId);
    });
}
}


