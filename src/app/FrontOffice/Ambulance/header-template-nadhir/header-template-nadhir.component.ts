import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services2/shared.service';
import { UpdateUserService } from '../../Auth+shop/Services/update-user.service';
import { SignService } from '../../Auth+shop/Services/sign.service';

@Component({
  selector: 'app-header-template-nadhir',
  templateUrl: './header-template-nadhir.component.html',
  styleUrls: ['./header-template-nadhir.component.css']
})
export class HeaderTemplateNadhirComponent {
//ghofrane
id: any;
roleId:any;
constructor(private router: Router, private sharedService: SharedService,
    
    
  public authService: SignService,private updateUserService:UpdateUserService
  ) {}
 
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
}
