import { Component, OnInit } from '@angular/core';
import { RoleStatisticsService } from '../Services/role-statistics.service';

@Component({
  selector: 'app-role-statistics',
  templateUrl: './role-statistics.component.html',
  styleUrls: ['./role-statistics.component.css']
})
export class RoleStatisticsComponent implements OnInit {
  roleStatistics: any;
  percentageData: number[] = [80, 60, 40, 20]; // Exemple de données de pourcentage


  constructor(private roleStatisticsService: RoleStatisticsService) { }

  ngOnInit(): void {
    this.getRoleStatistics();
  }

  getRoleStatistics(): void {
    this.roleStatisticsService.getRoleStatistics()
      .subscribe(
        data => {
          this.roleStatistics = data;
          console.log(this.roleStatistics); // Affichage des données récupérées dans la console
        },
        error => {
          console.log(error);
        }
      );
  }

  
}
