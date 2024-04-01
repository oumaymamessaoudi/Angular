import { Component } from '@angular/core';
import { SignService } from '../../Auth+shop/Services/sign.service';
import { UpdateUserService } from '../../Auth+shop/Services/update-user.service';

@Component({
  selector: 'app-header-front-oumayma',
  templateUrl: './header-front-oumayma.component.html',
  styleUrls: ['./header-front-oumayma.component.css']
})
export class HeaderFrontOumaymaComponent {
  constructor(public authService: SignService,private updateUserService:UpdateUserService) {}

  onLogoutClick() {
    this.authService.logout();
  }
}
