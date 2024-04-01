import { Component, OnInit, ViewChild } from '@angular/core';
 import { DoctorProfileService } from '../../services2/doctor-profile.service';
import { Elderly } from '../../entities/elderly.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor } from '../../entities/doctor.model';
import { ReviewService } from '../../services2/review.service';
import { Chart } from 'chart.js';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImagePopupComponent } from '../image-popup/image-popup.component';
import { SignService } from '../../Auth+shop/Services/sign.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit
 {@ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>; // ViewChild for file input
 selectedFiles: File[] = [];

  doctorReviews: any[] = []; // Assuming doctorReviews is an array to store reviews

  doctorId: number;
  doctor: Doctor;
 patients: Elderly[] = [];
 filteredPatients: any[] = []; // Array to hold filtered patients
 searchItems: string = ''; // Property to hold search input value
 averageRating: number;
 calendarId: number | null;

 selectedFile: File | null = null; // Property to hold the selected file




  constructor(private route: ActivatedRoute,public authService: SignService,
    private doctorprofileService: DoctorProfileService ,
    private router: Router,  private dialog: MatDialog ,// Inject MatDialog for opening the popup

     private reviewService:ReviewService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.doctorId = +params['id']; // Extract doctor ID from URL
      this.loadDoctor();
      this.loadPatients();
      this.fetchDoctorReviews(this.doctorId);
      this.calculateAverageRating(this.doctorId);
      this.getCalendarId();
      this.loadCabinetPictures();


    });
  }
  getCalendarId(): void {
    this.doctorId ; // Set the doctor ID here (or fetch it from somewhere)
    this.doctorprofileService.getCalendarIdByDoctorId(this.doctorId).subscribe(
      (calendarId: number) => {
        this.calendarId = calendarId;
      },
      (error) => {
        console.error('Error fetching calendar ID:', error);
      }
    );
  }

  goToDoctorCalendar(): void {
 
    if (this.doctorId  ) {
      this.doctorprofileService.getCalendarIdByDoctorId(this.doctorId).subscribe(
        (calendarId: number) => {
          this.router.navigate(['/calendarDoctor', this.doctorId], {
            queryParams: { calendarId: calendarId },
          });
        },
        (error) => {
          console.error('Error fetching calendarId:', error);
        }
      );
    }}



    loadDoctor() {
      this.doctorprofileService.getDoctorProfile(this.doctorId).subscribe(
        (data: any) => {
          this.doctor = data;
     
          // Check if the doctor's imagedoc URL exists and is not null
          if (this.doctor.imagedoc && !this.doctor.imagedoc.includes('null')) {
            const filename = this.doctor.imagedoc.split('\\').pop(); // Get the filename from the URL
            this.doctor.imagedoc = `assets/FrontOffice/images/${filename}`; // Construct the relative path
          }
        }
      );
    }

  loadPatients() {
    this.doctorprofileService.getPatientsByDoctorId(this.doctorId).subscribe(
      (patients: Elderly[]) => {
        this.patients = patients;
      },
      (error) => {
        console.error('Error fetching patients:', error);
      }
    );
  }
  
  initializePatients() {
    // Initialize patients array with data (e.g., from a service)
    // Example data initialization:
    
    // Initially, set filteredPatients to the full list of patients
    this.filteredPatients = this.patients;
  }

  filterPatients() {
    this.filteredPatients = this.patients.filter(patient =>
      patient.username.toLowerCase().includes(this.searchItems.toLowerCase())
    );
  }

  fetchDoctorReviews(doctorId: number): void {
    this.reviewService.getDoctorReviews(doctorId).subscribe(
      (response: any) => {
        this.doctorReviews = response; 
      },
      (error: any) => {
        console.error('Error fetching doctor reviews:', error);
      }
    );
  }

  calculateAverageRating(doctorId: number): void {
    this.doctorprofileService.getAverageRatingForDoctor(doctorId).subscribe(
        (averageRating: number) => {
            this.averageRating = averageRating;
        },
        (error) => {
            console.error('Error calculating average rating:', error);
        }
    );
}

/*

onFileSelected(event: any): void {
  if (event.target.files && event.target.files.length > 0) {
    this.selectedFile = event.target.files[0]; // Store the selected file
  }
}

uploadDoctorImage(): void {
  if (!this.selectedFile) {
    console.error('No file selected for upload.');
    return;
  }

  const doctorId = this.doctorId; // Get the doctor ID from the component property
  if (!doctorId) {
    console.error('Doctor ID not available.');
    return;
  }

  this.doctorprofileService.uploadDoctorImage(doctorId, this.selectedFile).subscribe(
    (response: any) => {
      console.log('Image uploaded successfully');
      // You can update the doctor's profile image display here if needed
    },
    (error: any) => {
      console.error('Error uploading image:', error);
      // Handle error as needed
    }
  );*/
  onFileSelected(event: any) {
    // Handle file selection if needed
}

uploadProfilePicture() {
    const files: FileList | null = this.fileInput.nativeElement.files; // Get selected files from the file input element
    if (files && files.length > 0) {
        const filesArray: File[] = Array.from(files); // Convert FileList to array
        this.doctorprofileService.uploadDoctorImage(this.doctorId, filesArray).subscribe(
            (response) => {
                console.log('Upload successful:', response);
                // Handle success (e.g., show a success message)
                window.location.reload(); // Reload the window after successful upload

              },
            (error) => {
                console.error('Upload error:', error);
                // Handle error (e.g., show an error message)
            }
        );
    }
}

uploadCabinetPictures(files: FileList): void {
  if (files.length > 0) {
    this.doctorprofileService.uploadCabinetPictures(this.doctorId, Array.from(files)).subscribe(
      (response) => {
        window.location.reload(); // Reload the window after successful upload

        console.log('Cabinet pictures uploaded successfully:', response);
        // Handle successful upload
    
      },
      (error) => {
        console.error('Error uploading cabinet pictures:', error);
        // Handle error
      }
    );
  }}
  selectedImageUrl: string = '';
  onFileSelected2(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.selectedFiles = Array.from(files);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result;
      };
    }
  }

  cabinetPictures: string[] = [];


  loadCabinetPictures(): void {
    this.doctorprofileService.getCabinetPicturesByDoctorId(this.doctorId)
      .subscribe(pictures => {
        this.cabinetPictures = pictures.map(url => {
          const filename = url.split('/').pop(); // Get the filename from the URL
          return `assets/FrontOffice/images/${filename}`; // Construct the relative path
        });
        console.log('Cabinet Pictures:', this.cabinetPictures); // Log the modified URLs
      });
  }
  openImagePopup(index: number): void {
    const dialogRef = this.dialog.open(ImagePopupComponent, {
      data: {
        images: this.cabinetPictures,
        currentIndex: index
      }
    });
  }
  deleteCabinetPictures(doctorId: number): void {
    const confirmation = window.confirm('Are you sure you want to delete all cabinet pictures?');
    if (confirmation) {
      this.doctorprofileService.deleteCabinetPictures(doctorId)
        .subscribe(response => {
          console.log('Cabinet pictures deleted:', response);
          // Handle any further actions after successful deletion
        }, error => {
          console.error('Delete cabinet pictures error:', error);
          // Handle error scenarios
        });
        window.location.reload(); // Reload the window after successful deletion

    }
  }
  
}