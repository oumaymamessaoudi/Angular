import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Elderly } from 'src/app/FrontOffice/entities/elderly.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
  eventsWithElderly: { event: any, elderlyList: Elderly[] }[] = []; // Define the property to hold events with elderly

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.getEventsWithElderly(); // Call the method to fetch events with elderly
  }

  getEventsWithElderly(): void {
    this.eventService.getEventsWithElderly()
      .subscribe(
        (data: { event: Event, elderlyList: Elderly[] }[]) => {
          this.eventsWithElderly = data;
        },
        error => {
          console.error('Error fetching events with elderly:', error);
          // Handle error if needed
        }
      );
  }
  downloadPdf(): void {
    this.eventService.downloadExcelFile().subscribe(
      (blob: Blob) => {
        // Create a new blob object URL for the PDF blob
        const fileURL = URL.createObjectURL(blob);

        // Open the URL in a new tab/window
        window.open(fileURL);

        // Release the object URL after opening
        URL.revokeObjectURL(fileURL);
      },
      error => {
        console.error('Error downloading PDF:', error);
        // Handle error if needed
      }
    );
  }
}
