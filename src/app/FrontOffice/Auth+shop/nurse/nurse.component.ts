import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nurse',
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.css']
})
export class NurseComponent {
  constructor(private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
   
    
      this.route.params.subscribe(params => {
        
        
      });
      }
}