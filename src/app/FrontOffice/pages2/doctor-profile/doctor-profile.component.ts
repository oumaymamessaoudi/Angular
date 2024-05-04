
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorProfileService } from '../../services2/doctor-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { ImagePopupComponent } from '../image-popup/image-popup.component';
import { Review } from '../../entities/review.model';
import { ReviewService } from '../../services2/review.service';
import { CalendarService } from '../../services2/calendar.service';
import { Appointment } from '../../entities/appointment.model';
import { interval } from 'rxjs';
 import { switchMap } from 'rxjs/operators';
import { SignService } from '../../Auth+shop/Services/sign.service';
import {  Subscription } from 'rxjs';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {
  doctorId!: number;
  doctor: any;
  elderlyId: number; // Add this line
  cabinetPictures: string[] = [];
  newReview: Review = { comment: '', rating: 1 }; // Initialize newReview object
  reviews: Review[] = [];
  completedAppointments: Appointment[] = [];
  showReviewForm = false;
  isFavoriteOfTheMonth: boolean; // Track favorite status
  bannedUntil: Date; // Property to store the banned until date
  remainingTime: string; // Property to store the remaining time string
  remainingTimeSubscription: Subscription; // Subscription for the interval


  averageRating: number;
  totalRatings: number;
  constructor(
    private calendarService: CalendarService,
    private route: ActivatedRoute,
    private doctorService: DoctorProfileService,
    private router: Router // Add Router to constructor
,    private dialog: MatDialog ,// Inject MatDialog for opening the popup
    private reviewService: ReviewService,
    private authService: SignService
  ) { }

  ngOnInit(): void {
    // Extract doctorId from the route parameters
    this.route.params.subscribe(params => {
      this.showReviewForm = false;
  
      this.doctorId = +params['id']; // '+' converts string to number
      this.elderlyId = +params['elderlyId']; // Add this line
 
      this.loadDoctorProfile();
      this.loadCabinetPictures();
      this.fetchDoctorReviews(this.doctorId);
      this.checkCompletedAppointments();
      this.calculateAverageRating(this.doctorId);
      this.getTotalRatings(this.doctorId);
  
      this.doctorService.getElderlyBannedStatus(this.elderlyId).subscribe(
        (bannedStatus: boolean) => {
          if (bannedStatus) {
            this.disableReviewButton(); // Disable the button if banned
            this.updateRemainingTime(); // Start updating the remaining time

          }
        },
        (error) => {
          console.error('Error fetching banned status:', error);
        }
      );
    });
  }
  updateRemainingTime(): void {
    // Fetch the banned until date from the service
    this.doctorService.getElderlyBannedUntil(this.elderlyId).subscribe(
      (bannedUntilDate: Date) => {
        this.bannedUntil = new Date(bannedUntilDate);
        this.remainingTimeSubscription = interval(1000).subscribe(() => {
          this.calculateRemainingTime();
        });
      },
      (error) => {
        console.error('Error fetching banned until date:', error);
      }
    );
  }

  calculateRemainingTime(): void {
    const now = new Date();
    const difference = this.bannedUntil.getTime() - now.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      this.remainingTime = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    } else {
      this.remainingTime = 'Banned period expired';
      this.remainingTimeSubscription.unsubscribe(); // Stop updating when ban expires
    }
  }

  ngOnDestroy(): void {
    if (this.remainingTimeSubscription) {
      this.remainingTimeSubscription.unsubscribe(); // Unsubscribe to avoid memory leaks
    }
  }

  disableReviewButton(): void {
    const reviewButton = document.getElementById('reviewButton') as HTMLButtonElement;
    if (reviewButton) {
      reviewButton.innerText = 'You are banned';
      reviewButton.disabled = true;
    }
  }
  loadDoctorProfile() {
    this.doctorService.getDoctorProfile(this.doctorId).subscribe(
      (data: any) => {
        this.doctor = data;
        this.isFavoriteOfTheMonth = data.favoriteOfTheMonth; // Set favorite status
  
        // Check if the doctor's imagedoc URL exists and is not null
        if (this.doctor.imagedoc && !this.doctor.imagedoc.includes('null')) {
          const filename = this.doctor.imagedoc.split('\\').pop(); // Get the filename from the URL
          this.doctor.imagedoc = `assets/FrontOffice/images/${filename}`; // Construct the relative path
        }
      }
    );
  }

  navigateToDoctorCalendar() {
    if (this.doctorId && this.elderlyId) {
      this.doctorService.getCalendarIdByDoctorId(this.doctorId).subscribe(
        (calendarId: number) => {
          this.router.navigate(['/doctor-calendar', this.doctorId, this.elderlyId], {
            queryParams: { calendarId: calendarId },
          });
        },
        (error) => {
          console.error('Error fetching calendarId:', error);
        }
      );
    }
  }

