import { Component } from '@angular/core';
import { SignService } from '../../Auth+shop/Services/sign.service';
import { UpdateUserService } from '../../Auth+shop/Services/update-user.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services2/shared.service';

@Component({
  selector: 'app-header-front-oumayma',
  templateUrl: './header-front-oumayma.component.html',
  styleUrls: ['./header-front-oumayma.component.css']
})
export class HeaderFrontOumaymaComponent {
  userId: number | undefined;

  constructor(
    public authService: SignService,
    private updateUserService:UpdateUserService,
    private router: Router, 
    private sharedService: SharedService) {}

  onLogoutClick() {
    this.authService.logout();
  }


  goToComplaint(): void {
    // Extract the ID from the current URL
     const currentUrl = this.router.url; // Get the current URL
     const urlParts = currentUrl.split('/'); // Split the URL by '/'
     const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10); // Get the last part as ID
    
     // Send the ID to the shared service
     this.sharedService.setDoctorId(idFromUrl);
    
     // Navigate to the Elderly Dashboard component
     this.router.navigate(['/DoctorComplaints', idFromUrl]);
    }

    goToDoc(): void {
      // Extract the ID from the current URL
       const currentUrl = this.router.url; // Get the current URL
       const urlParts = currentUrl.split('/'); // Split the URL by '/'
       const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10); // Get the last part as ID
      
       // Send the ID to the shared service
       this.sharedService.setElderlyId(idFromUrl);
      
       // Navigate to the Elderly Dashboard component
       this.router.navigate(['/doctor-dashboard', idFromUrl]);
      }
      goToHome(): void {
        // Extract the ID from the current URL
         const currentUrl = this.router.url; // Get the current URL
         const urlParts = currentUrl.split('/'); // Split the URL by '/'
         const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10); // Get the last part as ID
        
         // Send the ID to the shared service
         this.sharedService.setElderlyId(idFromUrl);
        
         // Navigate to the Elderly Dashboard component
         this.router.navigate(['/doctorhome', idFromUrl]);
        }
}
