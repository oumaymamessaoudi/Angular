import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorProfileService } from '../../services2/doctor-profile.service';
import { SharedService } from '../../services2/shared.service';
import { SignService } from '../../Auth+shop/Services/sign.service';
import { UpdateUserService } from '../../Auth+shop/Services/update-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profildoctor',
  templateUrl: './profildoctor.component.html',
  styleUrls: ['./profildoctor.component.css']
})
export class ProfildoctorComponent {
  profile: any;
  Form: FormGroup;
  openforum:boolean=false;
constructor(private DoctorProfileService :DoctorProfileService,private formBuilder: FormBuilder,
  private sharedService: SharedService,
  public authService: SignService,
  private updateUserService:UpdateUserService,
  private router: Router, 
){
  this.Form = this.formBuilder.group({
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    email: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    doctorType: ['', Validators.required],
    specialization: ['', Validators.required]

  });
}


onLogoutClick() {
  this.authService.logout();
}


goToComplaint(): void {
  // Extract the ID from the current URL
   const currentUrl = this.router.url; // Get the current URL
   const urlParts = currentUrl.split('/'); // Split the URL by '/'
   const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10); // Get the last part as ID
  
   // Send the ID to the shared service
   this.sharedService.setDoctorId(idFromUrl);
  
   // Navigate to the Elderly Dashboard component
   this.router.navigate(['/DoctorComplaints', idFromUrl]);
  }
  ngOnInit(): void {
    this.DoctorProfileService.getProfile(window.sessionStorage.getItem('id')).subscribe(
      (dd) => {
        this.profile = dd;
        console.log( this.profile)
      },
      (error) => {
        console.error( error);
      }
    );
    
  }
  close(){
    this.openforum=false;
  }
  open(){
    this.openforum=true;
    this.Form.patchValue({
      lastName: this.profile.lastName || '', 
      firstName: this.profile.firstName || '',
      dateOfBirth: this.profile.dateOfBirth || '', 
      email: this.profile.email || '', 
      phoneNumber: this.profile.phoneNumber || '',
      doctorType: this.profile.doctorType || '',
      specialization: this.profile.specialization || ''


     
    });
  }
  onmodifie(){
    if(this.Form.valid){
      this.profile.lastName=this.Form.get('lastName')?.value;
      this.profile.firstName=this.Form.get('firstName')?.value;
      this.profile.dateOfBirth=this.Form.get('dateOfBirth')?.value;
      this.profile.email=this.Form.get('email')?.value;
      this.profile.phoneNumber=this.Form.get('phoneNumber')?.value;
      this.profile.doctorType=this.Form.get('doctorType')?.value;
      this.profile.specialization=this.Form.get('specialization')?.value;


      this.DoctorProfileService.updateprofile(window.sessionStorage.getItem('id'),this.profile).subscribe(
        (dd) => {
        location.reload();
        },
        (error) => {
          console.error( error);
        }
      );
    }
  }
  goToDoc(): void {
    // Extract the ID from the current URL
     const currentUrl = this.router.url; // Get the current URL
     const urlParts = currentUrl.split('/'); // Split the URL by '/'
     const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10); // Get the last part as ID
    
     // Send the ID to the shared service
     this.sharedService.setElderlyId(idFromUrl);
    
     // Navigate to the Elderly Dashboard component
     this.router.navigate(['/doctor-dashboard', idFromUrl]);
    }
    goToHome(): void {
      // Extract the ID from the current URL
       const currentUrl = this.router.url; // Get the current URL
       const urlParts = currentUrl.split('/'); // Split the URL by '/'
       const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10); // Get the last part as ID
      
       // Send the ID to the shared service
       this.sharedService.setElderlyId(idFromUrl);
      
       // Navigate to the Elderly Dashboard component
       this.router.navigate(['/doctorhome', idFromUrl]);
      }
}
