import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarService } from '../../services2/calendar.service';
import { DoctorCalendarDTO } from '../../entities/doctor-calendar.dto';
import { Appointment } from '../../entities/appointment.model';
import { DatePipe } from '@angular/common';
import { randomColor } from 'randomcolor'; // Import randomColor function

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarId: number; // Add this line
  pendingAppointments: Appointment[] = [];
  completedAppointments: Appointment[] = [];
  rejectedAppointments: Appointment[] = [];


  elderlyId: number; // Add this line
  calendarVisible = true;
  showFormDialog = false; // Track whether to show the form dialog
  calendarOptions: CalendarOptions = {
    
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ], 
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
   // eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDisplay: 'block', // Set event display to 'block'
    displayEventTime: false, // Hide event time




    eventContent: this.handleEventRender.bind(this)

  };
  pendingEvents: EventApi[] = [];

  currentEvents: EventApi[] = [];
  appointmentForm: FormGroup;

  constructor(
    private calendarService: CalendarService,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.appointmentForm = this.formBuilder.group({
      patientName: ['', [Validators.required, Validators.minLength(3)]],
      appFrom: ['', Validators.required],
      appTo: ['', [Validators.required, this.appToAfterAppFromValidator]],
      appFirst: [false], // Default to false
      symptom: [''],
      appStatus: ['PENDING']

    });
  }
  
  appToAfterAppFromValidator(control: AbstractControl): ValidationErrors | null {
    const appFromValue = new Date(control.get('appFrom')?.value);
    const appToValue = new Date(control.get('appTo')?.value);
  
    if (appFromValue >= appToValue) {
      return { appToBeforeAppFrom: true };
    }
  
    return null;
  }
  handleEventRender(info: EventApi) {
    const color = this.getRandomColor();
    info.backgroundColor = color;
    info.borderColor = color;
  }
  updatePendingAppointments(pendingAppointments: Appointment[]) {
    console.log('Pending Appointments:', pendingAppointments);
     
  }
  updateCompletedAppointments(completedAppointments: Appointment[]) {
    console.log('Completed Appointments:', completedAppointments);
     
  }
  updateRejectedAppointments(rejectedAppointments: Appointment[]) {
    console.log('Rejected Appointments:', rejectedAppointments);
     
  }
  ngOnInit() {
    this.route.params.subscribe(params => {

      this.elderlyId = +params['elderlyId']; // Add this line
      this.calendarId = +this.route.snapshot.queryParams['calendarId'];
      this.loadPendingAppointments();

      this.loadCompletedAppointments();
      this.loadRejectedAppointments();

      this.loadAppointments();

    });
    
  }
  
  loadAppointments() {
    this.calendarService.getAppointmentsByCalendarId(this.calendarId).subscribe(
      (appointments: Appointment[]) => {
        this.updateCalendarEvents(appointments);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }
  loadPendingAppointments() {
    this.calendarService.getPendingAppointmentsByElderlyId(this.elderlyId).subscribe(
      (appointments: Appointment[]) => {
        this.pendingAppointments = appointments;
        console.log('Pending Appointments:', this.pendingAppointments);
      },
      (error) => {
        console.error('Error fetching pending appointments:', error);
      }
    );
  }
  loadCompletedAppointments() {
    this.calendarService.getCompletedAppointmentsByElderlyId(this.elderlyId).subscribe(
      (completedAppointments: Appointment[]) => {
        this.completedAppointments = completedAppointments;
        console.log('Completed Appointments:', this.completedAppointments);
      },
      (error) => {
        console.error('Error fetching completed appointments:', error);
      }
    );
  }

  loadRejectedAppointments() {
    this.calendarService.getRejectedAppointmentsByElderlyId(this.elderlyId).subscribe(
      (rejectedAppointments: Appointment[]) => {
        this.rejectedAppointments = rejectedAppointments;
        console.log('Rejected Appointments:', this.rejectedAppointments);
      },
      (error) => {
        console.error('Error fetching rejected appointments:', error);
      }
    );
  }
  goToConsultation(): void {
    // Construct the URL for the consultation
    const consultationUrl = 'https://meet.jit.si/bwb-bfqi-vmh'; // Replace with your consultation URL

    // Redirect the user to the consultation URL
    window.location.href = consultationUrl;
  } 
  updateCalendarEvents(appointments: Appointment[]) {
    const approvedAppointments = appointments.filter(appointment => appointment.appStatus === 'APPROVED');
    const onlineAppointments = appointments.filter(appointment => appointment.appFirst === true);

    const events: EventInput[] = approvedAppointments.map((appointment) => ({
      id: appointment.idAppointment.toString(), // Adjust the property name
      title: appointment.patientName,
      start: new Date(appointment.appFrom), // Convert string to Date
      end: new Date(appointment.appTo),     // Update with the correct property
      color: this.getRandomColor(),
      extendedProps: {
        ['isOnline']: appointment.appFirst === true
      }
    }));

    // Set the events to the FullCalendar
    this.currentEvents = events as EventApi[];
    this.calendarOptions.events = events;
    this.pendingEvents = this.currentEvents.filter(event => event.extendedProps['isOnline']);

    this.changeDetector.detectChanges();
  }

  getRandomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
    // Generates a random hex color code
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {

    const selectedDate = new Date(selectInfo.startStr);
    const today = new Date(); // Get today's date
    
    // Check if the selected date is earlier than today
    if (selectedDate < today) {
      // Display an error message or take appropriate action
      alert('You cannot select a date earlier than today for the appointment.');
      return; // Exit the method
    }
    
    // You can decide when to show the form, for example, when a date is selected
    const startDate = new Date(selectInfo.startStr);
    const endDate = new Date(selectInfo.endStr);
    
  // Pre-fill the form fields
  this.appointmentForm.patchValue({
    patientName: '', // You can set a default value or leave it empty
    appFrom: startDate.toISOString().substring(0, 16), // Set appFrom in ISO string format
    appTo: this.calculateAppTo(startDate).toISOString().substring(0, 16), // Calculate and set appTo
    appFirst: false, // Default to false
    symptom: '', // You can set a default value or leave it empty
  });
  
  // Disable the appTo input field
  setTimeout(() => {
    const appToInput = document.getElementById('appTo') as HTMLInputElement;
    appToInput.disabled = true;
  });

  this.appointmentForm.get('appFrom')?.valueChanges.subscribe((appFrom: string) => {
    const appFromDate = new Date(appFrom);
    appFromDate.setHours(appFromDate.getHours() + 1); // Add 1 hour to appFrom

    const appToDate = this.calculateAppTo(appFromDate);
    this.appointmentForm.patchValue({ appTo: appToDate.toISOString().substring(0, 16) });
  });
    this.showFormDialog = true;
  }


  calculateAppTo(startDate: Date): Date {
    // Clone the startDate to avoid mutating the original date object
    const appTo = new Date(startDate.getTime());
  
    // Add 2 hours to appTo
    appTo.setHours(appTo.getHours() + 1);
  
    return appTo;
  }



  onSubmit() {
    const patientNameControl = this.appointmentForm.get('patientName');
    const appFromControl = this.appointmentForm.get('appFrom');
    const appToControl = this.appointmentForm.get('appTo');
  
    if (
      patientNameControl.valid &&
      patientNameControl.value.length >= 3 &&
      appFromControl.valid &&
      appToControl.valid &&
      this.appToAfterAppFromValidator(this.appointmentForm) === null
    ) {
      // Show a confirmation dialog
      const isConfirmed = confirm('Are you sure you want to submit the form?');
  
      if (isConfirmed) {
        console.log('onSubmit works in calendar component');
        console.log('Form values before submit:', this.appointmentForm.value);
        this.saveAppointment(this.appointmentForm.value);
  
        // Reset the form and hide the dialog
        this.appointmentForm.reset();
        this.showFormDialog = false;
      } else {
        console.log('Form submission cancelled.');
      }
    } else {
      alert('Patient name must have at least 3 letters, and appointment dates must be valid. Please check the fields and try again.');
  
      console.log('Form is invalid. Cannot submit.');
    }
  }
  
  
  saveAppointment(appointmentData: any): void {
    console.log('Saving appointment:', appointmentData);

    this.calendarService.saveAppointmentService(appointmentData,this.elderlyId , this.calendarId).subscribe(
      response => {
        console.log('Appointment saved successfully:', response);
      },
      error => {
        console.error('Error saving appointment:', error);
      }
    );        window.location.reload();

  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  cancelAppointment(id: number): void {
    // Show a confirmation dialog
    const isConfirmed = confirm('Are you sure you want to cancel this appointment?');

    if (isConfirmed) {
      // Call the service method to cancel the appointment
      this.calendarService.cancelAppointment(id).subscribe(() => {
        // Update your data or perform any necessary actions after successful cancellation
        console.log(`Appointment with ID ${id} cancelled successfully.`);
        window.location.reload();

      });
    }
  }






}