// map-popup.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.css']
})
export class MapPopupComponent implements OnInit {
  @Input() doctor: any;
  map: L.Map | undefined;
  @Output() close: EventEmitter<void> = new EventEmitter<void>(); // Event emitter to notify parent component

  constructor() { }

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    // Initialize the map and set its options
    this.map = L.map('map').setView([this.doctor.doctorLatitude, this.doctor.doctorLongitude], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Add a marker for the doctor's position
    L.marker([this.doctor.doctorLatitude, this.doctor.doctorLongitude]).addTo(this.map)
      .bindPopup(`<b>${this.doctor.username}</b><br>${this.doctor.doctorAddress}`)
      .openPopup();
  }

  closeMapPopup(): void {
    // Close the map popup
    this.close.emit();
  }
}
