import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { TrackingService } from '../Services/tracking.service';
import { ReverseGeocodingService } from '../Services/reverse-geocoding.service';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SmsService } from '../Services/sms.service';
import 'leaflet-routing-machine';


@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})

export class TrackingComponent implements OnInit {

  elderlyId: number;
  map: any;
  destinationConfirmed: boolean = false;
  destinationMarker: any;
  destinationLat: number;
  destinationLng: number;
  destinationAddress: string;
  initialLat: number;
  initialLng: number;
  initialAddress: string;
  customIcon: any; 
  weatherData:any;
  durations: number[][] = [];
  destinations: any[] = [];
  duration: string;
  doubleDurationInSeconds : number;
  distance: number;
  selectedProfile: string = 'driving-car'; 
  relativePhoneNumber : string;
  trackingId: number; 
  
  selectedActivity: string; // Property to store the selected activity

  // Durations for each activity (in seconds)
  activityDurations = {
    grocery: 300, 
    shopping: 1200, 
    friend: 1800, // 15 minutes added for visiting a friend
    doctor: 1800, // 30 minutes added for doctor appointment
    exercise: 1200 // 20 minutes added for exercise
  };


  // Add a property to store the route instructions
routeInstructions: string[] = [];
destinationMarkerClicked: boolean = false;


