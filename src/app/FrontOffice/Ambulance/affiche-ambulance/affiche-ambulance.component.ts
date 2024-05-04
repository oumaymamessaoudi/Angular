import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import axios from 'axios';
import { latLng, MapOptions, marker, tileLayer } from 'leaflet';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../ServiceA/web-socket.service';

interface Ambulance {
  ambulanceID?: number;
  location: string;
  status: string;
  latitude: number;
  longitude: number;
  imageAmbul: string;
}
export interface Elderly {
  elderlyID?: number;
  receiveNotifications: boolean;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string; // Vous devrez peut-être utiliser un objet Date pour cette propriété
  address: string;
  gender: string;
  latitude: number;
  longitude: number;
  preferences: string;
  healthRecord: string;
  role: string;
  tracking: string;
  // Vous pouvez également inclure d'autres relations avec d'autres entités si nécessaire
}

@Component({
  selector: 'app-affiche-ambulance',
  templateUrl: './affiche-ambulance.component.html',
  styleUrls: ['./affiche-ambulance.component.css']
})
export class AfficheAmbulanceComponent implements OnInit {
  ambulances: Ambulance[] = [];
  elderlyTracking: string = ''; // Variable pour stocker le contenu de l'attribut "tracking" de l'ancien
  drowsinessStatus: string;
  filteredAmbulances: Ambulance[] = [];
  map: any;
  selectedStatus: string = '';
  imageBaseUrl: string = 'http://localhost:80/nadhirPI/';
  currentLocationMarker: any;
  relativeId: any; // Déclarez la variable relativeId ici

  onsignesPremiersSecours: string[] = [
    "Évaluer la situation et sécuriser la zone : Avant de fournir de l'aide, assurez-vous que la zone est sécurisée pour vous et la victime. Évitez les dangers potentiels tels que le trafic, les objets tranchants ou les zones instables.",
    "Vérifier la respiration : Si la personne est inconsciente, vérifiez si elle respire normalement. Si elle ne respire pas, commencez immédiatement la réanimation cardio-pulmonaire (RCP) en appuyant sur le sternum selon les directives des premiers secours.",
    "Arrêter les saignements : Si la victime saigne abondamment, essayez d'arrêter le saignement en appliquant une pression ferme sur la plaie avec un tissu propre ou un pansement stérile. Élevez la partie blessée si possible pour réduire le flux sanguin.",
    "Maintenir la chaleur corporelle : Si la victime est en état de choc ou en train de perdre de la chaleur corporelle, couvrez-la avec une couverture ou des vêtements pour la garder au chaud. Cela peut aider à prévenir l'hypothermie et à maintenir sa température corporelle."
  ];

  showFirstAidDialog: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private webSocketService: WebSocketService) { }



  ngOnInit(): void {
    this.initMap();
    this.getAmbulancesByLocation();
    this.getCurrentLocation();
    //this.calculateRoutesToAmbulances(); // Calculer les routes vers chaque ambulance
    this.route.params.subscribe(params => {
      this.relativeId = params['relativeId']; // Utilisez this.relativeId au lieu de relativeId
      // Utilisez this.relativeId comme nécessaire dans votre composant
      console.log('Relative ID:', this.relativeId);
    });
      this.getElderlyTracking();

  }

  initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

