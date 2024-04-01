import { Component } from '@angular/core';
import { AuthService } from '../../Auth+shop/Services/AuthService';
import { SignService } from '../../Auth+shop/Services/sign.service';

@Component({
  selector: 'app-header-template-nadhir',
  templateUrl: './header-template-nadhir.component.html',
  styleUrls: ['./header-template-nadhir.component.css']
})
export class HeaderTemplateNadhirComponent {
  constructor( public authService: SignService){}



  onLogoutClick() {
    this.authService.logout();
  }
  
}
