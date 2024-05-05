import { Component } from '@angular/core';
import { SignService } from '../../Auth+shop/Services/sign.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services2/shared.service';

@Component({
  selector: 'app-header-template-relative',
  templateUrl: './header-template-relative.component.html',
  styleUrls: ['./header-template-relative.component.css']
})
export class HeaderTemplateRelativeComponent {

  //ghofrane
id: any;
roleId:any;
  constructor(private router: Router, private sharedService: SharedService,
    
    
    public authService: SignService
    ) {}

  goToTrack(): void {



    // Extract the ID from the current URL
    const currentUrl = this.router.url; // Get the current URL
    const urlParts = currentUrl.split('/'); // Split the URL by '/'
    const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10); // Get the last part as ID

    // Send the ID to the shared service
    this.sharedService.setRelativeId(idFromUrl);

    // Navigate to the Elderly Dashboard component
    this.router.navigate(['/relative/tracking', idFromUrl]);
  }

  goToComplaint(): void {
    // Extract the ID from the current URL
     const currentUrl = this.router.url; // Get the current URL
     const urlParts = currentUrl.split('/'); // Split the URL by '/'
     const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10); // Get the last part as ID
    
     // Send the ID to the shared service
     this.sharedService.setRelativeId(idFromUrl);
    
     // Navigate to the Elderly Dashboard component
     this.router.navigate(['complaintRelative', idFromUrl]);
    }
    goToToDoList(): void {
      // Extract the ID from the current URL
      const currentUrl = this.router.url; // Get the current URL
      const urlParts = currentUrl.split('/'); // Split the URL by '/'
      const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10); // Get the last part as ID
  
      // Send the ID to the shared service
      this.sharedService.setRelativeId(idFromUrl);
  
      // Navigate to the Elderly Dashboard component
      this.router.navigate(['relative/todoRelative', idFromUrl]);
    }
    gotopayment(): void {
      // Extract the ID from the current URL
      const currentUrl = this.router.url; // Get the current URL
      const urlParts = currentUrl.split('/'); // Split the URL by '/'
      const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10); // Get the last part as ID
  
      // Send the ID to the shared service
      this.sharedService.setRelativeId(idFromUrl);
  
      // Navigate to the Elderly Dashboard component
      this.router.navigate(['relative/relative', idFromUrl]);
    }
}