  constructor(
    private reverseGeocodingService: ReverseGeocodingService,
    private trackingService: TrackingService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private smsService : SmsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.elderlyId = +params['id'];
      console.log('Elderly ID:', this.elderlyId); 
    });

    this.trackingService.getTracking(this.elderlyId).subscribe(trackingId => {
      if (trackingId) {
        console.log('Tracking ID:', trackingId);
        this.trackingId = trackingId; 
      } else {
        console.log('No tracking ID found for elderly ID:', this.elderlyId);
      }
    });
    this.fetchRelativePhoneNumber();
    this.initMap();

    this.getCurrentLocation();
    this.initCustomIcon(); 
    this.showElderlyLocation();
  }

  initMap(): void {
    const mapInitPromise = new Promise<void>((resolve, reject) => {
      // Initialize the map with the initial view using IP geolocation
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
  
        // Create the map and resolve the promise once it's ready
        this.map = L.map('map').setView([latitude, longitude], 13);
  
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
  
        this.map.on('click', this.onMapClick.bind(this));
  
        resolve(); // Resolve the promise to indicate map initialization is complete
      }, (error) => {
        reject(error); // Reject the promise if there's an error getting the current position
      });
    });
  
    // Once the map is initialized, proceed with other operations
    mapInitPromise.then(() => {
      this.fetchRelativePhoneNumber();
      this.getCurrentLocation();
      this.initCustomIcon();
      this.showElderlyLocation();
    }).catch((error) => {
      console.error('Error initializing map:', error);
    });
  }
  





  fetchRelativePhoneNumber(): void {
    this.trackingService.getRelativePhoneNumberbyElderlyId(this.elderlyId).subscribe(
      phoneNumber => {
        this.relativePhoneNumber = phoneNumber;
      },
      error => {
        console.error('Error fetching relative phone number:', error);
      }
    );
  }
  initCustomIcon(): void {
    this.customIcon = L.icon({
      iconUrl: 'assets/mariem/marker-icon.png',
      iconRetinaUrl: 'assets/mariem/marker-icon-2x.png',
      shadowUrl: 'assets/mariem/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
  }

  getCurrentLocation(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.initialLat = position.coords.latitude;
      this.initialLng = position.coords.longitude;
      
      this.reverseGeocodingService.reverseGeocode(this.initialLat, this.initialLng).subscribe((response) => {
        this.initialAddress = response.display_name;
      }, (error) => {
        console.error('Reverse geocoding error:', error);
      });
    }, (error) => {
      console.error('Error getting current location:', error);
    });
  }




  showElderlyLocation(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const elderlyIcon = L.icon({
        iconUrl: 'assets/mariem/elderly.png', 
        iconSize: [40, 65], 
        popupAnchor: [1, -34], 
        tooltipAnchor: [16, -28],
        shadowUrl: 'assets/mariem/marker-shadow.png',
        shadowSize: [41, 41] 
      });

      L.marker([latitude, longitude], { icon: elderlyIcon }).addTo(this.map);
    });
  }



  onMapClick(e: any): void {
    if (e && e.latlng) { 
      const latitude = e.latlng.lat;
      const longitude = e.latlng.lng;
      if (this.destinationMarker) {
        this.map.removeLayer(this.destinationMarker);
      }
      this.destinationMarker = L.marker([latitude, longitude], { icon: this.customIcon }).addTo(this.map);

      this.destinationMarker.bindPopup('Click for Route Instructions').openPopup();

      this.destinationLat = latitude;
      this.destinationLng = longitude;
      this.destinationConfirmed = true;
      this.reverseGeocodingService.reverseGeocode(latitude, longitude).subscribe((response) => {
        this.destinationAddress = response.display_name;
      }, (error) => {
        console.error('Reverse geocoding error:', error);
      });
      this.fetchRoute(this.initialLat, this.initialLng, latitude, longitude);
   this.destinationMarker.on('click', () => {
    this.destinationMarkerClicked = true;

    console.log('Destination marker clicked'); // Debugging statement
    this.fetchRouteInstructions(this.initialLat, this.initialLng, latitude, longitude);
});
    }
  }

  fetchRouteInstructions(startLat: number, startLng: number, endLat: number, endLng: number): void {
    console.log('Fetching route instructions...');
    
    // Clear previous route instructions
    this.routeInstructions = [];
  
    const routingControl = L.Routing.control({
        waypoints: [
            L.latLng(startLat, startLng), // Starting point
            L.latLng(endLat, endLng) // Destination
        ]
    });
  
    routingControl.on('routesfound', (event: any) => {
        console.log('Routes found:', event.routes);
        const routes = event.routes;
        if (routes && routes.length > 0) {
            const instructions = routes[0].instructions.map((instruction: any) => instruction.text); // Extract text from instruction objects
            this.routeInstructions = instructions; // Store route instructions
        }
    });
  
    // Fetch route instructions without adding them to the map
    routingControl.route();
  }
  
  
  
  

  saveTrackingDataAndStartTimer(): void {


    if (!this.selectedActivity) {
      // If the selected activity is not set, display an alert
      return; // Exit the function early
    }
    const trackingData = {
      latitudeInitial: this.initialLat,
      longitudeInitial: this.initialLng,
      latitudeDest: this.destinationLat,
      longitudeDest: this.destinationLng,
      initial: this.initialAddress,
      destination: this.destinationAddress,
    };
  
    if (this.trackingId) {
      this.trackingService.updateTracking(this.trackingId, trackingData).subscribe(
        (response) => {
          console.log('Tracking data updated successfully:', response);
          this.fetchDistanceAndDuration();
        },
        (error) => {
          console.error('Error updating tracking data:', error);
        }
      );
    } else {
      this.trackingService.saveTracking(this.elderlyId, trackingData).subscribe(
        (response) => {
          console.log('Tracking data saved successfully:', response);
          this.fetchDistanceAndDuration();
        },
        (error) => {
          console.error('Error saving tracking data:', error);
        }
      );
    }
  }
  
  fetchDistanceAndDuration(): void {
    const locations = [
      [this.initialLng, this.initialLat],
      [this.destinationLng, this.destinationLat]
    ];
  
    const requestBody = {
      locations: locations,
      metrics: ["distance", "duration"],
      units: "km"
    };
  
    const url = `https://api.openrouteservice.org/v2/matrix/${this.selectedProfile}`;
    const headers = new HttpHeaders()
      .set('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8')
      .set('Authorization', '5b3ce3597851110001cf624893b932db601b44db8642e407249e40cd')
      .set('Content-Type', 'application/json; charset=utf-8');
  
    this.http.post(url, requestBody, { headers })
      .subscribe(
        (response: any) => {
          console.log('Response:', response);
          const durations = response.durations;
          const distances = response.distances;
  
          // Get the duration in hours and minutes
          const durationHours = Math.floor(durations[0][1] / 3600);
          const durationMinutes = Math.round((durations[0][1] % 3600) / 60);
          this.duration = `${durationHours} hours ${durationMinutes} minutes`;
  
          // Double the duration in seconds and assign it to doubleDurationInSeconds
          this.doubleDurationInSeconds = durations[0][1] * 2;
  
          // Get the distance in kilometers
          this.distance = distances[0][1];
  
          // Start the timer with the total duration
          const totalDuration = this.doubleDurationInSeconds + this.getActivityDurationInSeconds();
          if (totalDuration > 0) {
            this.startTimer(totalDuration);
          } else {
            console.error('Total duration is not set or is zero.');
          }
        },
        (error: any) => {
          console.error('Error:', error);
          alert('An error occurred while fetching distance and duration. Please try again later.');
        }
      );
  }
  
  
  

  getActivityDurationInSeconds(): number {
    // Get the duration for the selected activity (default to 0 if not found)
    const duration = this.activityDurations[this.selectedActivity] || 0;
    return duration;
  }

  startTimer(totalDuration: number): void {
    if (totalDuration) {
      console.log('Starting timer with total duration:', totalDuration);
      const timerInterval = setInterval(() => {
        // Decrement the total duration by 1 second
        totalDuration--;

        // Log remaining time for debugging
        console.log('Remaining time:', totalDuration);

        // Check if total duration has elapsed
        if (totalDuration <= 0) {
          // If total duration has elapsed, stop the timer
          clearInterval(timerInterval);

          // Make the phone call
          console.log('Initiating phone call...');
          this.smsService.phonecall(this.relativePhoneNumber).subscribe(
            (response) => {
              console.log('Phone call initiated successfully:', response);
            },
            (error) => {
              console.error('Error initiating phone call:', error);
            }
          );
        }
      },1000); // Check every second
    } else {
      console.log('Total duration is not set or is zero.');
    }
  }

  
  onActivityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedActivity = target.value;
  }
  
  
  
  
  
  

  

  

  
  
  

  
  fetchRoute(startLat: number, startLng: number, endLat: number, endLng: number): void {
    const apiKey = '5b3ce3597851110001cf624893b932db601b44db8642e407249e40cd';
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startLng},${startLat}&end=${endLng},${endLat}`;

    this.http.get(url).subscribe(
      (response: any) => {
        console.log('Route:', response);
        // Process the response and display the route on the map
        this.displayRoute(response);
      },
      (error: any) => {
        console.error('Error fetching route:', error);
      }
    );
  }

  displayRoute(routeData: any): void {
    if (this.map) {
      // Extract route geometry from routeData and display it on the map
      const routeGeometry = routeData.features[0].geometry;
      L.geoJSON(routeGeometry).addTo(this.map);
    } else {
      console.error('Map is not initialized.');
    }
  }
  
  fetchWeatherData(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const options = {
        method: 'GET',
        url: `https://open-weather13.p.rapidapi.com/city/latlon/${latitude}/${longitude}`,
        headers: {
          'X-RapidAPI-Key': '123cb19f33msh98b71bfa6b5505ep110a25jsna54f08b1e676',
          'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
        }
      };

      axios.request(options)
        .then(response => {
          this.weatherData = response.data;
          console.log('Weather data:', this.weatherData);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
        });
    }, (error) => {
      console.error('Error getting current location:', error);
    });
  }

  convertToCelsius(kelvin: number): number {
    return Math.round(kelvin - 273.15);
  }

}
