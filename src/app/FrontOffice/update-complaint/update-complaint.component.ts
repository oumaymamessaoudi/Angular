import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Complaint } from '../Auth+shop/Model/Complaint';
import { ActivatedRoute } from '@angular/router';
import { ComplaintService } from '../Auth+shop/Services/complaint.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-complaint',
  templateUrl: './update-complaint.component.html',
  styleUrls: ['./update-complaint.component.css']
})
export class UpdateComplaintComponent {
  complaintId: any;
  complaintForm: FormGroup;
  relativeId: number;
  complaint: Complaint; // Declare the complaint property

  constructor(
    private route: ActivatedRoute,
    private complaintService: ComplaintService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.complaintId = +params.get('id');
      console.log('Complaint ID:', this.complaintId);
      this.initForm();
    });
  }

  initForm(): void {
    this.complaintForm = this.fb.group({
      category: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required]
    });

    this.complaintService.getComplaintById(this.complaintId, this.relativeId).subscribe(
      complaint => {
        console.log('Fetched complaint:', complaint);
        if (complaint) { 
          this.complaintForm.patchValue({
            category: complaint.category,
            type: complaint.type,
            description: complaint.description,
            priority: complaint.priority
          });

          if (complaint.relative && complaint.relative.id) {
            this.relativeId = complaint.relative.id;
            console.log('Relative ID:', this.relativeId);
          } else {
            console.log('Relative ID not found');
          }
        }
      },
      error => {
        console.error('Error fetching complaint:', error);
        this._snackBar.open('Error fetching complaint', 'Close', { duration: 3000 });
      }
    );
  }
  
  onSubmit(): void {
    console.log('Form submitted');
    if (this.complaintForm.valid) {
      console.log('Form is valid');
      const formData = this.complaintForm.value;
      console.log('Form data:', formData);
      this.complaintService.updateComplaint1(this.complaintId, formData).subscribe(
        () => {
          console.log('Complaint updated successfully');
          this._snackBar.open('Complaint updated successfully', 'Close', { duration: 3000 });
        },
        error => {
          console.error('Error updating complaint:', error);
          this._snackBar.open('Error updating complaint', 'Close', { duration: 3000 });
        }
      );
    } else {
      console.log('Form is invalid');
      // Log form errors for debugging
      console.log('Form errors:', this.complaintForm.errors);
      // Mark all form controls as touched to display validation errors
      this.complaintForm.markAllAsTouched();
    }
  }
}