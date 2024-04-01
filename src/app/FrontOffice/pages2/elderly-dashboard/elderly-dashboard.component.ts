import { Component, OnInit } from '@angular/core';
import { ElderlyDashboardService } from '../../services2/elderly-dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorProfileService } from '../../services2/doctor-profile.service';
import * as L from 'leaflet';
import { Doctor } from '../../entities/doctor.model';

@Component({
  selector: 'app-elderly-dashboard',
  templateUrl: './elderly-dashboard.component.html',
  styleUrls: ['./elderly-dashboard.component.css']
})
export class ElderlyDashboardComponent implements OnInit {
  searchSpecialty: string = '';
  doctors: any[] = [];
  elderlyId: number;
  doctorId!: number;
  showPopupMap: boolean = false; // Flag to control the visibility of the pop-up map
  map: L.Map | undefined;
  selectedDoctor: any; // Declare selectedDoctor property
  showMap: boolean = false; // Flag to control the visibility of the map

  selectedGender: string = '';
  selectedSpecialization: string = '';
  selectedLanguage: string = '';
  selectedCity: string = '';
  specializations: string[] = [
    'Cardiology',
    'Oncology',
    'Pediatrics',
    'Geriatrics',
    'Neurology',
    'Rheumatology',
    'Endocrinology',
    'Pulmonology',
    'Gastroenterology',
    'Nephrology',
    'Ophthalmology',
    'Psychiatry',
    'Urology',
    'Orthopedics',
    'Dermatology',
    'Palliative Care'
  ];
    languages: string[] = ['English', 'French', 'Spanish']; // Example data
    cities: string[] = [
      'Ariana',
      'Beja',
      'Ben Arous',
      'Bizerte',
      'Gabes',
      'Gafsa',
      'Jendouba',
      'Kairouan',
      'Kasserine',
      'Kebili',
      'Kef',
      'Mahdia',
      'Manouba',
      'Medenine',
      'Monastir',
      'Nabeul',
      'Sfax',
      'Sidi Bouzid',
      'Siliana',
      'Sousse',
      'Tataouine',
      'Tozeur',
      'Tunis',
      'Zaghouan'
    ];
    




  constructor(private elderlyService: ElderlyDashboardService,
     private router: Router,
     private route: ActivatedRoute,
     private doctorService: DoctorProfileService,

          ) { }

     ngOnInit(): void {
      // Extract both doctorId and elderlyId from the route parameters
      this.route.params.subscribe(params => {
        this.elderlyId = +params['elderlyId']; // Add this line
        console.log('ngElderly ID:', this.elderlyId);
        this.getDoctors();
        this.searchDoctors();

      });    this.initMap();

    }
   
  searchDoctorsz(): void {
    const criteria: any = {}; // Initialize criteria object

    if (this.selectedGender) {
      criteria.gender = this.selectedGender;
    }
    if (this.selectedSpecialization) {
      criteria.specialization = this.selectedSpecialization;
    }
    if (this.selectedLanguage) {
      criteria.language = this.selectedLanguage;
    }
    if (this.selectedCity) {
      criteria.city = this.selectedCity;
    }



    
    this.elderlyService.filterDoctors(criteria).subscribe(
      (doctors: Doctor[]) => {
        this.doctors = this.mapImageUrls(doctors);         console.log('Filtered Doctors:', doctors);
      },
      (error) => {
        console.error('Error filtering doctors:', error);
      }
    );
  }
   /*
    searchDoctors() {
      this.elderlyService.searchDoctors(this.searchSpecialty).subscribe(
        (data: any[]) => {
          this.doctors = data;
          console.log('Doctors Array:', this.doctors);
        },
        (error) => {
          console.error('Error fetching doctors:', error);
        }
      );
    }*/

    searchDoctors(): void {
      if (this.searchSpecialty.trim() === '') {
        // If search term is empty, fetch all doctors
        this.getDoctors();
      } else {
        // Search doctors based on the search term
        this.elderlyService.searchDoctorsBySpeciality(this.searchSpecialty)
          .subscribe(




            (doctors: any[]) => {
this.doctors = this.mapImageUrls(doctors);             },
            (error) => {
              console.error('Error searching doctors: ', error);
            }
          );
      }
    }
      
  
  navigateToDoctorProfile(doctorId: number) {
   if (typeof doctorId === 'number') {
      console.log('Doctor ID:', doctorId);
  
      const elderlyId = this.elderlyId ;
      console.log('elderly ID:', elderlyId);

      this.router.navigate(['/doctor-profile', doctorId, elderlyId]);
    } else {
      console.error('Invalid Doctor ID:', doctorId);
    }
   }

   private getDoctors() {
    this.elderlyService.getDoctors().subscribe(
      (data: any[]) => {
        this.doctors = this.mapImageUrls(data); // Mapper les URLs des images
        
        console.log(data);
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );
  }
  mapImageUrls(doctors: Doctor[]): Doctor[] {
    return doctors.map(doctor => {
      if (doctor.imagedoc) {
        const filename = doctor.imagedoc.includes('null') ? doctor.imagedoc.split(',').pop().split('\\').pop() : doctor.imagedoc.split('\\').pop(); // Obtenir le nom de fichier à partir de l'URL
        doctor.imagedoc = `assets/FrontOffice/images/${filename}`; // Construire le chemin relatif
      }
      return doctor;
    });
  }
  getImageUrl(fileName: string): string {
    return 'http://localhost:8081/' + fileName;
  }
  private initMap(): void {
    // Set the correct icon paths (if needed)
    const iconRetinaUrl = 'assets/FrontOffice/images/marker-icon-2x.png';
    const iconUrl = 'assets/FrontOffice/images/marker-shadow.png';
    const shadowUrl = 'assets/FrontOffice/images/marker-icon-2x.png';
  
    const defaultIcon = L.icon({
      iconRetinaUrl: iconRetinaUrl,
      iconUrl: iconUrl,
      shadowUrl: shadowUrl,
      iconSize: [41, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [25, 41]
    });
  
    L.Marker.prototype.options.icon = defaultIcon;
  
    // Initialize the map and set its options
    this.map = L.map('mapContainer', {
      center: [39.8282, -98.5795],
      zoom: 3
    });
  
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
  
    tiles.addTo(this.map);
  }
  
  showMapPopup(doctor: any): void {
    // Emit an event to open the map popup
    this.showPopupMap = true;
    this.selectedDoctor = doctor; // Store the selected doctor data

    // Optionally, you can also emit an event to notify the map popup component
  }

  closeMapPopup(): void {
    // Set the flag to hide the map popup
    this.showPopupMap = false;
  }


  showMapWithMarkers(): void {
    // Toggle the map display
    this.showMap = !this.showMap;
  }
    profilepicture: string[] = [];

loadProfilePicture(): void {
  this.doctorService.getProfilePictureByDoctorId(this.doctorId)
    .subscribe(pictures => {
      this.profilepicture = pictures.map(url => {
        const filename = url.split('/').pop(); // Get the filename from the URL
        return `assets/FrontOffice/images/${filename}`; // Construct the relative path
      });
      console.log('profilepicture :', this.profilepicture); // Log the modified URLs
    });
}
}