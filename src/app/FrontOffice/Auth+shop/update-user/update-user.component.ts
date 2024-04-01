import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateUserService } from '../Services/update-user.service';
import { SignService } from '../Services/sign.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  userId: any;
  userUpdateForm: any;
  userData: any; // Declare userData property
  elderlyList: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private updateUserService: UpdateUserService,
    private signService: SignService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id']; // Récupérer l'ID de l'utilisateur à partir de la route
    this.signService.getUserById(this.userId).subscribe(
      (userData) => {
        this.userData = userData;
        console.log(userData); // Afficher les informations de l'utilisateur dans la console
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  
    // Fetch user data and update the form
    this.updateUserService.getUserById(this.userId).subscribe(
      (userData) => {
        this.userData = userData; // Assign userData to the class property
        this.userUpdateForm.patchValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.user.email,
            role: userData.role,
            phoneNumber: userData.phoneNumber,
            doctorType: userData.doctorType,
            specialization: userData.specialization,
            schedule: userData.schedule,
            doctorPhoneNumber: userData.doctorPhoneNumber,
            responsibilities: userData.responsibilities,
            preferences: userData.preferences,
            healthRecord: userData.healthRecord,
            relationship: userData.relationship,
            onDuty: userData.onDuty,
            drivingExperienceYears: userData.drivingExperienceYears,
            yearsOfExperience: userData.yearsOfExperience,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,

        });
        // Check if the user is a doctor and has elderlyList
        if (userData.role === 'doctor' && userData.elderlyList) {
         console.log(userData.elderlyList)
         this.elderlyList = userData.elderlyList;
       }
     },
     (error) => {
       console.error('Error fetching user data:', error);
     }
   );
 }
 

  initForm() {
    this.userUpdateForm = this.formBuilder.group({
      firstName: ['', Validators.required], // Ajoutez le champ pour le prénom avec une validation requise
      lastName: ['', Validators.required],  // Ajoutez le champ pour le nom avec une validation requise

      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],

      doctorType: [''],
      specialization: [''],
      schedule: [''],
      doctorPhoneNumber: [''],
      responsibilities: [''],
      preferences: [''],
      healthRecord: [''],
      relationship: [''],
      onDuty: [false],
      drivingExperienceYears: [''],
      yearsOfExperience: [''],
    });
  }

  updateProfile() {
    // Get the updated user data from the form
    const updatedUserData = this.userUpdateForm.value;

    // Update the user profile
    this.updateUserService.updateUserProfile(this.userId, updatedUserData).subscribe(
      () => {
        console.log('Profile updated successfully');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error updating user profile:', error);
      }
    );
  }
}
