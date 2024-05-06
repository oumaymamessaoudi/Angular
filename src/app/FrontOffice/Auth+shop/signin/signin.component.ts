import { Component } from '@angular/core';
import { User } from '../Model/user';
import { AuthService } from '../Services/AuthService';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SignService } from '../Services/sign.service';
import { EmailService } from '../Services/email.service';
import { UserService } from '../Services/user.service';
import { SMSService } from '../Services/sms.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  user: any = {};
  test:any;
  message:any;

  submitted = false; // Déclaration et initialisation de la propriété submitted


  // The error message
  errorMessage!: string;
  verificationCode: string = '';
  generatedCode:string = this.emailService.generateVerificationCode();
  showResetPasswordForm: boolean = false;
  verified:boolean=false;
  email: string = "";
  resetMethod :string="email";
  phoneNumber : string ="";
  newPassword!: string;
  confirmPassword !: string;
  emailSent = false; // Add this line

  showLoginForm: boolean = true;
  verificationCodeSent: boolean = false;
 isButtonDisabled: boolean = false;



  constructor(private loginuser: SignService,
    private http: HttpClient,
     private router: Router,
     private emailService:EmailService,
   private userService:UserService,
   private smsService:SMSService,
   private formBuilder: FormBuilder ) {}
   
   loginForm!: FormGroup;


   ngOnInit() {
     this.loginForm = this.formBuilder.group({
       email: [''], // Initialisez avec une valeur vide ou une valeur par défaut si nécessaire
       password:['', Validators.required]
     });
   }
   
   selectMethod(method: string) {
    this.resetMethod = method;
  }
  userSignIn() {
    console.log(this.user);

    if (!this.user.password) {
      alert("Please enter your password");
      return;
    }
     // Ajouter la vérification pour s'assurer que le mot de passe a au moins 6 caractères
  if (this.user.password.length < 6) {
    alert("Password Incorrect");
    return;
  }
    // Vérifier si l'email et le mot de passe correspondent à ceux de l'administrateur
  if (this.user.email == 'admin.pi@esprit.tn' && this.user.password == 'admin1') {

    // Si les identifiants sont corrects, rediriger vers le backend
    this.router.navigate(['/listUser']);
    return; 
  }

  let resp = this.loginuser.signIn(this.user);
  this.loginuser.signIn(this.user).subscribe(
    (data: any) => {
      if (data.statusCode === 0) {
        // Enregistrez les informations de l'utilisateur connecté si nécessaire
        this.loginuser.setUserInfo(data.id, data.role, data.email); 
        // Redirigez l'utilisateur vers le composant approprié en fonction de son rôle et de son ID spécifique au rôle
        switch (data.role) {
          case 'doctor':
            this.router.navigate(['/doctorhome', data.roleId]);
            sessionStorage.setItem('id',data.id);


            break;
          case 'elderly':
            this.router.navigate(['elderlyhome', data.roleId]);
            sessionStorage.setItem('ideldery',data.id);
            break;
          case 'nurse':
            this.router.navigate(['/nurse', data.roleId]);
            sessionStorage.setItem('idnurse',data.id);
            break;
          case 'ambulance-driver':
            this.router.navigate(['/ambulanceDriver', data.roleId]);
            sessionStorage.setItem('iddriver',data.id);
            
            break;
          case 'ambulance-owner':
            this.router.navigate(['/nadhir/own']);
            sessionStorage.setItem('idowner',data.id);
            break;
            case 'relative':
            this.router.navigate(['/HomeRelative', data.roleId]);
            sessionStorage.setItem('idrelative',data.id);
            
            break;
          default:
            // Redirigez vers une page par défaut si le rôle n'est pas reconnu
            this.router.navigate(['/default']);
            break;
        }
      } else if (data.statusCode === 404) {
        // Affichez un message si l'utilisateur n'est pas trouvé
        alert("User with the provided email not found");
      } else {
        // Affichez un message si le mot de passe est incorrect
        if (data.statusCode === 403) {
          // Affichez un message dans une boîte de dialogue pop-up si l'utilisateur est archivé
          alert("User is archived and cannot login.");
        } else {
          alert("Incorrect password");
        }
      }
    },
    (error) => {
      // Gérez les erreurs éventuelles de la requête HTTP
      console.error("HTTP Request Error:", error);
      alert("Error, Try Again!");
    }
  );
}
sendVerificationCode() {
  if(this.resetMethod==='email'){
    this.emailSent = true; // Update emailSent when code is sent

    this.emailService.sendVerificationCode(this.user.email,"Password Reset ",this.generatedCode);
  }
}
  verifyCode(){
  if(this.generatedCode==this.verificationCode){
  this.verified=true;
  }
  }
  
  savePassword(){
    this.showLoginForm = false;
    this.showResetPasswordForm = true;

    if(this.newPassword==this.confirmPassword){
    this.userService.resetPassword(this.email,this.newPassword);
  alert("password changed");
  this.router.navigate(['/profile']); 
  
  }
  }
 

  getButtonLabel() {
    return this.showResetPasswordForm ? "Password Reset" : "Login";
  }

  showLoginFormAgain() {
    this.showLoginForm = true;
    this.showResetPasswordForm = false;

  }
  showResetPassword(method: string) {
    this.resetMethod = method;
    this.showLoginForm = false;
    this.showResetPasswordForm = true;

    
  }
  signInWithGoogle(): void {
    this.http.get<any>('http://localhost:8081/auth/google').subscribe(response => {
      window.location.href = response.redirectUrl;
    });
  }

  }