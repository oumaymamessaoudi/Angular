import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-driver-nadhir',
  templateUrl: './driver-nadhir.component.html',
  styleUrls: ['./driver-nadhir.component.css']
})
export class DriverNadhirComponent {

  ambulanceDriver: any; // Définissez une interface ou un type pour les données du conducteur d'ambulance si possible

    @ViewChild('fileInput') fileInput: ElementRef;
    capturedImage: string | ArrayBuffer | null;

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.getAmbulanceDriver();
    }

    getAmbulanceDriver(): void {
        const id = this.route.snapshot.paramMap.get('id'); // Récupérer l'ID du conducteur d'ambulance à partir de l'URL
        if (id) {
            const apiUrl = `http://localhost:8081/ambulance/driver/aff/${id}`;
            this.http.get(apiUrl).subscribe(
                (data) => {
                    this.ambulanceDriver = data;
                },
                (error) => {
                    console.error('Une erreur s\'est produite :', error);
                }
            );
        } else {
            console.error('ID du conducteur d\'ambulance introuvable dans l\'URL');
        }
    }

    openCamera(): void {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
              const video = document.createElement('video');
              video.srcObject = stream;
              video.onloadedmetadata = () => {
                  const canvas = document.createElement('canvas');
                  canvas.width = video.videoWidth;
                  canvas.height = video.videoHeight;
                  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                  const imageData = canvas.toDataURL('image/png');
                  this.capturedImage = imageData;
                  stream.getTracks().forEach(track => track.stop());
                  
                  // Appeler l'API pour mettre à jour onDuty
                  const driverId = this.route.snapshot.paramMap.get('id');
                  if (driverId) {
                      this.updateOnDuty(driverId);
                  } else {
                      console.error('ID du conducteur d\'ambulance introuvable dans l\'URL');
                  }
              };
              video.play();
          }).catch(error => {
              console.error('Une erreur s\'est produite lors de l\'accès à la caméra :', error);
          });
      } else {
          console.error('Votre navigateur ne supporte pas l\'accès à la caméra.');
      }
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.capturedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  captureAndDownloadPDF(): void {
    const pdf = new jsPDF();
    const imgWidth = 60; // Taille réduite de l'image
    const imgHeight = 45; // Taille réduite de l'image
    const positionX = 15; // Position X de l'image
    const positionY = 20; // Position Y de l'image
    const middleX = 105; // Position X pour les attributs en gras
    let middleY = 60; // Position Y pour les attributs en gras (début)
  
    // Fond coloré
    pdf.setFillColor(200, 200, 200);
    pdf.rect(0, 0, 210, 297, 'F');
  
    // Styles de texte pour les attributs en gras
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
  
    if (this.ambulanceDriver) {
      // Affichage de l'image réduite en haut à gauche
      pdf.addImage(this.capturedImage as string, 'PNG', positionX, positionY, imgWidth, imgHeight);
  
      // Affichage des attributs du conducteur
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Prénom: ${this.ambulanceDriver.firstName}`, middleX, middleY);
      middleY += 10;
      pdf.text(`Nom: ${this.ambulanceDriver.lastName}`, middleX, middleY);
      middleY += 10;
      pdf.text(`Email: ${this.ambulanceDriver.email}`, middleX, middleY);
      middleY += 10;
      pdf.text(`Date de naissance: ${this.ambulanceDriver.dateOfBirth}`, middleX, middleY);
      middleY += 10;
      pdf.text(`Salaire: ${this.ambulanceDriver.totalForDriver}`, middleX, middleY);
      middleY += 20; // Augmenter l'espace entre les sections
  
      // Affichage des attributs de l'ambulance
      pdf.setFont('helvetica', 'bold');
      pdf.text('Informations de l\'ambulance:', middleX, middleY);
      middleY += 10;
      pdf.text(`ID de l'ambulance: ${this.ambulanceDriver.ambulance.ambulanceID}`, middleX, middleY);
      middleY += 10;
      pdf.text(`Emplacement: ${this.ambulanceDriver.ambulance.location}`, middleX, middleY);
      middleY += 10;
      pdf.text(`Statut: ${this.ambulanceDriver.ambulance.status}`, middleX, middleY);
    }
  
    pdf.save('ambulance_driver_details.pdf');
  
    // Appeler l'API pour réinitialiser le totalForDriver
    const driverId = this.route.snapshot.paramMap.get('id');
    if (driverId) {
      this.resetTotalForDriver(driverId);
    } else {
      console.error('ID du conducteur d\'ambulance introuvable dans l\'URL');
    }
  }
  
  resetTotalForDriver(driverId: string): void {
    const apiUrl = `http://localhost:8081/ambulance/resetTotalForDriver/${driverId}`;
    this.http.post(apiUrl, {}).subscribe(
      () => {
        console.log('TotalForDriver réinitialisé avec succès.');
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la réinitialisation de TotalForDriver :', error);
      }
    );
  }
  updateOnDuty(driverId: string): void {
    const apiUrl = `http://localhost:8081/ambulance/${driverId}/update-on-duty`;
    this.http.put(apiUrl, {}).subscribe(
        () => {
            console.log('État onDuty mis à jour avec succès.');
        },
        (error) => {
            console.error('Une erreur s\'est produite lors de la mise à jour de l\'état onDuty :', error);
        }
    );
}
  }
