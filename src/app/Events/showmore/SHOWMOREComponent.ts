import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-routing-machine'; // Import leaflet-routing-machine
import { EventService } from '../event.service';
import { Event as EventModel } from '../../eventmodel/event.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-showmore',
  templateUrl: './showmore.component.html',
  styleUrls: ['./showmore.component.css']
})
export class SHOWMOREComponent implements OnInit {
  map: L.Map;
  eventId: number;
  event: EventModel;

  constructor(private route: ActivatedRoute, private eventService: EventService, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = +params['idevent'];
      this.fetchEventDetailsAndMarkPlace();
    });
  }

  initializeMap(latitude: number, longitude: number) {
    this.map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  fetchEventDetailsAndMarkPlace() {
    this.eventService.getEventById(this.eventId).subscribe((event: any) => {
      this.event = event;
      if (event && event.latitude && event.longitude) {
        const latitude = event.latitude;
        const longitude = event.longitude;
        this.initializeMap(latitude, longitude);
        this.addMarker(latitude, longitude);

        this.map.locate({ setView: true, maxZoom: 16 });
        this.map.on('locationfound', (e) => {
          const elderlyLatitude = e.latlng.lat;
          const elderlyLongitude = e.latlng.lng;
          this.addElderlyMarker(elderlyLatitude, elderlyLongitude);
          this.addRouteDirection([latitude, longitude], [elderlyLatitude, elderlyLongitude]); // Add route direction

          // Fetch weather information
          this.fetchWeatherInformation(latitude, longitude);
        });

      } else {
        console.error('Event not found or location data missing');
      }
    });
  }

  addMarker(latitude: number, longitude: number) {
    L.marker([latitude, longitude]).addTo(this.map);
  }

  addElderlyMarker(latitude: number, longitude: number) {
    L.marker([latitude, longitude], { icon: this.getElderlyIcon() }).addTo(this.map);
  }

  getElderlyIcon() {
    return L.icon({
      iconUrl: 'path/to/elderly-icon.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }

  addRouteDirection(start: [number, number], end: [number, number]) {
    const routingControlOptions: L.Routing.RoutingControlOptions = {
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      lineOptions: {
        styles: [{ color: '#007bff', opacity: 0.7, weight: 5 }]
      } as L.Routing.LineOptions, // Type assertion
      routeWhileDragging: true, // Keep the route line displayed while dragging
      show: false // Hide textual instructions
    };
    const control = L.Routing.control(routingControlOptions).addTo(this.map);
  // Hide textual instructions element
    const instructionsElement = document.querySelector('.leaflet-routing-container') as HTMLElement;
    if (instructionsElement) {
      instructionsElement.style.display = 'none';
    }
  }

  fetchWeatherInformation(latitude: number, longitude: number) {
    const apiKey = '1b1d98a8cb3744668171d0daff501d85'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    this.http.get(url).subscribe((weatherData: any) => {
      console.log('Weather information:', weatherData);
      this.displayWeatherInformation(weatherData);
    });
  }

  displayWeatherInformation(weatherData: any) {
    const weatherInfoElement = document.createElement('div');
    weatherInfoElement.className = 'weather-info';
    weatherInfoElement.innerHTML = `
      <h3>${weatherData.name}</h3>
      <p>Temperature: ${weatherData.main.temp}°C</p>
      <p>Feels like: ${weatherData.main.feels_like}°C</p>
      <p>Humidity: ${weatherData.main.humidity}%</p>
      <p>Wind speed: ${weatherData.wind.speed} m/s</p>
    `;
  
    const eventDetailsElement = document.querySelector('.event-details') as HTMLElement;
    if (eventDetailsElement) {
      eventDetailsElement.insertBefore(weatherInfoElement, eventDetailsElement.firstChild);
    }
  }
  
}