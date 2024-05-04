import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrackingDTO } from '../tracking-dto.model';
import { TrackingService } from '../Services/tracking.service';
import { RoamService } from '../Services/roam.service';
import * as L from 'leaflet';
import { Tracking } from '../tracking.model';
import { HttpClient } from '@angular/common/http';
import { SmsService } from '../Services/sms.service';




@Component({
  selector: 'app-relative',
  templateUrl: './relative.component.html',
  styleUrls: ['./relative.component.css']
})
export class RelativeComponent implements OnInit {
  map: any;
  relativeId: number;
  geofenceCreated: boolean = false;
  geofenceLayer: any; // Variable to store the geofence layer
  elderlyName: string; // Declare the elderlyName property

  elderlyMarker: any;
  routeGeometry: any; // Variable to store the route geometry
  geofenceCoordinates: [number, number]; // Assuming it's an array of latitude and longitude
  geofenceRadius: number = 500; // Set the geofence radius to 500 meters
  destinationAddress: string; // Define destinationAddress property
  relativePhoneNumber: string; // Property to store the relative's phone number


  constructor(
    private roamService: RoamService,
    private trackingservice: TrackingService,
    private route: ActivatedRoute,    private http: HttpClient,  private smsService: SmsService 

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.relativeId = params['id'];
  
      this.trackingservice.getElderlyInfoByRelativeId(this.relativeId).subscribe(
        (elderlyName: string) => {
          console.log('Elderly name:', elderlyName);
          this.elderlyName = elderlyName;
            this.trackingservice.getRelativePhoneNumberById(this.relativeId).subscribe(
            (phoneNumber: string) => {
              console.log('Relative phone number:', phoneNumber);
              this.relativePhoneNumber = phoneNumber;
  
              this.initializeMap();
  
              this.fetchRoute();
              this.createGeofenceForRelative(this.relativeId);
            },
            error => {
              console.error('Error fetching relative phone number:', error);
            }
          );
        },
        error => {
          console.error('Error fetching elderly information:', error);
        }
      );
    });
  }
  
  




initializeMap(): void {
    if (!this.map) {
      console.log('Initializing map...');
      this.map = L.map('map').setView([51.505, -0.09], 13); 
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    }
  }



  createGeofenceForRelative(relativeId: number): void {
    this.trackingservice.getTrackingByRelativeId(relativeId).subscribe(
      (tracking: TrackingDTO) => {
        const latitude = tracking.latitudeInitial;
        const longitude = tracking.longitudeInitial;
        const radius = 500;
        const description = 'Geofence around elderly\'s location';
        const tag = 'Elderly';
        const user_ids = [];
        const group_ids = [];
        const coordinates = [latitude, longitude];
        this.map.setView(coordinates, 15);
        this.geofenceCoordinates = [latitude, longitude];
        this.geofenceRadius = radius;
  
        this.roamService.createGeofence(coordinates, radius, description, tag, {}, user_ids, group_ids).subscribe(
          response => {
            console.log('Geofence created successfully:', response);
            this.addGeofenceToMap(coordinates, radius);
          },
          error => {
            console.error('Error creating geofence:', error);
          }
        );
      },
      error => {
        console.error('Error fetching tracking information:', error);
      }
    );
  }


  addGeofenceToMap(coordinates: number[], radius: number): void {
    // Remove existing geofence layer if it exists
    if (this.geofenceLayer) {
      this.map.removeLayer(this.geofenceLayer);
    }
    // Convert coordinates to LatLngExpression
    const latLngCoordinates = L.latLng(coordinates[0], coordinates[1]);
    // Create new geofence layer
    this.geofenceLayer = L.circle(latLngCoordinates, { radius: radius }).addTo(this.map);
  }
  
  fetchRoute(): void {
    // Fetch route from the API dynamically using relative ID
    this.route.params.subscribe(params => {
      const relativeId = params['id'];
      this.trackingservice.getTrackingRelativeByRelativeId(relativeId).subscribe(
        (tracking: Tracking) => {
          console.log('Tracking data:', tracking); // Log tracking data
          const startLat = tracking.latitudeInitial;
          const startLng = tracking.longitudeInitial;
          const endLat = tracking.latitudeDest;
          const endLng = tracking.longitudeDest;
          this.destinationAddress = tracking.destination; // Set the destination address
          const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624893b932db601b44db8642e407249e40cd&start=${startLng},${startLat}&end=${endLng},${endLat}`;
          
          this.http.get(url).subscribe(
            (response: any) => {
              console.log('Route:', response);
              this.displayRoute(response);

              const routeGeometry = response.features[0].geometry;
              const coordinates = routeGeometry.coordinates;
              this.simulateMovementAlongRoute(coordinates);

            },
            (error: any) => {
              console.error('Error fetching route:', error);
            }
          );
        },
        (error: any) => {
          console.error('Error fetching tracking data:', error);
        }
      );
    });
  }
  

  simulateMovementAlongRoute(coordinates: number[][]): void {
    let index = 0;
    let smsSent = false; // Flag to track whether SMS has been sent
    const intervalId = setInterval(() => {
      if (index < coordinates.length) {
        const [lng, lat] = coordinates[index];
        this.updateElderlyMarkerPosition(lat, lng);
        
        // Check if the elderly has left the geofence and SMS has not been sent yet
        if (!smsSent && !this.isWithinGeofence(lat, lng)) {
          const message = `${this.elderlyName} left their geofence headed to ${this.destinationAddress}.`;
          this.sendSms(message); // Send SMS
          smsSent = true; // Update flag to indicate SMS has been sent
        }
        
        index++;
      } else {
        clearInterval(intervalId); 
      }
    }, 1000); 
  }
  


  isWithinGeofence(latitude: number, longitude: number): boolean {
    const geofenceCenterLat = this.geofenceCoordinates[0];
    const geofenceCenterLng = this.geofenceCoordinates[1];
  
    const earthRadius = 6371; // Radius of the Earth in kilometers
  
    // Convert geofence center and elderly coordinates to radians
    const lat1 = this.deg2rad(geofenceCenterLat);
    const lon1 = this.deg2rad(geofenceCenterLng);
    const lat2 = this.deg2rad(latitude);
    const lon2 = this.deg2rad(longitude);
  
    // Calculate differences in coordinates
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
  
    // Haversine formula for distance calculation
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c; // Distance in kilometers
  
  
    const isWithin = distance * 1000 <= this.geofenceRadius; // Convert distance to meters for comparison
  
    return isWithin;
  }
  
  
  
  
  
  
  // Function to convert degrees to radians
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  

  sendSms(message: string): void {
    if (this.relativePhoneNumber) {
      this.smsService.sendSms(this.relativePhoneNumber, message)
        .subscribe((response: any) => {
          console.log('SMS sent successfully:', response);
        }, (error: any) => {
          console.error('Error sending SMS:', error);
        });
    } else {
      console.error('Relative phone number is not available.');
    }
  }

  




  displayRoute(routeData: any): void {
    const routeGeometry = routeData.features[0].geometry;
    L.geoJSON(routeGeometry).addTo(this.map);
  }


  updateElderlyMarkerPosition(lat: number, lng: number): void {
    const customIcon = L.icon({
      iconUrl: 'assets/mariem/elderly.png', 
      iconSize: [40, 65], // Larger size for the icon
      iconAnchor: [16, 16] 
    });

    if (this.elderlyMarker) {
      this.elderlyMarker.setLatLng([lat, lng]);
    } else {
      this.elderlyMarker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    }
  }

}