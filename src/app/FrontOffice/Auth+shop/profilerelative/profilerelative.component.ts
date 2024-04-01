import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DoctorProfileService } from '../../services2/doctor-profile.service';

@Component({
  selector: 'app-profilerelative',
  templateUrl: './profilerelative.component.html',
  styleUrls: ['./profilerelative.component.css']
})
export class ProfilerelativeComponent {
     profile: any;
    Form: FormGroup;
    openforum:boolean=false;
  constructor(private DoctorProfileService :DoctorProfileService,private formBuilder: FormBuilder){
    this.Form = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      relationship: ['', Validators.required]
    });}
    ngOnInit(): void {
      console.log(window.sessionStorage.getItem('idrelative'))
      this.DoctorProfileService.getProfile(window.sessionStorage.getItem('idrelative')).subscribe(
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
        relationship: this.profile.relationship || ''
       
      });
    }
    onmodifie(){
      if(this.Form.valid){
        this.profile.lastName=this.Form.get('lastName')?.value;
        this.profile.firstName=this.Form.get('firstName')?.value;
        this.profile.dateOfBirth=this.Form.get('dateOfBirth')?.value;
        this.profile.email=this.Form.get('email')?.value;
        this.profile.address=this.Form.get('address')?.value;
        this.profile.phoneNumber=this.Form.get('phoneNumber')?.value;
        this.profile.relationship=this.Form.get('relationship')?.value;
  
        this.DoctorProfileService.updateprofile(window.sessionStorage.getItem('idrelative'),this.profile).subscribe(
          (dd) => {
          location.reload();
          },
          (error) => {
            console.error( error);
          }
        );
      }
    }
  }
  
