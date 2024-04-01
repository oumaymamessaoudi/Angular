import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import axios from 'axios';
import { latLng, MapOptions, marker, tileLayer } from 'leaflet';
import { ActivatedRoute } from '@angular/router';
import { SignService } from '../../Auth+shop/Services/sign.service';



interface Ambulance {
  ambulanceID?: number;
  location: string;
  status: string;
  latitude: number;
  longitude: number;
  imageAmbul: string;
}

@Component({
  selector: 'app-affiche-ambulance',
  templateUrl: './affiche-ambulance.component.html',
  styleUrls: ['./affiche-ambulance.component.css']
})
export class AfficheAmbulanceComponent implements OnInit {
  ambulances: Ambulance[] = [];
  filteredAmbulances: Ambulance[] = [];
  map: any;
  selectedStatus: string = '';
  imageBaseUrl: string = 'http://localhost:80/nadhirPI/';
  currentLocationMarker: any;
  relativeId: any;

  constructor(private http: HttpClient,private route: ActivatedRoute,public authService: SignService
    ) { }
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
  }

  initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
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
      html: `<img src="${this.imageBaseUrl}${ambulance.imageAmbul}" alt="ambulance" style="width: 100%; height: 100%;">`    });

    const popupContent = document.createElement('div');
    popupContent.innerHTML = `
      <b>${ambulance.location}</b><br>
      Status: ${ambulance.status}<br>
      <button id="callButton${ambulance.ambulanceID}">Appeler</button>
    `;

    const callButton = popupContent.querySelector(`#callButton${ambulance.ambulanceID}`);    if (callButton) {
      callButton.addEventListener('click', () => {
        this.callAmbulance(ambulance.ambulanceID);
      });
    }

    L.marker([ambulance.latitude, ambulance.longitude], { icon: customMarker })
      .addTo(this.map)
      .bindPopup(popupContent);
  });
}



// Fonction pour appeler l'ambulance
callAmbulance(ambulanceId: number | undefined): void {
  if (ambulanceId !== undefined) {
    this.http.put<any>(`http://localhost:8081/ambulance/${this.relativeId}/update-etats`, {})        .subscribe(
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
  
  getAmbulances(): void {
    this.http.get<any[]>("http://localhost:8081/ambulance/affiche")
      .subscribe(
        (data) => {
          console.log(data); // Vérifiez les données reçues dans la console
          this.ambulances = data;
          this.filteredAmbulances = this.ambulances; // Mettez à jour la liste filtrée
          this.updateMapMarkers(); // Mettez à jour les marqueurs sur la carte
        },
        (error) => {
          console.error(error);
        }
      );
  }

  addCurrentLocationMarker(latitude: number, longitude: number): void {
    this.currentLocationMarker = L.marker([latitude, longitude]).addTo(this.map);
    this.currentLocationMarker.bindPopup('Position de Tunis').openPopup();
  }

  async calculateShortestRouteToAmbulance(): Promise<void> {
    try {
      const response = await this.http.get<any>
      (`http://localhost:8081/ambulance/elderly/${this.relativeId}`).toPromise();  
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
          console.error(`Coordonnées invalides pour l'ambulance ${ambulance.location}`);        }
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
}