//track
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }



  getAmbulancesByLocation(): void {
    this.http.get<any[]>("http://localhost:8081/ambulance/affiche")
      .subscribe(
        (data) => {
          console.log(data); // Vérifiez les données reçues dans la console
          this.ambulances = data;
          this.filteredAmbulances = this.ambulances; // Mettez à jour la liste filtrée
          this.updateMapMarkers(); // Mettez à jour les marqueurs sur la carte
          this.calculateShortestRouteToAmbulance(); // Calculer les routes vers chaque ambulance
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // Dans votre composant Angular
  updateMapMarkers(): void {
    this.filteredAmbulances.forEach(ambulance => {
      const customMarker = L.divIcon({
        className: 'ambulance-marker',
        iconSize: [40, 40],
        html: `<img src="${this.imageBaseUrl}${ambulance.imageAmbul}" alt="ambulance" style="width: 100%; height: 100%;">`
      });
  
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <b>${ambulance.location}</b><br>
        Status: ${ambulance.status}<br>
        <button id="callButton${ambulance.ambulanceID}">Appeler</button>
        <button id="firstAidButton${ambulance.ambulanceID}">Premiers secours</button>
      `;
  
      const callButton = popupContent.querySelector(`#callButton${ambulance.ambulanceID.toString()}`);
      if (callButton) {
        callButton.addEventListener('click', () => {
          this.callAmbulance(this.relativeId, ambulance); // Passer l'ID relatif et l'objet Ambulance à callAmbulance
        });
        const firstAidButton = popupContent.querySelector(`#firstAidButton${ambulance.ambulanceID.toString()}`);
        if (firstAidButton) {
          firstAidButton.addEventListener('click', () => {
            this.openFirstAidModal();
          });
        }
      }
  
      L.marker([ambulance.latitude, ambulance.longitude], { icon: customMarker })
        .addTo(this.map)
        .bindPopup(popupContent);
    });
  }
  
  openFirstAidModal(): void {
    const modal = document.getElementById('firstAidModal');
    if (modal) {
      modal.style.display = 'block';
      // Fermer le popup après 5 secondes (5000 millisecondes)
      setTimeout(() => {
        this.closeFirstAidModal();
      }, 5000);
    }
  }

  closeFirstAidModal(): void {
    const modal = document.getElementById('firstAidModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  callAmbulance(relativeId: any, ambulance: Ambulance): void {
    const userId = 123; // ID de l'utilisateur
    const elderlyPosition = { latitude: 36.1234, longitude: 10.5678 }; // Position de l'elderly
  
    if (ambulance.ambulanceID) {
      // Envoyer une requête PUT à l'API pour changer le statut de l'ambulance
      this.http.put<any>(`http://localhost:8081/ambulance/${ambulance.ambulanceID}/toggleStatus`, {})
        .subscribe(
          (data) => {
            console.log('Statut de l\'ambulance changé avec succès :', data);
            // Mettez à jour la liste des ambulances après avoir changé le statut
            this.getAmbulancesByLocation();
            
          },
          (error) => {
            console.error('Erreur lors du changement de statut de l\'ambulance :', error);
          }
        );
    } else {
      console.error('ID de l\'ambulance non défini.');
    }
  }
  

  getCurrentLocation(): void {
    // Remplacer la position actuelle par les coordonnées de Tunis
    const latitude = 36.8065; // Latitude de Tunis
    const longitude = 10.1815; // Longitude de Tunis
    this.addCurrentLocationMarker(latitude, longitude);
  }

  addCurrentLocationMarker(latitude: number, longitude: number): void {
    this.currentLocationMarker = L.marker([latitude, longitude]).addTo(this.map);
    this.currentLocationMarker.bindPopup('Position de Tunis').openPopup();
  }

  async calculateShortestRouteToAmbulance(): Promise<void> {
    try {
      const response = await this.http.get<any>(`http://localhost:8081/ambulance/elderly/${this.relativeId}`).toPromise();

      const elderlyLatitude = response.latitude;
      const elderlyLongitude = response.longitude;

      let minDistance = Number.MAX_VALUE;
      let closestAmbulance: Ambulance | null = null;

      // Itérer sur chaque ambulance pour calculer la distance par rapport à l'elderly
      for (const ambulance of this.ambulances) {
        if (ambulance.latitude && ambulance.longitude) {
          // Calculer la distance entre l'elderly et l'ambulance
          const distance = this.calculateDistance(elderlyLatitude, elderlyLongitude, ambulance.latitude, ambulance.longitude);

          // Mettre à jour la distance minimale et l'ambulance la plus proche
          if (distance < minDistance) {
            minDistance = distance;
            closestAmbulance = ambulance;
          }
        } else {
          console.error(`Coordonnées invalides pour l'ambulance ${ambulance.location}`);
        }
      }

      // Si une ambulance la plus proche a été trouvée, tracer la route
      if (closestAmbulance) {
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62482318af30257b4dae8efd1452bf165e57&start=${elderlyLongitude},${elderlyLatitude}&end=${closestAmbulance.longitude},${closestAmbulance.latitude}`;
        const routeResponse = await axios.get(url);

        if (routeResponse.status === 200) {
          // Obtenir les coordonnées de l'itinéraire
          const routeCoordinates = routeResponse.data.features[0].geometry.coordinates.map((coord: number[]) => L.latLng(coord[1], coord[0]));

          // Tracer la route sur la carte
          L.polyline(routeCoordinates, { color: 'red', weight: 5 }).addTo(this.map);
        } else {
          console.error(`Erreur lors du calcul de l'itinéraire vers l'ambulance la plus proche: ${routeResponse.statusText}`);
        }
      } else {
        console.error('Aucune ambulance valide trouvée.');
      }
    } catch (error) {
      console.error('Erreur lors du calcul de la route vers l\'ambulance la plus proche :', error);
    }
  }


  // Fonction pour calculer la distance entre deux points géographiques (en kilomètres)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  // Fonction utilitaire pour convertir des degrés en radians
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  readText(text: string): void {
    const speechSynthesis = window.speechSynthesis;
    const speechText = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(speechText);
  }

  filterAmbulances(): void {
    if (this.selectedStatus) {
      this.filteredAmbulances = this.ambulances.filter(ambulance => ambulance.status === this.selectedStatus);
    } else {
      this.filteredAmbulances = this.ambulances;
    }
    this.updateMapMarkers();
  }
  getElderlyTracking(): void {
    console.log('Valeur de this.relativeId :', this.relativeId);
  
    // Appel de la première API pour récupérer l'ID de l'ancien en fonction du relativeId
    this.http.get<any>(`http://localhost:8081/ambulance/${this.relativeId}/elderlyId`).subscribe(
      (elderlyIdData) => {
        // Affichage de la réponse de la première API dans la console
        console.log('Réponse de la première API :', elderlyIdData);
  
        // Extraction de l'ID de l'ancien à partir de la réponse de la première API
        console.log('ID de l\'ancien :', elderlyIdData); // Affichage de l'ID de l'ancien dans la console
  
        // Vérification de l'existence de l'ID de l'ancien
        if (elderlyIdData) {
          // Appel de la deuxième API pour récupérer les données de suivi de l'ancien en utilisant l'ID de l'ancien
          this.http.get(`http://localhost:8081/ambulance/${elderlyIdData}/trackingelderly`, { responseType: 'text' })
            .subscribe(
              (data: string) => { // Traitement de la réponse comme une chaîne de caractères
                // Affectation de la réponse à elderlyTracking
                this.elderlyTracking = data;
                console.log('Résultat de l\'API :', data); // Affichage du résultat de la deuxième API dans la console
              },
              (error) => {
                console.error('Erreur lors de la récupération des données de suivi de l\'ancien :', error);
              }
            );
        } else {
          console.error('L\'ID de l\'ancien est indéfini.');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'ID de l\'ancien :', error);
      }
    );
  }
  
  
  }
