import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorProfileService } from '../../services2/doctor-profile.service';

@Component({
  selector: 'app-profildoctor',
  templateUrl: './profildoctor.component.html',
  styleUrls: ['./profildoctor.component.css']
})
export class ProfildoctorComponent {
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
      doctorType: ['', Validators.required],
      specialization: ['', Validators.required]
  
    });
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
  }
  