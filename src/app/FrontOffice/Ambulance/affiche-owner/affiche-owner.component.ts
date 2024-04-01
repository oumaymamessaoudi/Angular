import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-affiche-owner',
  templateUrl: './affiche-owner.component.html',
  styleUrls: ['./affiche-owner.component.css']
})
export class AfficheOwnerComponent implements OnInit {
  relatives: any[] = [];
  alertMessages: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchRelatives();
  }

  fetchRelatives() {
    this.http.get<any[]>('http://localhost:8081/ambulance/relatives/etats')
      .subscribe(relatives => {
        this.relatives = relatives.map(relative => ({ ...relative, dismissed: false }));
        this.generateAlertMessages();
      });
  }

  generateAlertMessages() {
    this.alertMessages = this.relatives.map(relative => {
      const ambulanceID = relative.elderly.ambulance.ambulanceID; // Obtenez l'ID de l'ambulance
      return `${relative.firstName} a appelé une ambulance pour ${relative.elderly.firstName}`;    });
  }

  toggleAmbulanceStatus(index: number) {
    // Logique pour changer le statut de l'ambulance
  }

  removeNotification(index: number): void {
    this.relatives[index].dismissed = true;
  }
}