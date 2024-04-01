import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RelativeService } from '../Services/relative.service';

@Component({
  selector: 'app-list-relative',
  templateUrl: './list-relative.component.html',
  styleUrls: ['./list-relative.component.css']
})
export class ListRelativeComponent {
  relatives: any[] = [];
  relativeForm: FormGroup;
  selectedRelativeId: any;
  user:any[]=[];

  

  constructor(private relativeService: RelativeService, private formBuilder: FormBuilder) {
    this.relativeForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: [''],
      address:[''],
      relationship: [''],
      gender: [''],
      
      role: [''],
      elderlyEmail:['']      
      
    });
  }

  ngOnInit(): void {
    this.loadRelatives();
  }

  loadRelatives(): void {
    this.relativeService.getRelatives().subscribe(
      (data) => {
        this.relatives = data;
      },
      (error) => {
        console.error('Error loading relatives:', error);
      }
    );
  }

  updateRelative(relativeId: any): void {
    this.selectedRelativeId = relativeId;
    const selectedRelative = this.relatives.find(relative => relative.idRelative === relativeId);
    this.relativeForm.patchValue(selectedRelative);
  }

  submitUpdate(): void {
    this.relativeService.updateRelative(this.selectedRelativeId, this.relativeForm.value).subscribe(
      () => {
        this.loadRelatives();
        this.relativeForm.reset();
        this.selectedRelativeId = null;
      },
      (error) => {
        console.error('Error updating relative:', error);
      }
    );
  }

  deleteRelative(relativeId: number): void {
    this.relativeService.deleteRelative(relativeId)
    .subscribe(() => {
      // Supprimer le relative de la liste locale
      this.relatives = this.relatives.filter(relative => relative.idRelative !== relativeId);
    });
}
}


