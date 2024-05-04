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
}