import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignService } from '../Services/sign.service';

@Component({
  selector: 'app-ambulance-driver',
  templateUrl: './ambulance-driver.component.html',
  styleUrls: ['./ambulance-driver.component.css']
})
export class AmbulanceDriverComponent {

  constructor(private route: ActivatedRoute,public authService: SignService

    ) {}

    ngOnInit(): void {
   
    
      this.route.params.subscribe(params => {
      
      
      });
      }




     



  onLogoutClick() {
    this.authService.logout();
  }
}