loadCabinetPictures(): void {
  this.doctorService.getCabinetPicturesByDoctorId(this.doctorId)
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

checkCompletedAppointments(): void {
  this.calendarService.getCompletedAppointmentsByElderlyId(this.elderlyId).subscribe(
    (appointments: Appointment[]) => {
      this.completedAppointments = appointments;
      console.log("commm" , appointments);
    },
    (error) => {
      console.error('Error fetching completed appointments:', error);
    }
  );
}reviewId: number = 0; // Initialize reviewId to a default value

/*

submitReview(reviewId: number): void {
  
  if (this.completedAppointments.length > 0 && this.newReview.comment && this.newReview.rating) {
    const confirmation = window.confirm('Are you sure you want to submit this review?');
    if (confirmation) {
      // Set the doctorId in the newReview object
      this.newReview.doctorId = this.doctorId;
      console.log("set the doctor id", reviewId);

      if (reviewId!=0) {
        console.log("trah id", reviewId);

        // Editing an existing review
        this.doctorService.editReview(reviewId, this.newReview, this.elderlyId).subscribe(
          (updatedReview: Review) => {
            console.log('Review updated:', updatedReview);
            // Reload the reviews or perform any other action
            this.closeReviewForm();
          },
          (error) => {
            console.error('Error updating review:', error);
          }
        );
      } else {
        // Submitting a new review
        this.reviewService.createReview(this.newReview, this.elderlyId, this.doctorId).subscribe(
          (createdReview: Review) => {
            console.log('Review submitted:', createdReview);
            // Reload the reviews or perform any other action
            this.closeReviewForm();
          },
          (error) => {
            console.error('Error submitting review:', error);
          }
        );
      }
    }
  } else {
    if (this.completedAppointments.length === 0) {
      alert('You must have completed appointments with this doctor before submitting a review.');
    } else {
      alert('Please provide both comment and rating.');
    }
  }
}*/



 
openReviewForm(): void {
  this.showReviewForm = true;
  this.showEditForm = false; // Ensure edit form is hidden

}

closeReviewForm(): void {
  this.showReviewForm = false;
  this.newReview = { id: undefined, comment: '', rating: 0 }; // Reset newReview to initial state or empty state

}
fetchDoctorReviews(doctorId: number): void {
  this.reviewService.getDoctorReviews(doctorId).subscribe(
    (reviews: Review[]) => {
      this.reviews = reviews;
      console.log( "aaaaaaaaaaaaa" ,reviews);
    },
    (error) => {
      console.error('Error fetching reviews:', error);
    }
  );
}
// Method to reload doctor reviews after submitting a new review
/*loadDoctorReviews(): void {
  this.reviewService.getDoctorReviews(this.doctorId).subscribe(
    (reviews: Review[]) => {
      // Update the reviews array with the new reviews
      this.reviews = reviews;
    },
    (error) => {
      console.error('Error loading doctor reviews:', error);
    }
  );
}*/


calculateAverageRating(doctorId: number): void {
  this.doctorService.getAverageRatingForDoctor(doctorId).subscribe(
    (rating: number) => {
      this.averageRating = rating;
      console.log('Average Rating:', this.averageRating);
    },
    (error) => {
      console.error('Error fetching average rating:', error);
    }
  );
}

getTotalRatings(doctorId: number): void {
  this.doctorService.getTotalRatingsForDoctor(doctorId).subscribe(
    (total: number) => {
      this.totalRatings = total;
      console.log('Total Ratings:', this.totalRatings);
    },
    (error) => {
      console.error('Error fetching total ratings:', error);
    }
  );
}

filledStars: number;

getStars(): string {
  const roundedRating = Math.round(this.averageRating);
  return '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating);
}

currentElderlyId: number; // Assuming you have a way to get the current user's ID


showOptions: { [key: number]: boolean } = {}; // Object to track visibility of edit/delete options

toggleOptions(reviewId: number): void {
  this.showOptions[reviewId] = !this.showOptions[reviewId];
}
showEditForm = false;
editReview(doctorId: number, review: Review, elderlyId: number): void {
  // Assuming you have an updatedReview object populated with the necessary data
  this.newReview = { ...review }; // Assign the review data to newReview for editing
  this.showEditForm = true; // Show the edit form
}

deleteReview(doctorId: number, reviewId: number, elderlyId: number): void {
  const confirmation = window.confirm('Are you sure you want to delete this review?');
  if (confirmation) {
    console.log("doc",doctorId,"el",elderlyId,"rev",reviewId);

    this.doctorService.deleteReview(doctorId, reviewId, elderlyId)
      .subscribe(response => {
        window.location.reload();
      
        // Handle any further actions after successful deletion
      }, error => {
        if (error.status !== 200) {
          alert('You are not authorized to delete this review.');
  }});    

  }
}
/*
openEditReviewForm(reviewId: number): void {
 console.log("rev iddddddddddd" ,reviewId);
   this.reviewService.getReviewById(reviewId).subscribe(
     (review: Review) => {
       this.newReview = { ...review };
     },
  (error) => {
       console.error('Error fetching review:', error);
     }
   );

 
   this.showReviewForm = true;
}

*/
selectedReviewId: number | undefined;

 openEditReviewForm(reviewId: number): void {
  console.log("rev iddddddddddd", reviewId);
  this.selectedReviewId = reviewId; // Store the reviewId
  this.reviewService.getReviewById(reviewId).subscribe(
    (review: Review) => {
      this.newReview = { ...review };
    },
    (error) => {
      console.error('Error fetching review:', error);
    }
  );
  this.showReviewForm = true;
}

submitReview(): void {
  if (this.completedAppointments.length > 0 && this.newReview.comment && this.newReview.rating) {
    const confirmation = window.confirm('Are you sure you want to submit this review?');
    if (confirmation) {
      // Set the doctorId in the newReview object
      this.newReview.doctorId = this.doctorId;

      if (this.selectedReviewId) {
        // Editing an existing review
        this.doctorService.editReview(this.selectedReviewId, this.newReview, this.elderlyId).subscribe(
          (updatedReview: Review) => {
            console.log('Review updated:', updatedReview);
            // Reload the reviews or perform any other action
            this.closeReviewForm();
            window.location.reload(); // Reload the window after successful upload
          },
          (error) => {
            console.error('Error updating review:', error);
            alert("You are not authorized to update this comment");
          }
        );
      } else {
        // Submitting a new review
        this.reviewService.createReview(this.newReview, this.elderlyId, this.doctorId).subscribe(
          (createdReview: Review) => {
            console.log('Review submitted:', createdReview);
            // Reload the reviews or perform any other action
            this.closeReviewForm();
          },
          (error) => {
            console.error('Error submitting review:', error);
            this.checkArchivedStatus(); // Check archived status after review submission

            alert('Your review contains inappropriate language. Continuing with such behavior may result in a ban from posting reviews.');
          }
        );
      }
    }
  } else {
    if (this.completedAppointments.length === 0) {
      alert('You must have completed appointments with this doctor before submitting a review.');
    } else {
      alert('Please provide both comment and rating.');
    }
  }
}

// Method to check archived status after review submission
private checkArchivedStatus(): void {
  this.reviewService.getArchivedStatus(this.elderlyId).subscribe(
    (isArchived: boolean) => {
      if (isArchived) {
        console.log('User is banned, logging out...', isArchived); // Log that logout is triggered
        this.authService.logout(); // Trigger logout if user is archived
      }
    },
    (error) => {
      console.error('Error fetching archived status:', error);
    }
  );
}


}