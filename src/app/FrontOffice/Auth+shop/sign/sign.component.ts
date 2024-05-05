import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../Model/user';
import { SignService } from '../Services/sign.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../Services/email.service';
import { UserService } from '../Services/user.service';
import { HttpClient } from '@angular/common/http';
import { RecaptchaService } from '../Services/recaptcha.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  captchaImageUrl: string;
  captchaData: any;
  captchaError: string = ''; // Variable pour stocker le message d'erreur du captcha
  captchaWarningMessage: string = '';
  test: any;
  message: any;
  user: any = {};
  userForm!: FormGroup;
  emailAlreadyUsed: boolean = false; // Initialize with a default value

  loggedIn: boolean = false;

  captchaImage: string;
  captchaInput: string;
  verificationResult: boolean | null = null;
  generatedCaptcha: string = ''; // Declare generatedCaptcha as a class member
  isCodeCorrect: boolean = false;
  codeVerificationMessage: string = '';


constructor(private loginuser: SignService,
   private router: Router, 
   private formBuilder: FormBuilder,
   private http: HttpClient ,
   private recaptchaService: RecaptchaService) {}

ngOnInit(): void {

  this.userForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, this.emailValidator]],
    phoneNumber: ['', [Validators.required, this.phoneNumberValidator]],
    role: ['Select Role', Validators.required], // Défaut à 'Select Role'
    doctorType: [''],
    specialization: [''],
    responsibilities: [''],
    preferences: [''],
    healthRecord: [''],
    relationship: [''],
    onDuty: [false],
    drivingExperienceYears: [''],
    yearsofexperience: [''],
    schedule: [''],
    gender:[''],
    dateOfBirth: ['', [Validators.required, this.dateOfBirthValidator.bind(this)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    certification: [''], // Assurez-vous que 'certification' est correctement défini ici
    address:['', Validators.required],
    elderlyEmail:['', [Validators.required, Validators.email, this.emailValidator]],
    language:[''],
    captchaInput: ['', Validators.required] // Assurez-vous que le champ captchaInput est ajouté au groupe de formulaires



  });
 

}phoneNumberValidator(control: any) {
  const phoneNumber = control.value;
  const phoneNumberPattern = /^(2|5|9)\d{7}$/; // Pattern pour vérifier que le numéro commence par 2, 5 ou 9 et a une longueur totale de 8 chiffres

  if (!phoneNumberPattern.test(phoneNumber)) {
    return { invalidPhoneNumber: true };
  }

  return null; // Validation réussie
}
emailValidator(control: any) {
  const email = control.value;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Pattern pour vérifier le format de l'email

  if (!emailPattern.test(email)) {
    return { invalidEmail: true };
  }

  return null; // Validation réussie
}




dateOfBirthValidator(control: any) {
  const selectedDate = new Date(control.value);
  const currentDate = new Date();

  if (selectedDate > currentDate) {
    return { futureDate: true };
  }

  return null; // La validation a réussi
}

updateSchedule(event: any, day: string) {
  const scheduleControl = this.userForm.get('schedule');

  if (scheduleControl) { // Check if the control is not null
    if (event.target.checked) {
      const currentValue = scheduleControl.value || '';
      scheduleControl.setValue(`${currentValue}, ${day}`);
    } else {
      const currentValue = scheduleControl.value || '';
      const days = currentValue.split(',').map((d: string) => d.trim());
      const index = days.indexOf(day);
      if (index !== -1) {
        days.splice(index, 1);
        scheduleControl.setValue(days.join(', '));
      }
    }
  }
}



userSign() {
  console.log(this.user);
  let resp = this.loginuser.signUp(this.userForm.value);

  this.test = resp.subscribe(
    (data) => {
      this.message = data;
      
      // Check if the response has a statusCode of 333 (Email already in use)
      if (this.message.statusCode === 333) {
        this.emailAlreadyUsed = true;
        alert("Error, Email is already in use. Please try again with a different email.");
      } else {
        // If the response statusCode is not 333, navigate to "/signIn"
        this.router.navigate(["/signIn"]);
      }
    },
    (error) => {
      // Handle other errors
      alert("Error, Try Again!");
    }
  );
}

// Fonction pour générer le captcha
  generateCaptcha(): void {
    this.verificationResult = null;
    this.recaptchaService.generateCaptcha().subscribe(
      (captchaData: any) => {
        this.captchaData = captchaData;
        this.captchaImage = captchaData.image_url;
        this.captchaError = ''; // Réinitialiser le message d'erreur
      },
      error => {
        console.error('Erreur lors de la génération du captcha:', error);
      }
    );
  }

verifyCode(): void {
  const enteredCaptcha = this.captchaInput; // Le code saisi par l'utilisateur

  console.log('Entered Captcha:', enteredCaptcha); // Ajouter cette ligne pour vérifier le code captcha saisi par l'utilisateur

  // Récupérez la solution du captcha de captchaData
  const captchaSolution = this.captchaData ? this.captchaData.solution : '';

  console.log('Captcha Solution:', captchaSolution); // Ajouter cette ligne pour vérifier la solution du captcha extraite

  // Vérifiez si le code saisi correspond à la solution du captcha
  if (enteredCaptcha === captchaSolution) {
    this.verificationResult = true;
    this.codeVerificationMessage = 'Captcha correct !';
    this.captchaWarningMessage = 'Captcha Correct !'; // Réinitialiser le message d'avertissement
    this.userSign();

  } else {
    this.verificationResult = false;
    this.codeVerificationMessage = 'Captcha incorrect.';
    this.captchaWarningMessage = 'Incorrect captcha. Please try again.'; // Message d'avertissement pour captcha incorrect

    // Régénérer automatiquement le captcha
    this.generateCaptcha();
  }
}

}
