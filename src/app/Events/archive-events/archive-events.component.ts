import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Router } from '@angular/router';
import { Event } from '../../eventmodel/event.model';

@Component({
  selector: 'app-archive-events',
  templateUrl: './archive-events.component.html',
  styleUrls: ['./archive-events.component.css']
})
export class ArchiveEventsComponent implements OnInit {
  events: Event[] = [];
  imageUrlPrefix = 'http://localhost:80/hazemimage/';

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.eventService.getAllEvents().subscribe(
      (events: any) => {
        console.log(events);
        this.events = events
          .filter((event: Event) => event.archiveevent == 'not available') // Filter out events where archiveEvent is 'not available'
          .map(event => {
            console.log(event.imageUrl);
            event.imageUrl = `${this.imageUrlPrefix}${event.imageUrl}`;
            return event;
          });
      },
      (error: any) => {
        console.error('Error fetching events: ', error);
      }
    );
  }

  toggleArchive(eventId: number): void {
    this.eventService.toggleEventArchive(eventId).subscribe(
      (response: any) => {
        console.log('Archive status toggled successfully:', response);
        // Handle success as needed
      },
      (error: any) => {
        console.error('Error toggling archive status:', error);
        // Handle error as needed
      }
    );
  }

  navigateToEditEvent(eventId: number): void {
    if (eventId) {
      this.router.navigate(['/admin/editevents', eventId]);
    }
  }
}
