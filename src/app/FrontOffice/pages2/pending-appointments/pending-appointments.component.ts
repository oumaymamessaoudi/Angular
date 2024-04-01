import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from '../../entities/appointment.model';
 import { CalendarService } from '../../services2/calendar.service';

@Component({
    selector: 'app-pending-appointments',
    templateUrl: './pending-appointments.component.html',
    styleUrls: ['./pending-appointments.component.css']
})
export class PendingAppointmentsComponent implements OnInit {
    @Input() doctorId!: number;
    pendingAppointments!: Appointment[];

    constructor(private calendarService: CalendarService ) { }

    ngOnInit(): void {
      //  this.loadPendingAppointments();
    }

    loadPendingAppointments(): void {
    /*    this.calendarService.getPendingAppointments(this.doctorId)
            .subscribe(appointments => this.pendingAppointments = appointments);
    */}
}