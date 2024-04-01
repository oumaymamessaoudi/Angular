import { Component } from '@angular/core';
import { SignService } from '../Services/sign.service';
import { UpdateUserService } from '../Services/update-user.service';

@Component({
  selector: 'app-header-front',
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css']
})
export class HeaderFrontComponent {
  constructor(public authService: SignService,private updateUserService:UpdateUserService) {}

  onLogoutClick() {
    this.authService.logout();
  }

  updateProfile() {
    const userId = this.authService.getUserId();
  
    this.authService.getUserById(userId).subscribe(
      (userData) => {
       
        this.openProfileUpdateModal(userData);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  

  openProfileUpdateModal(userData: any) {
    console.log('Opening profile update modal with user data:', userData);
  }
}

