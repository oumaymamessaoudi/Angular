// map-display.component.ts
import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})
export class MapDisplayComponent implements OnInit {
  map: L.Map | undefined;
   @Input() doctors: any[] = []; // Input property to receive the doctors data
   @Input() nearbyDoctors: any[] = []; // Input property to receive nearby doctors data

  constructor() { }

  ngOnInit(): void {
    this.initMap(); 
  }

  initMap(): void {
    // Initialize the map and set its options
    this.map = L.map('map').setView([34.0479, 9.8076], 7); // Centered on Tunisia with zoom level 7

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Add markers for each doctor
    this.nearbyDoctors.forEach(doctor => {
      L.marker([doctor.doctorLatitude, doctor.doctorLongitude]).addTo(this.map)
        .bindPopup(`<b>${doctor.username}</b><br>${doctor.doctorAddress}`)
        .openPopup();
    });
  }
}
