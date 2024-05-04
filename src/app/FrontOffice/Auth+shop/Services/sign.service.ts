import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../Model/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SignService {
  
  private baseUrl = 'http://localhost:8081/auth';
  private base1Url = 'http://localhost:8081/auth1';   
  private base2Url = 'http://localhost:8081/SMS';
  private base3Url = 'http://localhost:8081/api';    
    
  constructor(private httpClient: HttpClient, private router: Router) {}

  user: User = new User();
  private userInfo: {
    id: any;
    role: string;
    email: string;
  } = {
    role: '',
    email: '',
    id: '' 
  };
  


 /* login(user: User): Observable<object> {
    return this.httpClient.post(`${this.baseUrl}/signup`, user);  
  }*/
  signIn(user: User): Observable<object> {
    return this.httpClient.post(`${this.baseUrl}/signin`, user).pipe(
      tap((response: any) => {
        console.log(response);
        this.user = response.user; 
        this.setUserInfo(response.id, response.role, response.email);

        // Set online status to true when user signs in
        this.updateUserOnlineStatus(true).subscribe(() => {
          console.log('User online status updated to true');
        }, error => {
          console.error('Error updating user online status to true:', error);
        });
      })
    );
  }
  
  

  setUserInfo(id:any,role: string, email: string) {
    this.userInfo.id=id;
    this.userInfo.role = role;
    this.userInfo.email = email;
  }

  getUserRole(): string {
    return this.userInfo.role;
  }

  getUserEmail(): string {
    return this.userInfo.email;
  }

  isLoggedIn(): boolean {
    return !!this.userInfo.role && !!this.userInfo.email;
  }



 

 //MARIEMMM
 fetchOnlineStatus(): Observable<any> {
  return this.httpClient.get<any>('http://localhost:8081/auth/online-status');
}

//MARIEM
 updateUserOnlineStatus(online: boolean): Observable<any> {
  const userEmail = this.getUserEmail();
  const payload = online; // Ensure the payload is a boolean value
  return this.httpClient.put(`${this.baseUrl}/update-online-status/${userEmail}`, payload);
}





//edited by mariem to edit online status
  logout() {
    // Set user's online status to false when logging out
    this.updateUserOnlineStatus(false).subscribe(() => {
      
     this.userInfo = { id:'',role: '', email: '' };

  
      // Redirect to home page
      this.router.navigate(['/']);
    }, error => {

      console.error('Error updating user online status:', error);
      this.userInfo = { id:'',role: '', email: '' };

      this.router.navigate(['/']);
    });
  }




  getUserById(doctorId: any): Observable<any> {
    const userId = this.getUserId(); // Obtenez l'ID de l'utilisateur connecté
    const url = `${this.base3Url}/profile/${userId}`;
    return this.httpClient.get(url);
  }
  getUserId(): any {
    return this.userInfo.id
  }


  



  signUp(user: User): Observable<object> {
    return this.httpClient.post(`${this.baseUrl}/signup`, user).pipe(
      tap((response: any) => {
        // Appel du service d'envoi de SMS après une inscription réussie
        this.sendWelcomeSMS(response.phoneNumber, response.email, response.role);
      })
    );  
  }

  // Méthode pour envoyer le SMS de bienvenue
private sendWelcomeSMS(phoneNumber: string, email: string, role: string) {
  // Vérifier si phoneNumber est null avant de l'utiliser
  if (phoneNumber != null) {
    // Ajouter le code de pays "+216" au numéro de téléphone
    const formattedPhoneNumber = '+216' + phoneNumber;

    // Créer l'objet de demande SMS avec le numéro de téléphone formaté
    const smsRequest = { phoneNumber: formattedPhoneNumber, email, role };

    // Envoyer la demande POST
    this.httpClient.post(`${this.base2Url}/send-smsWelcome`, smsRequest).subscribe(
        () => {
            console.log('SMS sent successfully');
        },
        (error) => {
            console.error('Failed to send SMS:', error);
        }
    );
} else {
    // Traitement pour le cas où phoneNumber est null
    console.error('Phone number is null');
}}
}