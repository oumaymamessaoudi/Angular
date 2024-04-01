import { Component } from '@angular/core';
import { AuthService } from '../Services/AuthService';
import { SignService } from '../Services/sign.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-front',
  templateUrl: './home-front.component.html',
  styleUrls: ['./home-front.component.css']
})
export class HomeFrontComponent {
  constructor(public authService: SignService, private router: Router) {}

  onLogoutClick() {
    this.authService.logout();
  }

  updateProfile() {
    const userId = this.authService.getUserId();
    console.log("hello" + userId);
  
    this.authService.getUserById(userId).subscribe(
      (userData) => {
        this.openProfileUpdateModal(userId);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  
      openProfileUpdateModal(userId: any) {
       
        this.router.navigate(['/update', userId]);
      }
    }
    
