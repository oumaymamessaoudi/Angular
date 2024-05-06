import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignService } from '../Services/sign.service';
import { SharedService } from '../../services2/shared.service';

@Component({
  selector: 'app-ambulance-driver',
  templateUrl: './ambulance-driver.component.html',
  styleUrls: ['./ambulance-driver.component.css']
})
export class AmbulanceDriverComponent {

  constructor(private route: ActivatedRoute,public authService: SignService
    ,private router: Router,
    private sharedService: SharedService

    ) {}

    ngOnInit(): void {
   
    
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          console.log('ID de l\'ambulance:', id);
        } else {
          console.error('ID de l\'ambulance introuvable dans l\'URL');
        }
      });
      }




     



  onLogoutClick() {
    this.authService.logout();
  }





  goToSalary(): void {



    // Extract the ID from the current URL
    const currentUrl = this.router.url; // Get the current URL
    const urlParts = currentUrl.split('/'); // Split the URL by '/'
    const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10); // Get the last part as ID

    // Send the ID to the shared service
    this.sharedService.setRelativeId(idFromUrl);

    // Navigate to the Elderly Dashboard component
    this.router.navigate(['/d/DriverNadhir', idFromUrl]);
  }
}