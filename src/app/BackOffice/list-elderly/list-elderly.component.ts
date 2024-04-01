import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElderlyService } from '../Services/elderly.service';

@Component({
  selector: 'app-list-elderly',
  templateUrl: './list-elderly.component.html',
  styleUrls: ['./list-elderly.component.css']
})
export class ListElderlyComponent {
  elderlys: any[] = [];
  elderlyForm: FormGroup;
  selectedElderlyId: any;

  constructor(private elderlyService: ElderlyService, private formBuilder: FormBuilder) {
    this.elderlyForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      
      email: [''],
      phoneNumber: [''],
      gender: [''],
      role: [''],
      preferences: [''],
      healthRecord: [''],
      
    });
  }

  ngOnInit(): void {
    this.loadElderlys();
  }

  loadElderlys(): void {
    this.elderlyService.getElderlys().subscribe(
      (data) => {
        console.log('Données reçues :', data); // Afficher les données reçues dans la console

        this.elderlys = data;
      },
      (error) => {
        console.error('Error loading elderlys:', error);
      }
    );
  }

  updateElderly(elderlyId: any): void {
    this.selectedElderlyId = elderlyId;
    const selectedElderly = this.elderlys.find(elderly => elderly.elderlyID === elderlyId);
    this.elderlyForm.patchValue(selectedElderly);
  }

  submitUpdate(): void {
    this.elderlyService.updateElderly(this.selectedElderlyId, this.elderlyForm.value).subscribe(
      () => {
        this.loadElderlys();
        this.elderlyForm.reset();
        this.selectedElderlyId = null;
      },
      (error) => {
        console.error('Error updating elderly', error);
      }
    );
  }

  
}


