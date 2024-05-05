import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../../eventmodel/event.model';
import { saveAs } from 'file-saver'; // Import file-saver for downloading files

import { ActivatedRoute, Router } from '@angular/router';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';


declare var L: any;

@Component({
  selector: 'app-eventelderly',
  templateUrl: './eventelderly.component.html',
  styleUrls: ['./eventelderly.component.css']
})
export class EventelderlyComponent implements OnInit {
  events: Event[] = [];
  imageUrlPrefix = 'http://localhost:80/hazemimage/';
  elderlyId: number;
  participatedEvents: Event[] = [];
  popupVisible: boolean = false;
  userLatitude: number;
  userLongitude: number;
  maxDistance: number=null; // Set initial value to null
  maxPrice: number; // Maximum price for filtering
  minCapacity: number; // Minimum capacity for filtering
  recommendedEvents: Event[] = [];
  showParticipationPopup: boolean = false;
  eventName: string;
  location: string;
  date: string;
    maxCapacity: number;
    maxTicketPrice: number;
    maxEventCapacity: number;
    showTicket: boolean = false; // Initialize to false


  constructor(private eventService: EventService, private route: ActivatedRoute ,private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.elderlyId = +params['elderlyId']; // Convert to number
      console.log('Elderly ID:', this.elderlyId); // Add this line to ensure the elderlyId is retrieved correctly
      
      // Retrieve user's position using Leaflet API
      this.getUserPosition();
    });
    this.fetchRecommendedEvents();


    this.eventService.getMaxTicketPrice().subscribe(
      (price: number) => {
        this.maxTicketPrice = price;
      },
      (error: any) => {
        console.error('Failed to fetch max ticket price:', error);
      }
    );

    this.eventService.getMaxEventCapacity().subscribe(
      (capacity: number) => {
        this.maxEventCapacity = capacity;
      },
      (error: any) => {
        console.error('Failed to fetch max event capacity:', error);
      }
    );
  
    
  }
  

  getUserPosition(): void {
    const map = L.map('map').setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.locate({ setView: true, maxZoom: 16 });

    map.on('locationfound', (e) => {
      this.userLatitude = e.latitude;
      this.userLongitude = e.longitude;

      // Fetch events within the specified distance
      this.getEventsWithinDistance();
    });

    map.on('locationerror', (e) => {
      console.error('Error getting user location:', e.message);
    });
  }

  getEventsWithinDistance(): void {
    // Proceed with fetching events within the specified distance
    if (this.userLatitude !== undefined && this.userLongitude !== undefined) {
      // Call the service method to fetch events within distance with optional filter parameters
      this.eventService.getEventsWithinDistance(
        this.userLatitude,
        this.userLongitude,
        this.maxDistance === null ? 0 : this.maxDistance, // Handle null maxDistance
        this.maxPrice,
        this.minCapacity
      ).subscribe(
        (events: any[]) => {
          console.log('Events within distance:', events);
          this.events = events.map(event => {
            event.imageUrl = `${this.imageUrlPrefix}${event.imageUrl}`;
            return event;
          });
        },
        (error: any) => {
          console.error('Error fetching events within distance:', error);
        }
      );
    } else {
      console.error('User location not available.');
    }
  }
  
  

 

  

  participateInEvent(eventId: number): void {
    const ticketElement = document.getElementById('ticket');
  
    console.log('Event ID:', eventId); // Log the event ID
  
    console.log(`Participating in event with ID ${eventId} and elderly ID ${this.elderlyId}`);
    this.eventService.participateInEvent(eventId, this.elderlyId).subscribe(
      (response: any) => {
        if (response && response.status === 200) {
          console.log('Participation successful:', response);
  
          // Find the event user is participating in
          const event = this.events.find(e => e.eventID === eventId);
          if (event) {
            // Update ticket content
            const eventNameElement = ticketElement.querySelector('.event');
            const eventLocationElement = ticketElement.querySelector('.location p:nth-child(2)');
            const eventDateElement = ticketElement.querySelector('.details.date');
  
            if (eventNameElement) {
              eventNameElement.textContent = event.name; // Update event name
            }
            if (eventLocationElement) {
              eventLocationElement.textContent = event.place; // Update event location
            }
            if (eventDateElement) {
              eventDateElement.textContent = event.date; // Update event date
            }
          }
  
          // Generate PDF
          this.generatePdf(ticketElement);
        }
      },
      (error: any) => {
        console.error('Error participating in event:', error);
        if (error && error.status === 200) {
          console.log('Participation successful:', error);
  
          // Find the event user is participating in
          const event = this.events.find(e => e.eventID === eventId);
          if (event) {
            // Update ticket content
            const eventNameElement = ticketElement.querySelector('.event');
            const eventLocationElement = ticketElement.querySelector('.location p:nth-child(2)');
            const eventDateElement = ticketElement.querySelector('.details.date');
  
            if (eventNameElement) {
              eventNameElement.textContent = event.name; // Update event name
            }
            if (eventLocationElement) {
              eventLocationElement.textContent = event.place; // Update event location
            }
            if (eventDateElement) {
              eventDateElement.textContent = event.date; // Update event date
            }
          }
  
          // Generate PDF
          this.generatePdf(ticketElement);
        }
      }
    );
  }
  
  

