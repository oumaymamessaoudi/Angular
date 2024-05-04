// elderly-nadhir.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-elderly-nadhir',
  templateUrl: './elderly-nadhir.component.html',
  styleUrls: ['./elderly-nadhir.component.css']
})
export class ElderlyNadhirComponent implements OnInit {
  videoSrc: string;
  drowsinessStatus: string;
  totalAverageEAR: number;
  elderlyId : any;
  constructor(private http: HttpClient,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.videoSrc = 'http://127.0.0.1:5000/video_feed';
    this.getDrowsinessStatus();
    this.route.params.subscribe(params => {
      this.elderlyId = params['elderlyId']; // Utilisez this.relativeId au lieu de relativeId
      // Utilisez this.relativeId comme nécessaire dans votre composant
      console.log('Relative ID:', this.elderlyId);
    });
  }

  getDrowsinessStatus() {
    this.http.get<any>('http://127.0.0.1:5000/drowsiness_status').subscribe(
      (data) => {
        this.drowsinessStatus = data.result;
        this.totalAverageEAR = data.total_average_ear; // Récupère la moyenne totale de l'EAR
        // Réexécuter la vérification après une certaine période si l'analyse n'est pas terminée
        if (this.drowsinessStatus === 'Analysis in progress') {
          setTimeout(() => this.getDrowsinessStatus(), 5000); // Vérifier toutes les 5 secondes
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  sendDrowsinessStatus() {
    // Déterminez la valeur de drowsinessStatus en fonction de la condition
  
    // Mappez drowsinessStatus sur un format lisible par l'homme
    const humanReadableStatus = this.drowsinessStatus === "Not Drowsy" ? "Not Drowsy" : "Drowsy";
  
    // Créez l'objet de requête avec la valeur mise à jour de drowsinessStatus
    const requestBody = {
      drowsinessStatus: humanReadableStatus
    };
    console.log(requestBody);
  
    // Envoyez la requête HTTP avec l'objet de requête correctement défini
    this.http.patch<any>(`http://localhost:8081/ambulance/${this.elderlyId}/tracking`, requestBody).subscribe(
      (response) => {
        console.log(requestBody);
        console.log('Response:', response);
        // Gérez la réponse de l'API en conséquence
      },
      (error) => {
        console.error('Error:', error);
        // Gérez l'erreur en conséquence
      }   
    );
  }
  
  

}
