import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-get-all-ambulance',
  templateUrl: './get-all-ambulance.component.html',
  styleUrls: ['./get-all-ambulance.component.css']
})
export class GetAllAmbulanceComponent  implements OnInit {

  ambulances: any[] = [];
  imageBaseUrl: string = 'http://localhost:80/nadhirPI/'; // Mettez ici l'URL de base où vos images sont stockées sur le serveur

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAmbulances();    
  }

  getAmbulances(): void {
    this.http.get<any[]>("http://localhost:8081/ambulance/affiche")
      .subscribe(
        (data) => {
          console.log(data); // Vérifiez les données reçues dans la console
          this.ambulances = data;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  archiveAmbulance(ambulanceID: number) {
    axios.put(`http://localhost:8081/ambulance/archive/${ambulanceID}`)
    .then(res => {
      console.log("Ambulance archivée avec succès");
      // Optionnel: Mettre à jour la liste des ambulances après l'archivage
      this.getAmbulances();
    })
    .catch(err => {
      console.log("Erreur lors de l'archivage de l'ambulance :", err);
    });
  }

  readText(text: string): void {
    const speechSynthesis = window.speechSynthesis;
    const speechText = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(speechText);
  }
}

