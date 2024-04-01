import { Component } from '@angular/core';
import { DoctorProfileService } from '../../../services2/doctor-profile.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
@Component({
  selector: 'app-elderlyprofile',
  templateUrl: './elderlyprofile.component.html',
  styleUrls: ['./elderlyprofile.component.css']
})
export class ElderlyprofileComponent {
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
      preferences: ['', Validators.required],
      healthRecord: ['', Validators.required]
    });
  }
    ngOnInit(): void {
      console.log(window.sessionStorage.getItem('ideldery'))
      this.DoctorProfileService.getProfile(window.sessionStorage.getItem('ideldery')).subscribe(
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
        preferences: this.profile.preferences || '',
        healthRecord: this.profile.healthRecord || ''
       
      });
    }
    onmodifie(){
      if(this.Form.valid){
        this.profile.lastName=this.Form.get('lastName')?.value;
        this.profile.firstName=this.Form.get('firstName')?.value;
        this.profile.dateOfBirth=this.Form.get('dateOfBirth')?.value;
        this.profile.email=this.Form.get('email')?.value;
        this.profile.phoneNumber=this.Form.get('phoneNumber')?.value;
        this.profile.preferences=this.Form.get('preferences')?.value;
        this.profile.healthRecord=this.Form.get('healthRecord')?.value;
  
  
        this.DoctorProfileService.updateprofile(window.sessionStorage.getItem('ideldery'),this.profile).subscribe(
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