generatePdf(ticketElement: HTMLElement): void {
  if (!ticketElement) {
    console.error('Ticket element not found.');
    return;
  }
  ticketElement.style.visibility = 'visible';


  html2canvas(ticketElement).then(canvas => {
    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png');

    // Define PDF
    const pdf = new jspdf.jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Calculate the scaling factor to fit the ticket element in the PDF
    const scaleFactor = Math.min(pdfWidth / ticketElement.offsetWidth, pdfHeight / ticketElement.offsetHeight);

    // Calculate the scaled width and height of the ticket element
    const scaledWidth = ticketElement.offsetWidth * scaleFactor;
    const scaledHeight = ticketElement.offsetHeight * scaleFactor;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', (pdfWidth - scaledWidth) / 2, (pdfHeight - scaledHeight) / 2, scaledWidth, scaledHeight);

    // Download PDF
    pdf.save('event_ticket.pdf');
  }).catch(error => {
    console.error('Error generating PDF:', error);
  });
  ticketElement.style.visibility = 'hidden';

}



  openPopup(): void {
    // Fetch participated events for the elderly
    this.eventService.getEventsForElderly(this.elderlyId)
        .subscribe(
            (events: any) => {
                // Log the response to check the structure of the data
                console.log('Participated events:', events);
                if (events && events.length > 0) {
                    this.participatedEvents = events.map((event: any) => ({
                        name: event.name,
                        date: event.date ? new Date(event.date) : null  // Convert date string to Date object or null if date is null
                    }));
                    this.popupVisible = true; // Open the popup
                } else {
                    console.error('No participated events found.');
                }
            },
            (events: any) => {
              // Log the response to check the structure of the data
              console.log('Participated events:', events);
              if (events && events.length > 0) {
                  this.participatedEvents = events.map((event: any) => ({
                      name: event.name,
                      date: event.date ? new Date(event.date) : null  // Convert date string to Date object or null if date is null
                  }));
                  this.popupVisible = true; // Open the popup
              }}
        );
}

  closePopup(): void {
    this.popupVisible = false; // Close the popup
  }

  isPastDate(dateString: string): boolean {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate < today;
  }

  


  showMore(eventId: number) {
    this.router.navigate(['/showmoreevent/eve', eventId]);
  }
  fetchRecommendedEvents(): void {
    // Fetch recommended events
    this.eventService.recommendEventsForElderly(this.elderlyId).subscribe(
      (events: any[]) => {
        this.recommendedEvents = events.map(event => {
          event.imageUrl = `${this.imageUrlPrefix}${event.imageUrl}`;
          return event;
        });
      },
      (error: any) => {
        console.error('Error fetching recommended events:', error);
      }
    );
  }
}
