import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignService } from '../Services/sign.service';

@Component({
  selector: 'app-nurse',
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.css']
})
export class NurseComponent {
  constructor(private route: ActivatedRoute,public authService: SignService
    ) {}

    ngOnInit(): void {
   
    
      this.route.params.subscribe(params => {
        
        
      });
      }
}