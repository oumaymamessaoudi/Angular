import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorProfileService } from '../../services2/doctor-profile.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services2/shared.service';
import { SignService } from '../Services/sign.service';

@Component({
  selector: 'app-profiledriver',
  templateUrl: './profiledriver.component.html',
  styleUrls: ['./profiledriver.component.css']
})
export class ProfiledriverComponent {
  id: any;
roleId:any;
  profile: any;
  Form: FormGroup;
  openforum:boolean=false;
constructor(private DoctorProfileService :DoctorProfileService,private formBuilder: FormBuilder,
  private router: Router,
     private sharedService: SharedService,
     public authService: SignService
){
  this.Form = this.formBuilder.group({
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    email: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    onDuty: [''],
    drivingExperienceYears: ['', Validators.required],

  });}
  ngOnInit(): void {
    console.log(window.sessionStorage.getItem('iddriver'))
    this.DoctorProfileService.getProfile(window.sessionStorage.getItem('iddriver')).subscribe(
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
      drivingExperienceYears: this.profile.drivingExperienceYears || '',
      onDuty: this.profile.onDuty|| '',



     
    });
  }
  onmodifie(){
    if(this.Form.valid){
      this.profile.lastName=this.Form.get('lastName')?.value;
      this.profile.firstName=this.Form.get('firstName')?.value;
      this.profile.dateOfBirth=this.Form.get('dateOfBirth')?.value;
      this.profile.email=this.Form.get('email')?.value;
      this.profile.phoneNumber=this.Form.get('phoneNumber')?.value;
      this.profile.onDuty=this.Form.get('onDuty')?.value;
      this.profile.drivingExperienceYears=this.Form.get('drivingExperienceYears')?.value;


      this.DoctorProfileService.updateprofile(window.sessionStorage.getItem('iddriver'),this.profile).subscribe(
        (dd) => {
      location.reload()
        },
        (error) => {
          console.error( error);
        }
      );
    }
  }




























  onLogoutClick() {
    this.authService.logout();
  }





  goToSalary(): void {



    // Extract the ID from the current URL
    const currentUrl = this.router.url; // Get the current URL
    const urlParts = currentUrl.split('/'); // Split the URL by '/'
    const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10); // Get the last part as ID

    // Send the ID to the shared service
    this.sharedService.setRelativeId(idFromUrl);

    // Navigate to the Elderly Dashboard component
    this.router.navigate(['/d/DriverNadhir', idFromUrl]);
  }
}
